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

  const {  isValid } = ValidateRegister(req.body);
  try {
    if (!isValid) {
      res.status(404).json({message:"invalid data"});
    } else {
      user.findOne({ email: req.body.email }).then(async (exist) => {
        if (exist) {
          res.status(404).json({message:"user exist"});
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
              adress: req.body.adress,
              premium: req.body.premium,
              speciality: req.body.speciality

            }
          );
          user.save().then();
          res.send('user saved');

        }
      })
    }
  } catch (error) {
    res.status(404).json({message:"error"});
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
  const { isValid } = ValidateLogin(req.body);
  try {
    if (!isValid) {
      res.status(400).json({message:"invalid data"});
    } else {
      user.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            res.status(400).json( {message:"user not found"})
          } else {
            bcrypt.compare(req.body.password, user.password)
              .then(isMatch => {
                if (!isMatch) {
                  res.status(400).json({message:"incorrect password"})
                } else {
                  var token = jwt.sign({
                    id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role
                  }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
                  res.status(200).json({
                    accessToken: token,
                    user: user
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
