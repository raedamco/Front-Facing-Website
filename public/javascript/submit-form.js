/**
 * @author Ryan Dean Kirkpatrick
 */

//TODO fix for multiple forms on one page. use form id for postUrl
window.addEventListener("load", () => {
	function sendForm(form) {
		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));
		const postUrl = window.location.pathname + "-form";

		$.ajax({
			type: "POST",
			url: postUrl,
			data: json,
			success: (data) => {
				// Display confirmation message to user.
				if (typeof confirmationMsg !== undefined) {
					// Display default message if custom message is missing.
					CreateMessage("confirmation", "<p>Thank you!</p>");
				} else {
					// Add custom message to page with:
					// <script>let confirmationMsg = "<p>Thank you!</p>";</script>
					CreateMessage("confirmation", confirmationMsg);
				}
				analytics.logEvent("form_success", { postUrl: postUrl, data: json });
				form.reset();
			},
			error: (data) => {
				// Combine error messages from the node server into a single string.
				let errorMsg = "<p><strong>Try Again:</strong>";
				let errors = data.responseJSON.errors;
				for (let i = 0; i < errors.length; i++) {
					errorMsg += "<br />" + errors[i].msg;
				}
				errorMsg += "</p>";
				// Display error message to user.
				CreateMessage("tryagain", errorMsg);
				analytics.logEvent("form_error", {
					postUrl: postUrl,
					data: json,
					error: errorMsg,
				});
			},
			contentType: "application/json",
		});
	}

	// Get reCaptcha token
	function getToken(form) {
		//Generate token
		if (recaptchaKey) {
			// reCaptchaKey set in main.handlebars
			grecaptcha.execute(recaptchaKey, { action: "form" }).then((token) => {
				let tokenInput = document.getElementById("token");
				if (tokenInput) {
					tokenInput.value = token;
				} else {
					// Append reCaptcha token input if it is missing
					$(form).append(
						"<input type='hidden' id='token' name='token' value='" +
							token +
							"'/>"
					);
				}
				// Send Form to server
				sendForm(form);
				Promise.resolve();
			});
		}
	}

	// Selects the first form in the DOM. Should only ever be one form.
	const form = document.querySelector("form");

	// Override form default submission
	if (form != null) {
		form.addEventListener("submit", (event) => {
			event.preventDefault();

			getToken(form);
		});
	}
});
