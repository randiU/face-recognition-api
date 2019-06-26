const handleProfileGet = (req, res, db) => {
	//params are what the user inputs in the id area (/:id)
	const {id} = req.params;
	//selects everything from the users table where the id param matches the id
	//in the table
	db.select('*').from('users').where({
		id:id
	})
		//if it matches, we'll return the user that matches
		.then(user => {
			//if there isn't a user, an empty empty will get returned
			//so we can compare whether or not an array is empty
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		}).catch(err => res.status(400).json('error getting user'))
}

module.exports = {
	handleProfileGet
}