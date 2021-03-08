/* toggle-nav.js  Handles toggling the  MAIN navigation menu for small screens. */
function menuToggle(menu) {
	let header = document.getElementById('header');
	let nav = document.getElementById( 'header-nav' );

	menu.classList.toggle("cross");
	header.classList.toggle("toggled-on");
	nav.classList.toggle("toggled-on");
	document.body.classList.toggle("stop-scrolling");
}