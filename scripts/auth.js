document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("login-form");
	const registerForm = document.getElementById("register-form");
	const yes_button = document.getElementById("yes_btn");
	// Login form submission
	if (loginForm) {
		loginForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const username = document.getElementById("login-username").value;
			const password = document.getElementById("login-password").value;

			try {
				const response = await fetch("http://localhost:3000/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await response.json();
				if (response.ok) {
					// Login successful
					alert("Login successful");
					// localStorage.setItem("token", data.token);
					chrome.storage.local
						.set({ user: { token: data.token, username } })
						.then(() => {
							alert("Value is set");
						});
					// window.location.href = "http://localhost:3000/protected";
				} else {
					// Login failed
					console.error(data.error);
					// Display an error message on the login form if needed
				}
			} catch (err) {
				console.error("Error during login:", err);
				// Handle error
			}
		});
	}

	// Registration form submission
	if (registerForm) {
		registerForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const username = document.getElementById("register-username").value;
			const password = document.getElementById("register-password").value;

			try {
				const response = await fetch("http://localhost:3000/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await response.json();
				if (response.ok) {
					// Registration successful
					alert("Registration successful");
					// window.location.href = "/login";
				} else {
					// Registration failed
					alert(data.error);
					// Display an error message on the registration form if needed
				}
			} catch (err) {
				alert("Error during registration:", err);
				// Handle error
			}
		});
	}
	if (yes_button) {
		yes_button.addEventListener("click", (event) => {
			chrome.storage.local.remove("user").then(() => {
				alert("Logout succesfully");
			});
		});
	}
});
