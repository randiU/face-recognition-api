const handleRegister = (req, res, db, bcrypt) => {
	//destructuring request object data
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	//applies to users in our database
	//applying a transation and trx is the new reference to our database
	db.transaction(trx => {
		//insert this info into database
		trx.insert({
			hash: hash,
			email: email
		})
		//specifically into the login table
		.into('login')
		//return the email so we can use it for another table
		.returning('email')
		//grab login email from the previous return 
		.then(loginEmail => {
			//get users table from our database
			return trx('users')
				.returning('*')
					//inserst the given information in the request into our database
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
						//returns the new user back as a response
					}).then(user => {
						res.json(user[0]);
					})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
}