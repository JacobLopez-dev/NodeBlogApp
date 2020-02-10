const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");


const path = require('path');
const PORT = process.env.PORT || 5000
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

//session
app.use(session({
    secret: "The secret code.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//DB connection
mongoose.connect("mongodb+srv://admin-Jacob:qwe123@nodeblogapp-zvhnd.mongodb.net/userDB",{useUnifiedTopology: true, useNewUrlParser: true})
mongoose.set("useCreateIndex", true);

//Schemas
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///GET requests///

//Home page
app.get('/', (req, res) => res.render('pages/home'));

//Register page
app.get('/register', (req, res) => res.render('pages/register'));

//Login page
app.get('/login', (req, res) => res.render('pages/login'));

//User Journal page
app.get('/journal', function(req, res){
    if(req.isAuthenticated()){
        res.render("pages/journal");
    } else{
        res.redirect("/login");
    }
});


///POST requests///

//Register new user
app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/journal");
        });
      }
    });
  
  });

//Login
app.post('/login', function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/journal");
            });
        }
    });
});

//logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})



//Local Port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

