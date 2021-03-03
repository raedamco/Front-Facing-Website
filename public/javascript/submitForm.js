window.addEventListener("load", function() {
	function sendForm(form) {
		console.log("Sending form");
		
		function submitSuccess() {
			// TODO replace with notification using express-validator errors
			alert('Form submitted successfully.');
		}

		function submitFail() {
			// TODO replace with notification using express-validator errors
			alert('Something went wrong.');
		}

		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));
		const postUrl = window.location.pathname + "-form";

		$.ajax({
			type: "POST",
			url: postUrl,
			data: json,
			success: submitSuccess,
			error: submitFail,
			contentType: 'application/json'
		});
	}

	// Selects the first form in the DOM. Should only be one.
	const form = document.querySelector("form");

	// Override form default submission
	if (form != null) {
		form.addEventListener('submit', function(event) {
			event.preventDefault();

			sendForm(form);
		});
	}
})