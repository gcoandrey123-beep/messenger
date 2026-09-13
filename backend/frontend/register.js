const API_URL = "";

const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordRepeat = document.getElementById("registerPasswordRepeat");
const registerMessage = document.getElementById("registerMessage");
const openLoginButton = document.getElementById("openLoginButton");
const codeBlock = document.getElementById("CodeBlock");
const getCodeButton = document.getElementById("getCodeButton");
const timerText = document.getElementById("timerText");

let timerId = null;

getCodeButton.addEventListener("click", function() {
    codeBlock.classList.remove("hidden");
    let seconds = 120;
    timerText.textContent = "02:00";
    if (timerId !== null) {
        clearInterval(timerId);
    }
    timerId = setInterval(function() {
        seconds--;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerText.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0");
        if (seconds <= 0) {
            clearInterval(timerId);
            timerId = null;
            timerText.textContent = "00:00";
        }
    }, 1000);
});

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