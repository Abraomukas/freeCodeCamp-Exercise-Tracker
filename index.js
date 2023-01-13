const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
	username: String,
	_id: String,
});

let ExerciseUser = mongoose.model('ExerciseUser', userSchema);

const exerciseSchema = new mongoose.Schema({
	description: String,
	duration: Number,
	date: String,
});

let Exercise = mongoose.model('Exercise', exerciseSchema);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

/**
 * POST
 * Create a new user
 */
app.post('/api/users', function (req, res) {
	const inputUsername = req.body.username;
	const id = shortid.generate();

	console.log(
		'creating a new user with username - '.toLocaleUpperCase() + inputUsername
	);
	let newUser = new ExerciseUser({ username: inputUsername, _id: id });

	newUser.save((err, user) => {
		if (err) {
			console.error(err);
			res.json({ message: 'User creation failed! Something went wrong...' });
		}

		res.json({ message: 'User creation successful!', user: user });
	});
});

/**
 * POST
 * Add a new exercise
 * @param _id
 */
app.post('/api/users/:_id/exercises', function (req, res) {
	const userId = req.params._id;
	const description = req.body.description;
	const duration = req.body.duration;
	const date = req.body.date;

	//* Find the user
	let user = ExerciseUser.findOne({ username: userId }, function (err, user) {
		if (err) {
			console.log('there is no user with that id...'.toLocaleUpperCase(), err);
			res.json({ message: 'User not found!' });
		}

		//* Create the exercise for that user

		res.json({
			username: user.username,
			description: description,
			duration: duration,
			date: new Date(date),
		});
	});
});

/**
 * GET
 * Get a user's exercise log
 */
app.get('/api/users/:_id/logs?from&to&limit', function (req, res) {});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
