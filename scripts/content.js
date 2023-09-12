let query = "";
function getGoogleQuery() {
	if (window.location.host === "www.google.com") {
		const googleQuery = document.getElementById("APjFqb");
		// alert(googleQuery);
		if (googleQuery) {
			const message = googleQuery.textContent;
			if (message !== "") {
				query = message;
			}
		}
	}
}
// content.js
let selectedText = "";
let mapArray = [{
	h1:"heading",
	p:"paragraph"
}]

function mapAllParagraphAndHeadingFromHTML(){
	
}

document.addEventListener("mouseup", function () {
	selectedText = window.getSelection().toString();
	console.log(selectedText);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "getVariableValue") {
		// Access your variable here
		var variableValue = query;

		// Send the variable value as a response
		sendResponse(variableValue);
	}
	if(request.action === "getSelectedText"){
		if (selectedText !== "" && selectedText.length > 1){
			sendResponse(selectedText)
		}
	}
});

document.addEventListener("readystatechange", (event) => {
	switch (document.readyState) {
		case "loading":
			console.log(
				"document.readyState: ",
				document.readyState,
				`- The document is still loading.`
			);
			break;
		case "interactive":
			console.log(
				"document.readyState: ",
				document.readyState,
				`- The document has finished loading DOM. `,
				`- "DOMContentLoaded" event`
			);
			break;
		case "complete":
			console.log(
				"document.readyState: ",
				document.readyState,
				`- The page DOM with Sub-resources are now fully loaded. `,
				`- "load" event`
			);
			getGoogleQuery();
			break;
	}
});
