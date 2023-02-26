const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const nodemailer = require('nodemailer');
const _ = require("lodash");

const User = require("../models/user");

const {OAuth2Client} = require("google-auth-library");


const googleClient = new OAuth2Client("302955904510-tn732i8k4a4snpimpo6idosmh5iaqkpk.apps.googleusercontent.com");

const resetVerificationtLink = (mailId, type) => {
  return new Promise((resolve,reject)=>{
    User.findOne({ email: mailId })
    .then((user) => {
      if(!user){
        resolve({status: "User Not Found"})
      }
      if(type === 'mailUpdate'){
        user.updateOne({ oldEmailToken:'', newEmailToken:''})
            .then((result)=>{ 
              resolve({status: "Success"}) 
            })
            .catch((err)=>{
              resolve({status: "Failed"})
            })
      }
      else if(type === 'passwordReset'){
        user.updateOne({ passwordResetToken:''})
          .then((result)=>{ 
            resolve({status: "Success"}) 
          })
          .catch((err)=>{
            resolve({status: "Failed"})
          })
      }
    })
  })
}
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

  const token = jwt.sign({ email: email, password: password }, process.env.JWT_KEY, { expiresIn: "2m" });

  
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
                  bcrypt.hash(password, 10).then(hash => {
                    const user = new User({
                      email: email,
                      password: hash,
                      passwordResetToken: '',
                      firstName: '',
                      lastName: '',
                      address: [],
                      phoneNumber: '',
                      profilePic: '',
                      gender: '',
                      dob: '',
                      oldEmailToken: '',
                      newEmailToken: ''
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

exports.editUser = (req,res,next)=>{
  const { token } = req.body;
  if(token){
    jwt.verify(token, process.env.JWT_KEY, (err,decodedToken)=>{
      if(err){
        return res.status(400).json({message: 'Incorrect or Expired Link.'})
      }
      const { userId } = decodedToken;
      User.findOne({ _id: userId })
          .then(user => {
              if(user != null){
                  const updatedUser = new User({
                    _id: userId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    dob: req.body.dob
                  });

                  User.updateOne({_id: userId},  updatedUser)
                    .then((updatedUser)=>{
                      console.log("Updated User", updatedUser);
                      if (updatedUser.n > 0) {
                        User.findOne({ _id: userId })
                          .then((user)=>{
                            res.status(200).json({ message: "Update successful!",
                              user: {
                                userId: user._id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                address: user.address,
                                phoneNumber: user.phoneNumber,
                                profilePic: user.profilePic,
                                gender: user.gender,
                                dob: user.dob
                              }
                            });
                          })
                          .catch((err)=>{
                            res.status(200).json({ message: "Update User cannot be found",  err: err });
                          })
                      } else {
                        res.status(401).json({ message: "Not authorized!" });
                      }
                    })
                    .catch((err)=>{
                      res.status(500).json({
                        message: "Couldn't udpate User!"
                      });
                    })
                }
              else{
                return res.status(400).json({
                  message: "User with this User Id does not exists.",
                  });
              }
          })
          .catch((err) => {
              return res.status(400).json({
                message: "User ID cannot be checked for existance."
                });
          })
      });
  }
}
    
exports.userLogin = (req, res, next) => {
  console.log("User Login Request",req);
  let fetchedUser={};
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "User with this MailId does not exist"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {                                    //Checking whether result is null
        return res.status(401).json({
          message: "Auth failed. Password Incorrect!"
        });
      }
      if(result === true){                                       //Checking whether result is true, other error cases are false and unwanted object
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          email: fetchedUser.email,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          gender: fetchedUser.gender,
          phoneNumber: fetchedUser.phoneNumber,
          profilePic: fetchedUser.profilePic,
          address : fetchedUser.address,
          dob: fetchedUser.dob
        });
      }
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.forgetPassword = (req,res,next) => {
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
      const resetPasswordOtp = Math.floor(Math.random() * 9000 + 1000);
      const passwordResetToken = jwt.sign({_id: user.id}, resetPasswordOtp.toString(), {expiresIn:'2m'});
      return user.updateOne({passwordResetToken:passwordResetToken})
                  .then((result)=>{  
                    smtpTransport.sendMail({
                      to: email,
                      from: 'noreplay@gmail.com',
                      subject: 'Password Reset Otp',
                      html: `Your otp to change mail address is ${resetPasswordOtp} and valid for 2 minutes, Please do not reveal your otp to anyone else.`
                      })
                      .then((result) => {
                        return res.status(200).json({
                          message: "Reset Password Token has been set."
                        }); 
                      })
                      .catch((err) =>{
                        return res.status(400).json({
                          message: "Reset Password Token Cannot been set."
                        }); 
                      })
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
  const { emailId, passwordResetOtp, newPassword } = req.body;
  console.log(passwordResetOtp, newPassword);
  if(passwordResetOtp){
    // jwt.verify(, passwordResetOtp, (err,decodedToken)=>{
    //   if(err){
    //     return res.status(400).json({message: 'Incorrect token or Expired Link.'})
    //   }
      User.findOne({ email: emailId })
          .then(user => {
              if(!user){
                  return res.status(202).json({
                    status: 'Failed',
                    message: "User with this email does not exists.",
                    });
                }
              
              jwt.verify(user.passwordResetToken, passwordResetOtp, (err,decodedToken)=>{
                if(err){
                  return res.status(202).json({
                    status: 'Failed',
                    message: 'Incorrect token or Expired Link.'
                  })
                }
                else{
                  bcrypt.hash(newPassword, 10).then(hash => {
                   const obj = {
                     password: hash,
                     passwordResetToken: ''
                   }
                   user = _.extend(user,obj)
                   user.save()
                     .then((result)=>{
                            user.updateOne({passwordResetToken:''})
                            .then((result)=>{  
                              console.log("passwordResetToken Link is emptied");
                            })
                            .catch((err)=>{
                              console.log("passwordResetToken Cannot be emptied. ") 
                            })
                       return res.status(200).json({
                         status: 'Completed',
                         message: "Your password has been changed",
                         success: true
                         });
                     })
                     .catch((error)=>{
                       return res.status(202).json({
                         status: 'Failed',
                         message: "Reset Password Error",
                         });
                     })
                  });
                }
              })

          })
          .catch((err) => {
              return res.status(202).json({
                status: 'Failed',
                message: "User Password cannot be checked for existance."
                });
          })
      // });

  }
  else{
    return res.status(202).json({
      status: 'Failed',
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


exports.changeMailId = (req, res, next)=>{
        console.log("Replae Existing Email Request", req.body);
        const {oldEmail, newEmail, password } = req.body;
        User.findOne({ email: oldEmail, })
          .then(user => {
            if(user != null){
             bcrypt
              .compare(password, user.password)
              .then((result)=>{
                if(result === true){
                  const firstOtp = Math.floor(Math.random() * 9000 + 1000);
                  const secondOtp = Math.floor(Math.random() * 9000 + 1000);
                  const oldEmailToken = jwt.sign({ email: oldEmail, password: password }, firstOtp.toString(), { expiresIn: "1m" });
                  const newEmailToken = jwt.sign({ email: newEmail, password: password }, secondOtp.toString(), { expiresIn: "1m" });
                  
                  const smtpTransport = nodemailer.createTransport({
                    service: 'SendinBlue', 
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD
                      }
                    });
                  user.updateOne({oldEmailToken:oldEmailToken})
                      .then((result)=>{  
                        console.log("User Password Changed", result);
                        smtpTransport.sendMail({
                          to: oldEmail,
                          from: 'noreplay@gmail.com',
                          subject: 'Password Reset Link',
                          html: `Your otp to change mail address is ${firstOtp}, Please do not reveal your otp to anyone else.`
                              })
                              .then((res) => console.log("Old Token Saved in db, Email Successfully Sent to",oldEmail))
                              .catch((err) => console.log("Email cannot be sent for email updation ", err))
                       })
                      .catch((err)=>{
                        return res.status(400).json({
                          message: "Reset Password Link Expired for old email"
                        }); 
                       })
    
                  user.updateOne({newEmailToken:newEmailToken})
                       .then((result)=>{  
                         console.log("User Password Changed", result);
                         smtpTransport.sendMail({
                           to: newEmail,
                           from: 'noreplay@gmail.com',
                           subject: 'Password Reset Link',
                           html: `Your otp to change mail address is ${secondOtp}, Please do not reveal your otp to anyone else.`
                               })
                               .then((result) => { 
                                console.log("New Token saved in DB, Email Successfully Sent to",newEmail)
                                return res.status(200).json({
                                  message: "Otp set to both mail id"
                                }); 
                               })
                               .catch((err) => console.log("Email cannot be sent for email updation ", err))
                        })
                       .catch((err)=>{
                         return res.status(400).json({
                           message: "Reset Password Link Expired for new email"
                         }); 
                        })
                  
                  // setTimeout(()=>{
                  //   user.updateOne({oldEmailToken:''})
                  //      .then((result)=>{  
                  //        console.log("oldEmailToken token Expired and removed from DB using SetTimeOut")
                  //       })
                  //      .catch((err)=>{
                  //        return res.status(400).json({
                  //          message: "Cannot reset  the oldEmailToken"
                  //        }); 
                  //       })
    
                  //   user.updateOne({newEmailToken:''})
                  //      .then((result)=>{  
                  //       console.log("newEmailToken token Expired and removed from DB using Second SetTimeOut")
                  //       })
                  //      .catch((err)=>{
                  //        return res.status(400).json({
                  //          message: "Cannot reset  the newEmailToken"
                  //        }); 
                  //       })
                  // // },120000)
                  // },15000)
                }
                else{
                  return res.status(400).json({
                    message: "Password is incorrect"
                  }); 
                }
              })
              .catch((err)=>{
                return res.status(400).json({
                  message: "Password authentication failed"
                }); 
              })
            }
            else{
              return res.status(400).json({
                message: "User with this email does not exists.",
                user: user
              });
            }
          })
          .catch((err) => {
            return res.status(400).json({
              message: "User email cannot be checked for existance."
            });
          })

        }

exports.updateEmail = (req, res, next) => {
          const { newMailOtp } = req.body;
          const { oldMailOtp } = req.body;
          const { oldMailId } = req.body;
          const { newMailId } = req.body;
          if(oldMailId){
            User.findOne({ email: oldMailId })
                        .then((user)=>{
                              if(!user){
                                return res.status(400).json({
                                  message: "User with this email does not exists.",
                                  });
                              }
                              jwt.verify(user.oldEmailToken, oldMailOtp, (err,decodedToken)=>{
                                if(err){
                                  user.updateOne({ email: oldMailId, oldEmailToken:'', newEmailToken:''})
                                  .then((result)=>{  
                                    console.log("After unsuccessfull transaction, Token ts emptied.");
                                    return res.status(200).json({
                                      message: 'After unsuccessfull transaction, Token is emptied. Generate new otp to start update mail.',
                                    })
                                  })
                                  .catch((err)=>{
                                    return res.status(400).json({
                                      message: "Cannot Update the newMail"
                                    }); 
                                  })
                                  // return res.status(400).json({message: 'Incorrect or Expired old otp.'})
                                }
                                if(decodedToken){
                                  jwt.verify(user.newEmailToken, newMailOtp, (err,newDecodedToken)=>{
                                    if(err){
                                      user.updateOne({ email: oldMailId, oldEmailToken:'', newEmailToken:''})
                                          .then((result)=>{  
                                            console.log("After unsuccessfull transaction, Token ts emptied.");
                                            return res.status(200).json({
                                              message: 'After unsuccessfull transaction, Token is emptied. Generate new otp to start update mail.',
                                            })
                                          })
                                          .catch((err)=>{
                                            return res.status(400).json({
                                              message: "Cannot Update the newMail"
                                            }); 
                                          })
                                      // return res.status(400).json({message: 'Incorrect or Expired newotp.'})
                                    }
                                    if(newDecodedToken){
                                      user.updateOne({ email: newDecodedToken.email, oldEmailToken:'', newEmailToken:''})
                                          .then((result)=>{  
                                            console.log("Mail Id Updated");
                                            return res.status(200).json({
                                              message: 'New Mail Id updated.',
                                              user: new User()
                                            })
                                          })
                                          .catch((err)=>{
                                            return res.status(400).json({
                                              message: "Cannot Update the newMail"
                                            }); 
                                          })
                                    }
                                  })
                                }
                              });

                        })
                        .catch((err)=>{
                          return res.status(400).json({
                            message: "Cannot find the user with the emailId"
                          }); 
                        })
          }
          else{
            return res.status(400).json({
              message: "Old Mail Id is missing"
              });
          }
        }

exports.clearVerificationLink = (req, res, next)=>{
  const { mailId, type } = req.body
  resetVerificationtLink(mailId,type)
                      .then((result)=>{
                        if(result && result.status === "Success"){
                          return res.status(200).json({
                            message: 'After unsuccessfull transaction, Token is emptied. Generate new otp to start update mail.',
                          })
                        }
                        else if(result && result.status === "User Not Found"){
                          return res.status(400).json({
                            message: "User with this email does not exists.",
                            });
                        }
                        else if(result && result.status === "Failed"){
                          return res.status(400).json({
                            message: "Cannot Clear the token"
                          }); 
                        }
                      })
                      .catch((err)=>{
                        return res.status(400).json({
                          message: "Cannot Clear the token"
                        }); 
                      })
}