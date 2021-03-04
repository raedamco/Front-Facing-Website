window.addEventListener("load", function() {
	function sendForm(form) {
		console.log("Sending form");
		
		function submitSuccess(json) {
			// TODO replace with notification using express-validator errors
			//alert('Form submitted successfully.');
			console.log(JSON.stringify(json));
		}

		function submitFail(json) {
			// TODO replace with notification using express-validator errors
			//alert('Something went wrong.');
			console.log(json);
		}

		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));
		const postUrl = window.location.pathname + "-form";

		$.ajax({
			type: "POST",
			url: postUrl,
			data: json,
			success: submitSuccess(json),
			error: submitFail(json),
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