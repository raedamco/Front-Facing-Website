'use strict';

const functions = require('firebase-functions');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

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