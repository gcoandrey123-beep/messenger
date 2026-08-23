const API_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const openRegisterButton = document.getElementById("openRegisterButton");

openRegisterButton.addEventListener("click", function() {
    window.location.href = "register.html";
});

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (username === "" || password === "") {
        loginMessage.textContent = "Заполните все поля";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.detail || "Неверный логин или пароль";
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(data));

        loginUsername.value = "";
        loginPassword.value = "";
        loginMessage.textContent = "";

        window.location.href = "messenger.html";

    } catch (error) {
        loginMessage.textContent = "Backend не отвечает";
        console.log(error);
    }
});