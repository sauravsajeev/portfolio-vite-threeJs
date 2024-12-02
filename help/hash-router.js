const pageTitle = "saurav";
// create an object that maps the url to the template, title, and description
const routes = {
//    "/": {
// 		template: "/index.html",
// 		title: "Home | " + pageTitle,
// 		description: "This is the home page",
// 	},
// 	about: {
// 		template: "/index.html",
// 		title: "About Us | " + pageTitle,
// 		description: "This is the about page",
// 	},
	project: {
		template: "/templates/project.html",
		title: "Project | " + pageTitle,
		description: "This is the Project page",
	},
};

// create a function that watches the url and calls the urlLocationHandler
const locationHandler = async () => {
	// get the url path, replace hash with empty string
	var location = window.location.hash.replace("#", "");
	// if the path length is 0, set it to primary page route
	if (location.length == 0) {
		location = "/";
	}
	// get the route object from the routes object
	if (location.includes("project")) {
	const route = routes[location] || routes["404"];
	// get the html from the template
	//const html = await fetch(route.template).then((response) => response.text());
	// set the content of the content div to the html
	document.getElementById("content").style.display = "block";
	document.getElementById("maincon").style.display = "none";
	document.getElementById("home").style.display = "none";
	document.getElementById("about").style.display = "none";
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);
	 }
	 else if (location.includes("about")){
	// set the content of the content div to the html
	document.getElementById("content").style.display = "none";
	document.getElementById("maincon").style.display = "block";
//	document.getElementById("home").style.display = "flex";
	document.getElementById("about").style.display = "block";
	// set the title of the document to the title of the route
	document.title = "About | saurav";
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", "Welcome to About Page");
	 }
	 else{
	document.getElementById("content").style.display = "none";
	document.getElementById("maincon").style.display = "block";
	document.getElementById("home").style.display = "flex";
	document.getElementById("about").style.display = "block";
	
	
	// set the title of the document to the title of the route
	document.title = "Home | saurav";
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", "Welcome to Home Page");
	 
	 }
};
// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
// call the urlLocationHandler to load the page
locationHandler();
