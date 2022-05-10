var express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const ValidateRegister = require("../validation/Register");
const ValidateLogin = require("../validation/Login");
var mailer = require("../utils/mailer");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const scraping = require("../utils/scraping");

let path = require("path");

router.get("/medtn/:speciality", async function (req, res, next) {
  var data = await scraping(req.params.speciality);
  res.send(data);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.post("/upload-photo", upload.single("photo"), async (req, res) => {
  const photo = req.file.filename;
  console.log(photo);
  const oldUser = await User.findById(req.body.id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body.id },
    { image: photo }
  );
  if (!updatedUser) {
    return res.status(400).json({ message: "user does not exist" });
  }
  fs.unlink(`images/${oldUser.image}`, () => console.log("success"));
  return res.status(200).json(photo);
});

router.post("/statrole", async function (req, res, next) {
  let admins = await User.find({ role: "ADMIN" });
  let doctors = await User.find({ role: "DOCTOR" });
  let patients = await User.find({ role: "PATIENT" });

  res.send({
    admins: admins.length,
    doctors: doctors.length,
    patients: patients.length,
  });
});

router.post("/statverif", async function (req, res, next) {
  let verify = await User.find({ verified: true });
  let notVerify = await User.find({ verified: false });

  res.send({ verify: verify.length, notVerify: notVerify.length });
});

router.post("/login", (req, res, next) => {
  const { isValid } = ValidateLogin(req.body);
  try {
    if (!isValid) {
      res.status(400).json({ message: "invalid data" });
    } else {
      user.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          res.status(400).json({ message: "user not found" });
        } else {
          if (!user.verified) {
            res.status(400).json({ message: "Account not verified" });
          }
          bcrypt.compare(req.body.password, user.password).then((isMatch) => {
            if (!isMatch) {
              res.status(400).json({ message: "incorrect password" });
            } else {
              if (!user.accepted && user.role === "DOCTOR") {
                return res
                  .status(400)
                  .json({ message: "Account not accepted" });
              }
              var token = jwt.sign(
                {
                  id: user._id,
                  firstName: user.firstName,
                  email: user.email,
                  role: user.role,
                },
                process.env.PRIVATE_KEY,
                { expiresIn: "24h" }
              );
              res.status(200).json({
                accessToken: token,
                user: user,
              });
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/active", function (req, res, next) {
  let payload = null;
  try {
    payload = jwt.verify(
      req.body.token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
    console.log(payload.ID);
    User.findOneAndUpdate(
      { _id: payload.ID },
      { verified: true },
      (err, data) => {
        res.send("user verified");
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/resetpassword", function (req, res, next) {
  const email = req.body.email;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "user exist" });
    }
    const resetpassword = uuidv4();
    user.resetpassword = resetpassword;
    user.save();
    mailer.ChangePassword(user.email, user.resetpassword);
    res.send("email send");
  });
});

router.post("/verify-resetpassword", function (req, res, next) {
  const resetpassword = req.body.resetpassword;

  User.findOne({ resetpassword: resetpassword }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "user not found " });
    }
    user.resetpassword = "";
    user.save();
    res.send({ id: user.id });
  });
});

router.post("/update-password", function (req, res, next) {
  const { id, password } = req.body;

  const hash = bcrypt.hashSync(password, 10); //hashed password

  User.findByIdAndUpdate({ _id: id }, { password: hash }).exec();

  res.send("password changed");
});

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    const user = req.body;
    try {
      User.findByIdAndUpdate({ _id: req.user.id }, user, (err, data) => {
        res.send("data updated");

        // res.status(400).json({"message":"Email existe"})
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.json({ user: req.user });
  }
);

/* GET users listing. */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  inRole(ROLES.ADMIN),
  function (req, res, next) {
    User.find({}, function (err, users) {
      res.send(users);
    });
  }
);

/* GET users listing. */
router.get("/lstpatients", function (req, res, next) {
  User.find({ role: "PATIENT" }, function (err, users) {
    res.send(users);
  });
});

/* GET doctors listing. */
router.get("/lstdoctors", function (req, res, next) {
  User.find({ role: "DOCTOR" }, function (err, users) {
    res.send(users);
  });
});

router.get("/lstDoctor", function (req, res, next) {
  User.find({ role: "DOCTOR" }, function (err, users) {
    // let pro = users[1].get("ratings", null, {getters: false});
    // const getReviewNum = (elt) => {
    //     let rat = elt.get("ratings", null, {getters: false});
    //     let review = 0
    //     for (let i = 1; i < 6; i++) {
    //         review += rat[i]
    //     }
    //     return review
    // }
    let reviewArr = [];
    users.forEach((elt) => {
      let prod = elt.get("ratings", null, { getters: false });
      let rat = 0;
      for (let i = 1; i < 6; i++) {
        rat += prod[i];
      }
      reviewArr.push(rat);
    });
    console.log("reviewArr", reviewArr);

    // const newArr = users.map((elt) => ({
    //     ...elt, reviwNum: getReviewNum(elt)
    // }))
    // console.log(newArr);
    // res.send(users)
    res.json({
      data: users,
      revArr: reviewArr,
    });
  }).sort({ ratings: 1 });
});

router.put(
  "/rating/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.id;
    let rating = req.body;
    const r = rating.value;
    let key = `ratings.${r}`;
    user
      .findByIdAndUpdate(id, { $inc: { [key]: 1 } }, { new: true })
      .then(() => {
        res.send(200);
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log(id);
    console.log(rating.value);

    res.status(200);
  }
);

router.post(
  "/becomepremium",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    const user = req.body;
    try {
      User.findByIdAndUpdate(
        { _id: req.user.id },
        { premium: true },
        (err, data) => {
          res.send("compte premium");
        }
      );
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.post("/", function (req, res, next) {
  const { isValid } = ValidateRegister(req.body);
  try {
    if (!isValid) {
      res.status(404).json({ message: "invalid data" });
    } else {
      user.findOne({ email: req.body.email }).then(async (exist) => {
        if (exist) {
          res.status(404).json({ message: "user exist" });
        } else {
          const hash = bcrypt.hashSync(req.body.password, 10); //hashed password
          req.body.password = hash;
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
            birthDate: req.body.birthDate,
            sex: req.body.sex,
            adress: req.body.adress,
            premium: false,
            speciality: req.body.speciality,
          });
          user.save().then((user) => {
            const verificationToken = user.generateVerificationToken();
            mailer.sendVerifyMail(user.email, verificationToken);

            res.send("user added");
          });
        }
      });
    }
  } catch (error) {
    res.status(404).json({ message: "error" });
  }
});

router.get("/:id", function (req, res, next) {
  id = req.params.id;
  console.log(id);
  User.findById(id, (err, data) => {
    console.log(data);
    res.send(data);
  });
});

router.put("/:id", function (req, res, next) {
  id = req.params.id;
  firstName = req.body.firstName;
  User.findByIdAndUpdate(id, { firstName: firstName }, (err, data) => {
    res.send("data updated");
  });
});

router.delete("/:id", function (req, res, next) {
  id = req.params.id;
  User.findByIdAndDelete(id, (err, data) => {
    res.send("data deleted" + data);
  });
});

router.post("/accept-doctor", function (req, res, next) {
  const id = req.body.id;

  User.findById({ _id: id }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "user not found " });
    }
    user.accepted = true;
    user.save();
    res.json({ message: "user accepted " });
  });
});

module.exports = router;
