// server.js
// here we are importing the modules needed to make this app
const express = require('express'); // express module will handle requests, routes, and responses.
const mongoose = require('mongoose');//mongoose helps us to talk to mongodb easily.
const dotenv = require('dotenv');//it allows us to use .env file to store our sensitive data like passwords.
const path = require('path');//this will help us manage our file paths.
const methodOverride = require('method-override');
const session = require('express-session'); //You bring in the express-session library, which allows Node.js to store data for a specific user while they are using your app.

// Import routes
const noteRoutes = require('./routes/noteRoutes'); // here we are importing all the routes from from our noteRoutes file.
const authRoutes = require('./routes/authRoutes');// here we are importing all routes from authRoutes file.
const Note = require('./models/Note');  // import model , here we added this line because we're building a new route .
const tagRoutes = require('./routes/tagRoutes');

// Load environment variables
dotenv.config(); //this tells our node to look for a .env file and load it's values.

// Initialize express app
const app = express();//this creates a express app , the core of our backend server.

// Middleware
app.use(express.json()); //Lets your app read JSON data sent in API requests (like POST requests from Thunder Client or frontend forms).
app.use(express.urlencoded({ extended: true })); // to handle form data.// It basically helps to read the data the user has entered .
app.use(methodOverride('_method'));
app.use(express.static('public')); // for CSS, JS, images,this tells express where to look for your css , js , images file.
// Use routes
app.use(session({
    secret: "secretkey123",//secret: "secretkey123" This is a private key used to encrypt the session cookie.Prevents tampering.Keeps session safe
    resave: false,//resave: false . Do not save the session back to the store if nothing changed.
    saveUninitialized: true //saveUninitialized: true.Save a session to the store even if it's empty.
}));

app.use('/', authRoutes);// any request starting with "/" checks inside authRoutes.
app.use('/notes', noteRoutes); // here basically we are telling express for any requests that start with /api/routes look in the noteRoutes.
// in above line earlier it was '/api/notes' now it's just '/notes' why ? well because now that we're connecting front-end with our back-end ,so to make the syntax a bit simpler we do this .
app.use('/tags', tagRoutes);

// Set EJS as the view engine
app.set('view engine', 'ejs');// this tells express to use ejs as it's template engine.
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)// this connects our app with mongodb database using the URL stored in .env file .
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
// app.get('/', async (req, res) => { // here we have added these lines to display all the notes stored in mongodb at html homepage.
//     try {
//         const notes = await Note.find();  // get all notes from MongoDB
//         res.render('home', { notes });    // show them on home.ejs
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });// now we had to remove these routes because it overrided another route in noteRoutes.js

// app.get('/add', (req, res) => {
//     res.render('add');
// });
app.get('/', (req, res) => {
    res.redirect('/notes');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));