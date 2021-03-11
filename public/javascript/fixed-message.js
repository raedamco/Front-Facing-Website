/**
 * @author Ryan Dean Kirkpatrick
 */

/**
 * Create message container with msgHTML and append the container to the body.
 * @param {string} msgClass The class applied to the message container
 * @param {string} msgHTML The message, including html, to display to the user
 */
function CreateMessage(msgClass, msgHTML)
{
	// Delete old message
	DeleteMessage();

	// Add error message to form without clearing entered form data
	let closeBtnTxt = "<button class='close'>x</button>";
	$("body").append("<div id='messagecontainer' class='" + msgClass + "'>" + closeBtnTxt + msgHTML + "</div>");

	// Delete message on click
	let closeBtn = document.getElementById("messagecontainer").firstChild;
	closeBtn.addEventListener('click', (event) => {
		DeleteMessage();
	});
}

/**
 * Delete message that was created by the {@link CreateMessage} function. The container has the id messagecontainer.
 */
function DeleteMessage()
{
	const message = document.getElementById("messagecontainer");
	if (message != null) {
		message.remove();
	}
}

/**
 * Pauses current function from executing.
 * @param {int} ms Milliseconds to wait.
 * @example <caption>Sleep for 2 seconds.</caption>
 * await sleep(2000);
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Display message on page load
window.addEventListener("load", () => {
	async function welcomeMessage() {
		// Session storage may not be compatible with older browsers
		// Display early access message if this is the first time the first page the user opened in this session
		if (!("message" in sessionStorage))
		{
			await sleep(2000);
			CreateMessage("",
				"<h1>Early Access</h1>" +
				"<p>Commute with added insight and convenience.</p>" +
				"<p>Join the list of users with early access to download our free mobile app.</p>" +
				"<a class='button' href='/early-access'>Sign up</a>");
			sessionStorage.setItem("message", true);
		}
	}

	welcomeMessage();
})