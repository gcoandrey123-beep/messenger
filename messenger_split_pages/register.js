const API_URL = "http://127.0.0.1:8000";

const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordRepeat = document.getElementById("registerPasswordRepeat");
const registerMessage = document.getElementById("registerMessage");
const openLoginButton = document.getElementById("openLoginButton");

openLoginButton.addEventListener("click", function() {
    window.location.href = "login.html";
});

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();
    const passwordRepeat = registerPasswordRepeat.value.trim();

    if (username === "" || password === "" || passwordRepeat === "") {
        registerMessage.textContent = "Заполните все поля";
        return;
    }

    if (password !== passwordRepeat) {
        registerMessage.textContent = "Пароли не совпадают";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
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
            registerMessage.textContent = data.detail || "Ошибка регистрации";
            return;
        }

        registerMessage.textContent = "Аккаунт создан. Сейчас откроется вход.";

        registerUsername.value = "";
        registerPassword.value = "";
        registerPasswordRepeat.value = "";

        setTimeout(function() {
            window.location.href = "login.html";
        }, 700);

    } catch (error) {
        registerMessage.textContent = "Backend не отвечает";
        console.log(error);
    }
});