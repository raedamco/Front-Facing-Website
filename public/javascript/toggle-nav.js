/* toggle-nav.js  Handles toggling the  MAIN navigation menu for small screens. */
function menuToggle(menu) {
	let header = document.getElementById("header");
	let nav = document.getElementById("header-nav");

	menu.classList.toggle("cross");
	header.classList.toggle("toggled-on");
	nav.classList.toggle("toggled-on");
	document.body.classList.toggle("stop-scrolling");
}

function closeMenu() {
	let menu = document.getElementById("menu-button");
	let header = document.getElementById("header");
	let nav = document.getElementById("header-nav");

	menu.classList.remove("cross");
	header.classList.remove("toggled-on");
	nav.classList.remove("toggled-on");
	document.body.classList.remove("stop-scrolling");
}
