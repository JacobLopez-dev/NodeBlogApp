const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const path = require('path');
const PORT = process.env.PORT || 5000

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

//DB connection
mongoose.connect("mongodb+srv://admin-Jacob:qwe123@nodeblogapp-zvhnd.mongodb.net/userDB",{useUnifiedTopology: true, useNewUrlParser: true})

//Schemas
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//DB Encryption
const secret = "Thisisoursecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

//Home page
app.get('/', (req, res) => res.render('pages/home'));

//Login page
app.get('/login', (req, res) => res.render('pages/login'));

app.post('/login', function(req, res){
    const username = req.body.email;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
           if(foundUser){
               if(foundUser.password === password){
                res.render("pages/userLanding")
               }
           }
        }
    });
});

//Register page
app.get('/register', (req, res) => res.render('pages/register'));
//Register new user
app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("pages/userLanding")
        }
    });
});

//User Landing page
app.get('/user', (req, res) => res.render('pages/userLanding'));


//Port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

