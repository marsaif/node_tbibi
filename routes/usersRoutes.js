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
var mailer =  require('../utils/mailer')
const { v4: uuidv4 } = require('uuid');


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
            if(!user.verified)
            {
              res.status(400).json({message:"Account not verified"})
            }
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
                  }, process.env.PRIVATE_KEY, { expiresIn: '24h' });
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


router.post('/active',
  function (req, res, next) {
    let payload = null
    try {
        payload = jwt.verify(
           req.body.token,
           process.env.USER_VERIFICATION_TOKEN_SECRET
        );
        console.log(payload.ID)
          User.findOneAndUpdate({_id:payload.ID} , {verified:true},(err, data) => {

            res.send("user verified");
          } )
      } catch (err) {
        return res.status(500).send(err);
    }

  });



  router.post('/resetpassword',
  function (req, res, next) {
    
    const email = req.body.email

    User.findOne({email:email})
    .then(user => {
      if(!user)
      {
        res.status(404).json({message:"user exist"});
      }
      const resetpassword = uuidv4()
      user.resetpassword=resetpassword
      user.save()
      mailer.ChangePassword(user.email,user.resetpassword)
      res.send("email send")
    })
    
  });


  router.post('/verify-resetpassword',
  function (req, res, next) {
    
    const resetpassword = req.body.resetpassword

    User.findOne({resetpassword:resetpassword})
    .then(user => {
      if(!user)
      {
        res.status(400).json({message:"user not found "})
      }
      user.resetpassword=""
      user.save()
      res.send({id:user.id})
    })
    
  });


  
  router.post('/update-password',
  function (req, res, next) {
    
    const {id,password} = req.body

    const hash = bcrypt.hashSync(password, 10) //hashed password

    User.findByIdAndUpdate({_id:id},{password:hash})
    .exec()

   
    res.send("password changed")
    
  });

  
router.put("/profile", passport.authenticate("jwt", { session: false }),
 function (req, res, next) {
  const user = req.body;
  try {
    User.findByIdAndUpdate({_id:req.user.id}, user , (err, data) => {
  
      res.send("data updated");

     // res.status(400).json({"message":"Email existe"})
  
    });
  } catch (error) {
    res.status(400).send(error)
    
  }

});

router.get('/getUser', passport.authenticate("jwt", { session: false }),
function (req, res, next) {
  res.json({"user":req.user})
});

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
          user.save().then((user)=>{
            const verificationToken = user.generateVerificationToken();
            mailer.sendVerifyMail(user.email,verificationToken)

            res.send("user added");
            
          });
          

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

module.exports = router;
