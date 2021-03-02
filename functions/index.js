'use strict';

const functions = require('firebase-functions');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const google = require('googleapis');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.status(200).render('homepage');
});

app.get('/:pageTitle', (req, res, next) => {
	res.status(200).render(req.params.pageTitle, {
		pageTitle: req.params.pageTitle
	}, (err, html) => {
		if (err) {
			next();
		} else {
			res.send(html);
		}
	});
});

app.get('*', (req, res) => {
	res.status(404).render('404', {
		pageTitle: "Error"
	});
});

// Define the Firebase function that will act as Express application
// Note: This `app` must match with `/firebase.json` rewrites rule.
exports.app = functions.https.onRequest(app);

// Google Sheets API
exports.reply = (req, res) => {
	let jwt = getJwt();
	let apiKey = getApiKey();
	let spreadsheetId = '1I2KGPmvnKbWW8tOTfdGlrgvwI3Il9zrAKx9Xs6WY05Y';		// TODO Replace with real id. This one is a test spreadsheet.
	let range = 'A1';
	let row = [new Date(), 'A Cloud Function was here'];
	appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
	res.status(200).type('text/plain').end('OK');
};

function getJwt() {
	let credentials = require("./credentials.json");
	return new google.Auth.JWT(
		credentials.client_email, null, credentials.private_key,
		['https://www.googleapis.com/auth/spreadsheets']
	);
}

function getApiKey() {
	let apiKeyFile = require("./api_key.json");
	return apiKeyFile.key;
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
			console.log('Updated sheet: ' + result.data.updates.updatedRange);
		}
	});
}