const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '0dc706e842494ef68e897c2ab33c47d5'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with api'));
}


const handleImage = (req, res, db) => {
	const {id} = req.body;
	
	//in database, get the users table and where our req id matches the 
	//table id, increment the entries by 1, return the entry total 
	//and then return .json([0]) the first item in the array 
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	//return the text of the first item in the array in the response
	.then(entries => {
		res.json(entries[0]);
	})
	//if there is an error, return a 400 and text
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}
