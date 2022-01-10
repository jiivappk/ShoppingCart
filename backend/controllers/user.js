const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const nodemailer = require('nodemailer');
const _ = require("lodash");

const {OAuth2Client} = require("google-auth-library");

const User = require("../models/user");

const googleClient = new OAuth2Client(
  "302955904510-tn732i8k4a4snpimpo6idosmh5iaqkpk.apps.googleusercontent.com");


// exports.createUser = (req, res, next) => {
//   // console.log("Password is",req.body.password)
//   bcrypt.hash(req.body.password, 10).then(hash => {
//     const user = new User({
//       email: req.body.email,
//       password: hash
//     });
//     user
//       .save()
//       .then(result => {
//         res.status(201).json({
//           message: "User created!",
//           result: result
//         });
//       })
//       .catch(err => {
//         res.status(500).json({
//           message: "Invalid authentication credentials!"
//         });
//       });
//   });
// }

exports.signIn = (req, res, next)=>{

  console.log("SignIn Request", req.body);
  const {email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if(user != null){
        return res.status(400).json({
          message: "User with this email id already exists.",
          user: user
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "User email cannot be checked for existance."
      });
    })

  const token = jwt.sign({ email: email, password: password }, process.env.JWT_KEY, { expiresIn: "20m" });

  
  const smtpTransport = nodemailer.createTransport({
    service: 'SendinBlue', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  console.log("Client Url is", process.env.CLIENT_URL);
  smtpTransport.sendMail({
    to: 'jeevananthann97@gmail.com',
    from: 'noreplay@gmail.com',
    subject: 'Signup verification',
    html: `<h1>Please verify your email</h1><a href=${process.env.CLIENT_URL}/auth/createUser/${token}> 
           <button>Verify</button></a>`
        })
        .then((res) => console.log("Email Successfully Sent",`${process.env.CLIENT_URL}/auth/createUser/${token}`))
        .catch((err) => console.log("Failed ", err))

} 

exports.createUser = (req, res, next) => {
  // console.log("Password is",req.body.password)
  // bcrypt.hash(req.body.password, 10).then(hash => {
  //   const user = new User({
  //     email: req.body.email,
  //     password: hash
  //   });
  //   user
  //     .save()
  //     .then(result => {
  //       res.status(201).json({
  //         message: "User created!",
  //         result: result
  //       });
  //     })
  //     .catch(err => {
  //       res.status(500).json({
  //         message: "Invalid authentication credentials!"
  //       });
  //     });
  // });
  console.log("Create User route is called");
  const { token } = req.body;
  if(token){
      jwt.verify(token, process.env.JWT_KEY, (err,decodedToken)=>{
          if(err){
            return res.status(400).json({message: 'Incorrect or Expired Link.'})
          }
          const {email, password} = decodedToken;
          console.log("Decoded email and Password", email, password);
          User.findOne({ email: email })
              .then(user => {
                  if(user != null){
                      return res.status(400).json({
                        message: "User with this email id already exists.",
                        user: user
                        });
                    }
                  // const newUser =new User({email:email, password: password});
                  // newUser.save()
                  //   .then(result=>{
                  //     res.status(201).json({
                  //               message: "User created!",
                  //               result: result
                  //             });
                  //   })
                  //   .catch(err=>{
                  //     res.status(500).json({
                  //               message: "Error creating account"
                  //             });
                  //   })
                  bcrypt.hash(password, 10).then(hash => {
                    const user = new User({
                      email: email,
                      password: hash
                    });
                    user
                      .save()
                      .then(result => {
                        res.status(201).json({
                          message: "User created!",
                          result: result
                        });
                      })
                      .catch(err => {
                        res.status(500).json({
                          message: "Something went wrong, User cannot be created!"
                        });
                      });
                  });

              })
              .catch((err) => {
                  return res.status(400).json({
                    message: "User email cannot be checked for existance."
                    });
              })
      });
  }
  else{
    return res.status(400).json({
      message: "Verification token is missing!!"
      });
  }
}
    
exports.userLogin = (req, res, next) => {
  console.log("User Login Request",req);
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.forgotPassword = (req,res,next) => {
  const { email } = req.body;
  const smtpTransport = nodemailer.createTransport({
    service: 'SendinBlue', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  User.findOne({ email: email })
      .then(user => {
      if (!user) {
        return res.status(400).json({
          message: "User with this email id does not exists"
        });
      }
      fetchedUser = user;
      const token = jwt.sign({_id: user.id}, process.env.JWT_RESET_PASSWORD, {expiresIn:'20m'});
      console.log("Client Url is", process.env.CLIENT_URL);
      return user.updateOne({resetLink:token})
                  .then((result)=>{  
                    console.log("User Password Changed", result);
                    smtpTransport.sendMail({
                      to: 'jeevananthann97@gmail.com',
                      from: 'noreplay@gmail.com',
                      subject: 'Password Reset Link',
                      html: `<h1>Please click on the following link to reset your password</h1><a href=${process.env.CLIENT_URL}/auth/resetPassword/${token}> 
                             <button>Verify</button></a>`
                          })
                          .then((res) => console.log("Email Successfully Sent",`${process.env.CLIENT_URL}/auth/resetPassword/${token}`))
                          .catch((err) => console.log("Email cannot be sent for password reset ", err))
                   })
                  .catch((err)=>{
                    return res.status(400).json({
                      message: "Reset Password Link Expired"
                    }); 
                   })
    
      
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
  
}

exports.resetPassword = (req, res)=>{
  console.log("Reset Password is called")
  const { resetLink, newPassword } = req.body;
  console.log(resetLink, newPassword);
  if(resetLink){
    jwt.verify(resetLink, process.env.JWT_RESET_PASSWORD, (err,decodedToken)=>{
      if(err){
        return res.status(400).json({message: 'Incorrect token or Expired Link.'})
      }
      console.log("Decoded Token",decodedToken);
      User.findOne({ resetLink: resetLink })
          .then(user => {
              if(!user){
                  return res.status(400).json({
                    message: "User with this token does not exists.",
                    });
                }

              // const obj = {
              //   password: newPassword
              // }
              bcrypt.hash(newPassword, 10).then(hash => {
               const obj = {
                 password: hash,
                 resetLink: ''
               }
               user = _.extend(user,obj)
               user.save()
                 .then((result)=>{
                   return res.status(200).json({
                     message: "Your password has been changed",
                     });
                 })
                 .catch((error)=>{
                   return res.status(400).json({
                     message: "Reset Password Error",
                     });
                 })
              });

              // user = _.extend(user,obj)
              // user.save()
              //   .then((result)=>{
              //     return res.status(200).json({
              //       message: "Your password has been changed",
              //       });
              //   })
              //   .catch((error)=>{
              //     return res.status(400).json({
              //       message: "Reset Password Error",
              //       });
              //   })

          })
          .catch((err) => {
              return res.status(400).json({
                message: "User email cannot be checked for existance."
                });
          })
      });

  }
  else{
    return res.status(401).json({
      message: "Authentication Error!"
    });

  }

}

exports.googleLogin = (req, res, next) => {
  console.log("User GoogleLogin Request",req.body);
  let tokenId = req.body.idToken;
  let fetchedUser;
  googleClient.verifyIdToken({idToken:tokenId, audience: "302955904510-tn732i8k4a4snpimpo6idosmh5iaqkpk.apps.googleusercontent.com"})
      .then((response)=>{
        const {email_verified, name, email} = response.payload;
        console.log("Email_Verified",email_verified)
        console.log("Response.Payload",response.payload);
        if(email_verified){
          User.findOne({ email: email })
            .then(user => {
              if (!user) { 
                bcrypt.hash(email+process.env.JWT_KEY, 10).then(hash => {
                  const user = new User({
                    email: email,
                    password: hash
                  });
                  user
                    .save()
                    .then(user => {
                      const token = jwt.sign(
                        { email: user.email, userId: user._id },
                        process.env.JWT_KEY,
                        { expiresIn: "1h" }
                      );
                      return res.status(201).json({
                        message: "New User created!",
                        token: token,
                        expiresIn: 3600,
                        userId: user._id
                      });
                    })
                    .catch(err => {
                      return res.status(500).json({
                        message: "Invalid authentication credentials!"
                      });
                    });
                });
              }
              else{
                fetchedUser = user;
                const token = jwt.sign(
                  { email: fetchedUser.email, userId: fetchedUser._id },
                  process.env.JWT_KEY,
                  { expiresIn: "1h" }
                );
                res.status(200).json({
                  message: "User already registered",
                  token: token,
                  expiresIn: 3600,
                  userId: fetchedUser._id
                });
              }
            })
            .catch(err => {
              return res.status(401).json({
                message: "Invalid authentication credentials!"
              });
            });
        }
      })
 
}

exports.facebookLogin = (req, res, next) =>{
     const {accessToken, userID} = req.body;
     console.log("Access Token", accessToken);
     console.log("UserID", userID);
     let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
     axios.get(urlGraphFacebook)
     .then(response=>{
       const {email, name} = response.data
       console.log("Response of Email verification", email,name);
       User.findOne({ email: email })
            .then(user => {
              if (!user) { 
                bcrypt.hash(email+process.env.JWT_KEY, 10).then(hash => {
                  const user = new User({
                    email: email,
                    password: hash
                  });
                  user
                    .save()
                    .then(user => {
                      const token = jwt.sign(
                        { email: user.email, userId: user._id },
                        process.env.JWT_KEY,
                        { expiresIn: "1h" }
                      );
                      return res.status(201).json({
                        message: "New User created!",
                        token: token,
                        expiresIn: 3600,
                        userId: user._id
                      });
                    })
                    .catch(err => {
                      return res.status(500).json({
                        message: "Invalid authentication credentials!"
                      });
                    });
                });
              }
              else{
                fetchedUser = user;
                const token = jwt.sign(
                  { email: fetchedUser.email, userId: fetchedUser._id },
                  process.env.JWT_KEY,
                  { expiresIn: "1h" }
                );
                res.status(200).json({
                  message: "User already registered",
                  token: token,
                  expiresIn: 3600,
                  userId: fetchedUser._id
                });
              }
            })
            .catch(err => {
              return res.status(401).json({
                message: "Invalid authentication credentials!"
              });
            });
       
     })
}
