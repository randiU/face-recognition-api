const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//creates connection to our postgres database
const db = knex({
  client: 'pg',
  connection: {
  	//connecting to our database we created in Heroku using postgresSQL
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

// db.select('*').from('users').then(data => { console.log(data)});

//creates express app
const app = express();
//makes it so we can read the body of a request
app.use(bodyParser.json());
//makes it so we can avoid the cors policy error 
app.use(cors());


app.get('/', (req, res) => {
	//root route will simply send the user database
	res.send('it is working!');
})

//signin route will compare the email and passwords to the ones in the
//database and if they match, return success.
// if they fail they will return error logging in 
app.post('/signin', (req, res)=> { signin.handleSignin(req, res, db, bcrypt)})

//use this when creating a new user via registration
//the function associated with register is in controllers/register.js
//we are passing in all of the depencies to the function so it can run
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) 


//gets info from the user profiles 
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//updates the users image entries by one for each submission
app.put('/images', (req, res) => {image.handleImage(req, res, db)})

//we need a post request to send the input information to clarifai api
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

//makes the server listen on this localhost
//we need to make the port able to update based on the port provided
app.listen(process.env.PORT || 2000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})