const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");

require("../db/connection");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send(`Home Page Router  `);
});

// When User enter any data with 'POST' we get it
// router.post('/register', (req, res) => {
// HOW TO SHOW DATA IN POSTMAN

// console.log(req.body);
// res.json({message:req.body});
// res.send('MY Register Page');

//CREATING DATABASE VALIDATION using PROMISES

// router.post('/register', (req, res) => {
// const {name, email, phone, work, password, cpassword} = req.body;
// if(!name || !email || !phone || !work || !password || !cpassword){
//     return res.status(422).json({error: "Plz fill the data properly" });
// }

// User.findOne({ email:email })
// .then((userExist) => {
//     if(userExist) {
//         return res.status(422).json({error: "Email already exist" });
//     }

//     const user = new User({name, email, phone, work, password, cpassword});

//     user.save().then(() => {
//         res.status(201).json({message: "Registered Successfully"})
//     }).catch((err) => res.status(500).json({error: "Failed to register"}));
// }).catch(err => {console.log(err); });




// USER REGISTERATION USING ASYNC- AWAIT

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill the data properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }else if (password != cpassword) {
        return res.status(422).json({ error: "Password and Cpassword not matching" });
    } else {
        const user = new User({ name, email, phone, work, password, cpassword });

        const userRegister = await user.save();
        res.status(201).json({ message: "Registered Successfully" });
    }

    
    
    // if (userRegister) {
    //   res.status(201).json({ message: "Registered Successfully" });
    // }


  } catch (err) {
    console.log(err);
  }
});




// USER LOGIN WITH VALIDATION

router.post('/login', async (req, res) => {

    // This is for testing the login with Postman

    // console.log(req.body);
    // res.json({message: "Login Data"});

    // LOGIN Validation using Async-Await

    try {
      let token;
        const {email, password} = req.body;

        if(!email|| !password) {
            return res.status(400).json({error: "Please fill the data"})
        }

        // if we want to read the data that it is available in db or not then we use mongodb here
        // findOne({email: email}) - this line return promises and to handle we use async - await
        const userLogin =  await User.findOne({email: email}); 

        // console.log(userLogin);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);


 // JWT TOKEN
    token = await userLogin.generateAuthToken();
    console.log(token);

    res.cookie("jwttoken", token, {
      expires:new Date(Date.now() + 25892000000),  // expiring the token in 30 days
      httpOnly: true
    });
 
 // JWT TOKEN END
            if (!isMatch) {
                res.status(400).json({error: "Invalid Credientials"})
            } else {
            res.json({message: "User Signin Successful"});
            }
        }else {
            res.status(400).json({error: "Invalid Credientials"})
        }
        


    } catch(err) {
        console.log(err);
    }
})

// About Us Page

router.get("/about", authenticate, (req,res) => {
  console.log(`Hello my About`);
  res.send(req.rootUser);
});


//get user data in Contact
router.get('/getdata',authenticate, (req,res) => {
  console.log(`Hello my contact`);
  res.send(req.rootUser);
} );

// Contact 

router.post('/contact',authenticate, async (req,res) => {
 try{
  const {name, email, phone, message} = req.body;

  if (!name || !email ||!phone ||!message){
    console.log("Error Contact");
    return res.json({error: "please fill the contact form"});
  }
const userContact = await User.findOne({_id: req.userID});

if(userContact) {
  const userMessage = await userContact.addMessage(name, email,phone, message);
  await userContact.save();

  res.status(201).json({message: "User Contact Data Received"})
}

 }catch(err){
  console.log(err);
 }
} );

// Logout

router.get("/logout", (req,res) => {
  console.log(`Hello my Logout`);
  res.clearCookie("jwttoken", {path: '/'})
  res.status(200).send("User Logout");
});







module.exports = router;
