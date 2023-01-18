const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')


// Securing API and Password & PORT with dotenv
dotenv.config({path:'./config.env'})

require('./db/connection');
// const User = require('./model/userSchema');

// Using middleware to take data in json format
app.use(express.json());

app.use(cookieParser());
// Linking router File to give the app better structure. 
app.use(require('./router/auth')); 



// Securing  Post to config.env
const PORT = process.env.PORT


//Middleware
// const middleware = (req, res, next) => {
//     console.log(`Hello Middleware`);
//     next();
// }


// Route

app.get('/', (req, res) => {
    res.send(`Home Page server`);
});
// app.get('/about', (req, res) => {
//     res.send(`About Page`);
// });
app.get('/service', (req, res) => {
    res.send(`Servive Page`);
});
app.get('/login', (req, res) => {
    res.send(`Login Page`);
});
app.get('/register', (req, res) => {
    res.send(`Register Page`);
});
// app.get('/contact', (req, res) => {
//     res.send(`Contact Page`);
// });

//Listen
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}!!`);
})