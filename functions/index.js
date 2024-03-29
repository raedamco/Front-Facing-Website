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
const OAuth2 = google.auth.OAuth2;
// For HTTP requests
const axios = require('axios');

// Setup express/handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// Catch unhandled promises
process.on('unhandledRejection', error => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', error.message);
});

console.log("======== Starting Server ========");

// Express routes
// - Landing page
app.get('/', (req, res) => {
	// First part relies on falsey values: 0, null, false, undefined
	if (req.query.cache || typeof(req.query.cache) == undefined)
	{
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	}
	res.status(200).render('homepage', {
		siteKey: apiKeyFile.recaptchaSiteKey
	});
});

// - Other pages
app.get('/:pageTitle', (req, res, next) => {
	// First part relies on falsey values: 0, null, false, undefined
	if (req.query.cache || typeof(req.query.cache) == undefined)
	{
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	}
	let pageTitle = parsePageTitle(req.params.pageTitle);
	res.status(200).render(req.params.pageTitle, {
		pageTitle: pageTitle,
		siteKey: apiKeyFile.recaptchaSiteKey
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
body('firstname').isLength({min: 1}).withMessage("Missing first name"),
body('lastname').isLength({min: 1}).withMessage("Missing last name"),
body('email').isEmail().withMessage("Invalid email"),
body('token').custom(value => validateScore(value)),
(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	console.log("Early access form passed validation.");

	// Append to data to google sheet
	let jwt = getJwt();
	let apiKey = apiKeyFile.sheetsKey;
	// Google sheet with spreadsheetId needs to be shared with: spreadsheet-writer@theory-parking.iam.gserviceaccount.com
	let spreadsheetId = '1Bp44uRyXGV30PkLoKspN_GMH1_xNzm55_om9PVis0jg';
	let range = 'A1:C1';
	let row = [getDate(), req.body.firstname + " " + req.body.lastname, req.body.email];
	appendSheetRow(jwt, apiKey, spreadsheetId, range, row);

	res.status(200).type('text/plain').end('OK');
});

app.post('/newsletter-form',
body('email').isEmail().withMessage("Invalid email"),
body('token').custom(value => validateScore(value)),
(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	console.log("Newsletter form passed validation.");

	// Append to data to google sheet
	let jwt = getJwt();
	let apiKey = apiKeyFile.sheetsKey;
	// Google sheet with spreadsheetId needs to be shared with: spreadsheet-writer@theory-parking.iam.gserviceaccount.com
	let spreadsheetId = '1n-EwrIJy4-XgvWvv8-GK8au7gcbHCRLz8Jj6ME7LTKA';
	let range = 'A1:B1';
	let row = [getDate(), req.body.email];
	appendSheetRow(jwt, apiKey, spreadsheetId, range, row);

	res.status(200).type('text/plain').end('OK');
});

app.post('/contact-form',
body('firstname').isLength({min: 1}).withMessage("Missing first name"),
body('lastname').isLength({min: 1}).withMessage("Missing last name"),
body('email').isEmail().withMessage("Invalid email"),
body('message').isLength({min: 1}).withMessage("Missing message"),
body('token').custom(value => validateScore(value)),
(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	console.log("Contact form passed validation.");

	let mailOptions = {
		from: req.body.email,
		to: reciever,
		subject: 'Raedam Contact Form',
		text: "Name: " + req.body.firstname + " " + req.body.lastname +
				"\nEmail: " + req.body.email +
				"\nMessage: " + req.body.message
	};
	
	sendMail(mailOptions);

	res.status(200).type('text/plain').end('OK');
});

app.post('/join-form',
body('firstname').isLength({min: 1}).withMessage("Missing first name"),
body('lastname').isLength({min: 1}).withMessage("Missing last name"),
body('email').isEmail().withMessage("Invalid email"),
body('phone').isMobilePhone().withMessage("Invalid phone number"),
body('address1').isLength({min: 1}).withMessage("Missing address line 1"),
//body('address2').isLength({min: 1}).withMessage("Missing address line 2"),
body('city').isLength({min: 1}).withMessage("Missing city"),
body('state').isLength({min: 1}).withMessage("Missing state"),
body('zip').isLength({min: 1}).withMessage("Missing zip"),
body('country').isLength({min: 1}).withMessage("Missing country"),
//body('website').isURL().withMessage("Invalid website"),
body('sector').isLength({min: 1}).withMessage("Missing sector"),
body('token').custom(value => validateScore(value)),
(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	console.log("Join form passed validation.");

	// Compose text for email
	let mailText = "Name: " + req.body.firstname + " " + req.body.lastname +
					"\nEmail: " + req.body.email +
					"\nPhone: " + req.body.phone +
					"\nAddress:\n" +
					req.body.address1;
	if (req.body.address2 != "")
	{
		mailText += "\n" + req.body.address2;
	}
	mailText += util.format("\n%s, %s, %s\n%s", req.body.city, req.body.state, req.body.zip, req.body.country);
	if (req.body.website != "") {
		mailText +=  "\nWebsite: " + req.body.website;
	}
	mailText +=  "\nSector: " + req.body.sector;

	let mailOptions = {
		to: reciever,
		subject: 'Raedam Join Form',
		text: mailText
	};
	
	sendMail(mailOptions);

	res.status(200).type('text/plain').end('OK');
});

// - Error page
app.get('*', (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	res.status(404).render('404', {
		pageTitle: "Error",
		siteKey: apiKeyFile.recaptchaSiteKey
	});
});

// Define the Firebase function that will act as Express application
// Note: This `frontFacingNodeServer` must match with `/firebase.json` rewrites rule.
exports.frontFacingNodeServer = functions.https.onRequest(app);

// Helper functions
let apiKeyFile = require('./keys.json');

function parsePageTitle(pageTitle) {
	pageTitle = pageTitle.replace("-", " ");
	pageTitle.replace("%20", " ");
	let splitStr = pageTitle.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
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

// Google Sheets API
function getJwt() {
	let credentials = require("./credentials.json");
	return new google.auth.JWT(
		credentials.client_email, null, credentials.private_key,
		['https://www.googleapis.com/auth/spreadsheets']
	);
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
			console.error('Error: ' + err);
			throw err;
		}
		else
		{
			console.log('Updated: ' + res.data.updates.updatedRange);
		}
	});
}

// Node mailer
const sender = require('./email.json');
const reciever = "omar@raedam.co";
const oauth2Client = new OAuth2(
	sender.clientId,
	sender.clientSecret,
	"https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
	refresh_token: sender.refreshToken
})
const accessToken = oauth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: true,
	auth: {
		type: 'OAuth2',
		user: 'noreply@raedam.co',
		clientId: sender.clientId,
		clientSecret: sender.clientSecret,
		refreshToken: sender.refreshToken,
		accessToken: accessToken
	}
});

function sendMail(mailOptions)
{
	transporter.sendMail(mailOptions, (error, info) => {
		if (error)
		{
			console.log(error);
		}
		else
		{
			console.log('Email sent: ' + info.response);
		}
		transporter.close();
	});
}

// reCaptcha
async function getScore(token) {
	const response = await axios.get(`https://recaptcha.google.com/recaptcha/api/siteverify?secret=${apiKeyFile.recaptchaSecretKey}&response=${token}`);
	return response.data.score;
}

function validateScore(token) {
	return getScore(token).then(score => {
		if (!score || score < 0.5) {
			console.log("Rejected reCaptcha score: ", score);
			return Promise.reject('Bot detected');
		}
		return Promise.resolve();
	});
}

console.log("======== Server Setup Complete ========");