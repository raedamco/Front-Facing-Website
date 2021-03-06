/**
 * @author Ryan Dean Kirkpatrick
 */
'use strict';

// Firebase function for node server
const functions = require('firebase-functions');
// Express for routing and Handlebars for templating
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
// For Google Sheets API
const {google} = require('googleapis');
// For string formatting
const util = require('util');
// Validator for form input
const {body, validationResult} = require('express-validator');
// For sending emails
const nodemailer = require('nodemailer');

// Setup express/handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
//app.use(express.urlencoded({extended:true}));
//app.use(express.json());

// Catch unhandled promises
process.on('unhandledRejection', error => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', error.message);
});

// Express routes
// - Landing page
app.get('/', (req, res) => {
	res.status(200).render('homepage');
});

// - Other pages
app.get('/:pageTitle', (req, res, next) => {
	let pageTitle = parsePageTitle(req.params.pageTitle);
	res.status(200).render(req.params.pageTitle, {
		pageTitle: pageTitle
	}, (err, html) => {
		if (err) {
			next();
		} else {
			res.send(html);
		}
	});
});

// - Forms
app.post('/early-access-form',
body('email').isEmail().withMessage("Invalid email"),
body('firstname').isLength({min: 1}).withMessage("Missing first name"),
body('lastname').isLength({min: 1}).withMessage("Missing last name"),
(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	console.log("Form passed validation.");
	let jwt = getJwt();
	let apiKey = getApiKey();
	let spreadsheetId = '1I2KGPmvnKbWW8tOTfdGlrgvwI3Il9zrAKx9Xs6WY05Y';		// TODO Replace with real id. This one is a test spreadsheet.
	let range = 'A1:B3';
	let row = [getDate(), req.body.firstname + " " + req.body.lastname, req.body.email];
	appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
	res.status(200).type('text/plain').end('OK');
});

// - Error page
app.get('*', (req, res) => {
	res.status(404).render('404', {
		pageTitle: "Error"
	});
});

// Define the Firebase function that will act as Express application
// Note: This `app` must match with `/firebase.json` rewrites rule.
exports.app = functions.https.onRequest(app);

// Helper functions
function parsePageTitle(pageTitle) {
	pageTitle = pageTitle.replace("-", " ");
	pageTitle.replace("%20", " ");
	let splitStr = pageTitle.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}

// Google Sheets API
function getJwt() {
	let credentials = require("./credentials.json");
	return new google.auth.JWT(
		credentials.client_email, null, credentials.private_key,
		['https://www.googleapis.com/auth/spreadsheets']
	);
}

function getApiKey() {
	let apiKeyFile = require("./api_key.json");
	return apiKeyFile.key;
}

function getDate() {
	let dateObj = new Date();
	// current date
	// adjust 0 before single digit date
	let date = ("0" + dateObj.getDate()).slice(-2);
	let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
	let year = dateObj.getFullYear();
	let hours = dateObj.getHours();
	let minutes = ("0" + dateObj.getMinutes()).slice(-2);
	let seconds = ("0" + dateObj.getSeconds()).slice(-2);
	return util.format("%s/%s/%s %s:%s:%s", month, date, year, hours, minutes, seconds);
}

function appendSheetRow(jwt, apiKey, spreadsheetId, range, row) {
	const sheets = google.sheets({version: 'v4'});
	sheets.spreadsheets.values.append({
		spreadsheetId: spreadsheetId,
		range: range,
		auth: jwt,
		key: apiKey,
		valueInputOption: 'RAW',
		resource: {values: [row]}
	}, function(err, res) {
		if (err) {
			throw err;
		}
		else
		{
			console.log('Updated: ' + res.data.updates.updatedRange);
		}
	});
}

// Node mailer
let transporter = nodemailer.createTransport({
	
});

let mailOption = {
	from: ''
}

transporter.sendMail(mailOptions, (error, info) => {
	if (error)
	{
		console.log(error);
	}
	else
	{
		console.log('Email sent: ' + info.response);
	}
});