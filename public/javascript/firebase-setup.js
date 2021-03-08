// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
	apiKey: "AIzaSyC6n_0MqCxrZIIWM_smT9eVjKRMeBpWMG8",
	authDomain: "theory-parking.firebaseapp.com",
	databaseURL: "https://theory-parking.firebaseio.com",
	projectId: "theory-parking",
	storageBucket: "theory-parking.appspot.com",
	messagingSenderId: "192548003681",
	appId: "1:192548003681:web:75dfba17644c49dd9caf20",
	measurementId: "G-6S8CGR6TWP"
};
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
if (window.location.hostname == "localhost")
{
	//TODO Can be removed for deployment
	gtag('config', 'G-6S8CGR6TWP', {'debug_mode':true});
}
else
{
	gtag('config', 'G-6S8CGR6TWP');
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();