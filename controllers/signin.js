const handleSignin = (req, res, db, bcrypt) => {
	const {email, password} = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	//in our database, select the email and hash from the login table
	//where the email matches the email in the request sent
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		//grab this data and apply the next functions
		.then(data => {
			//compare the password the user provides to the hash in our database
			const isValid = bcrypt.compareSync(password, data[0].hash);
			//if they match...
			if (isValid) {
				//return everything from the users table where the email matches
				//the email listed in the request body (user input)
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					//then return this information - we have to do [0] because
					//it returns in an array 
					.then(user => {
						res.json(user[0])
					})	
					.catch(err => res.status(400).json('unable to get user'))	
				} else {
					//if the password does not match, return a 400 and this message
					res.status(400).json('wrong credentials')
				}
		})
		.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}