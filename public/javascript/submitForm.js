window.addEventListener("load", function() {
	function sendForm(form) {
		// Delete old error message from dom
		const oldError = document.getElementById("errormessage")
		if (oldError != null) {
			oldError.remove();
		}

		function deleteMessageOnClick() {
			document.addEventListener('click', (event) => {
				const error = document.getElementById("errormessage")
				if (error != null) {
					error.remove();
				}
			});
		}

		console.log("Sending form");

		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));
		const postUrl = window.location.pathname + "-form";

		$.ajax({
			type: "POST",
			url: postUrl,
			data: json,
			success: (data) => {
				console.log("Form processed successfully");
				form.innerHTML += "<p id='errormessage' class='confirmation'>Form submitted successfully!</p>";
				deleteMessageOnClick();
			},
			error: (data) => {
				let errorMsg = "";
				let errors = data.responseJSON.errors;
				for(let i = 0; i < errors.length; i++) {
					errorMsg += "<br />" + errors[i].msg;
				}
				//form.innerHTML += "<p id='errormessage' class='tryagain'>Form Error: " + errorMsg + "</p>";
				deleteMessageOnClick();
			},
			contentType: 'application/json'
		});
	}

	// Selects the first form in the DOM. Should only be one.
	const form = document.querySelector("form");

	// Override form default submission
	if (form != null) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			sendForm(form);
		});
	}
})