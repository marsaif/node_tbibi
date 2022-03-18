var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require("passport");
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken')
const { ROLES, inRole } = require("../security/Rolemiddleware");
const ValidateRegister = require("../validation/Register");
const ValidateLogin = require("../validation/Login");




/* GET users listing. */
router.get('/', passport.authenticate("jwt", { session: false }), inRole(ROLES.ADMIN),
  function (req, res, next) {
    User.find({}, function (err, users) {
      res.send(users)
    });
  });

router.post('/', function (req, res, next) {

  const { errors, isValid } = ValidateRegister(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      user.findOne({ email: req.body.email }).then(async (exist) => {
        if (exist) {
          errors.email = "user exist";
          res.status(404).json(errors);
        } else {
          const hash = bcrypt.hashSync(req.body.password, 10) //hashed password
          req.body.password = hash;
          const user = new User(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: req.body.password,
              phone: req.body.phone,
              role: req.body.role,
              birthDate: req.body.birthDate,
              sex: req.body.sex,
              Adress: req.body.Adress,
              premium: req.body.premium,

            }
          );
          user.save().then();
          res.send('user saved');

        }
      })
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
});


router.get("/:id", function (req, res, next) {
  id = req.params.id;
  console.log(id);
  User.findById(id, (err, data) => {
    console.log(data)
    res.send(data)
  }
  );
});

router.put("/:id", function (req, res, next) {
  id = req.params.id;
  firstName = req.body.firstName
  User.findByIdAndUpdate(id, { firstName: firstName }, (err, data) => {
    res.send("data updated");
  });
});

router.delete('/:id', function (req, res, next) {
  id = req.params.id;
  User.findByIdAndDelete(id, (err, data) => {
    res.send("data deleted" + data);
  });
});

router.post("/login", (req, res, next) => {
  const { errors, isValid } = ValidateLogin(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      user.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            errors.email = "not found user"
            res.status(404).json(errors)
          } else {
            bcrypt.compare(req.body.password, user.password)
              .then(isMatch => {
                if (!isMatch) {
                  errors.password = "incorrect password"
                  res.status(404).json(errors)
                } else {
                  var token = jwt.sign({
                    id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role
                  }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
                  res.status(200).json({
                    message: "success",
                    token: "Bearer " + token
                  })
                }
              })
          }
        })
    }
  } catch (error) {
    res.status(404).json(error.message);
  }

})

module.exports = router;
