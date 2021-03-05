/**
 * @author Ryan Dean Kirkpatrick
 */

window.addEventListener("load", () => {
	function sendForm(form) {
		console.log("Sending form");

		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));
		const postUrl = window.location.pathname + "-form";

		$.ajax({
			type: "POST",
			url: postUrl,
			data: json,
			success: (data) => {
				// Display confirmation message to user.
				if (confirmationMsg == null) {
					// Display default message if custom message is missing.
					CreateMessage("confirmation", "<p>Thank you!</p>");
				}
				else
				{
					// Add custom message to page with:
					// <script>let confirmationMsg = "<p>Thank you!</p>";</script>
					CreateMessage("confirmation", confirmationMsg);
				}
			},
			error: (data) => {
				// Combine error messages from the node server into a single string.
				let errorMsg = "<p><strong>Try Again:</strong>";
				let errors = data.responseJSON.errors;
				for(let i = 0; i < errors.length; i++) {
					errorMsg += "<br />" + errors[i].msg;
				}
				errorMsg += "</p>";
				// Display error message to user.
				CreateMessage("tryagain", errorMsg);
			},
			contentType: 'application/json'
		});
	}

	// Selects the first form in the DOM. Should only ever be one form.
	const form = document.querySelector("form");

	// Override form default submission
	if (form != null) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			sendForm(form);
		});
	}
})