const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const pageSearchButton = document.getElementById("pgSrch");
const traslateButton = document.getElementById("trnslt");
const signInButton = document.getElementById("_hst");
// OpenAI API credentials
const apiKey = "YOUR_API_KEY_HERE";
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

let chatHistory = [];
let localHistory = [];
let username = "";

async function sendMessage(message) {
	appendMessage("user", message);
	userInput.value = "";
	userInput.disabled = true;
	sendButton.disabled = true;

	chatHistory.push(message);
	const response = await getChatbotResponse(chatHistory);
	appendMessage("chatbot", response);

	localHistory.push({ message, response });
	// window.localStorage.setItem("localHistory", JSON.stringify(localHistory));
	chrome.storage.local
		.set({ localHistory: JSON.stringify(localHistory) })
		.then(() => {
			alert("Value is set");
		});
	userInput.disabled = false;
	sendButton.disabled = false;
}

async function getChatbotResponse(messages) {
	const payload = {
		prompt: messages.join("\n"),
		max_tokens: 50,
	};

	try {
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		console.log(data);
		return data.choices[0].text.trim();
	} catch (error) {
		console.log(error);
		return "error" + error;
	}
}

function appendMessage(sender, message) {
	const messageElement = document.createElement("div");
	messageElement.classList.add(
		sender === "user" ? "user-message" : "chatbot-message"
	);
	messageElement.textContent = message;
	chatContainer.appendChild(messageElement);
}

function getGoogleQuery() {
	// Send a message to content.js to get the variable value
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "getVariableValue" },
			function (response) {
				// Use the variable value received from content.js
				var variableValue = response;
				// alert(variableValue);
				if (variableValue && variableValue !== "")
					sendMessage(variableValue);
			}
		);
	});
}
function translateSelection() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "getSelectedText" },
			function (response) {
				var variableValue = response;
				if (variableValue && variableValue !== "")
					sendMessage("translate " + variableValue);
			}
		);
	});
}

sendButton.addEventListener("click", () => {
	const message = userInput.value.trim();
	if (message !== "") {
		sendMessage(message);
	}
});

userInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		const message = userInput.value.trim();
		if (message !== "") {
			sendMessage(message);
		}
	}
});

pageSearchButton.addEventListener("click", (event) => {
	// alert(window.location.hostname);
	getGoogleQuery();
});

traslateButton.addEventListener("click", (event) => {
	translateSelection();
});

signInButton.addEventListener("click", (event) => {});

document.addEventListener("DOMContentLoaded", async (event) => {
	const response = await chrome.storage.local
		.get(["localHistory"])
		.then((result) => {
			// alert("Value currently is " + result.localHistory);
			return result;
		});
	localHistory = JSON.parse(response.localHistory) || [];

	const user = await chrome.storage.local.get(["user"]).then((result) => {
		// alert("Value currently is " + JSON.stringify(result));
		return result;
	});
	if (user && Object.keys(user).length) {
		username = user.user.username;
		signInButton.textContent = username;
		signInButton.setAttribute("href", "./logout.html");
	} else {
		signInButton.textContent = "Login";
		signInButton.setAttribute("href", "./login.html");
	}
});
