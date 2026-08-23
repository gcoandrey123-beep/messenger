const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatSearch = document.getElementById("chatSearch");
const chatTitle = document.getElementById("chatTitle");
const registerScreen = document.getElementById("registerScreen");
const loginScreen = document.getElementById("loginScreen");
const messengerScreen = document.getElementById("messengerScreen");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordRepeat = document.getElementById("registerPasswordRepeat");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const openLoginButton = document.getElementById("openLoginButton");
const openRegisterButton = document.getElementById("openRegisterButton");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
let currentChatId = "ai";

const chatsMessages = {
    ai: [
        { text: "Привет! Я твой ИИ-помощник.", type: "ai" },
        { text: "Иди нафиг ПЖ", type: "ai" }
    ],
    boris: [
        { text: "Здорово.", type: "ai" },
        { text: "Как дела?", type: "ai" }
    ],
    masha: [
        { text: "Привет!", type: "ai" }
    ],
    work: [
        { text: "Не забудь про задачу.", type: "ai" }
    ]
};

function renderMessages() {
    messages.innerHTML = "";

    const currentMessages = chatsMessages[currentChatId];

    currentMessages.forEach(function(message) {
        const newMessage = document.createElement("div");

        if (message.type === "my") {
            newMessage.classList.add("message", "my-message");
        } else {
            newMessage.classList.add("message", "ai-message");
        }

        if (isImageLink(message.text)) {
            const image = document.createElement("img");
            image.src = message.text;
            image.alt = "Картинка";
            image.classList.add("message-image");

            newMessage.appendChild(image);
        } else {
            newMessage.textContent = message.text;
        }

        messages.appendChild(newMessage);
    });

    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    chatsMessages[currentChatId].push({
        text: text,
        type: "my"
    });

    renderMessages();

    messageInput.value = "";
}

sendBtn.addEventListener("click", function() {
    sendMessage();
});

messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && event.shiftKey === false) {
        event.preventDefault();
        sendMessage();
    }
});

const chatItems = document.querySelectorAll(".chat");

chatItems.forEach(function(chat) {
    chat.addEventListener("click", function() {
        currentChatId = chat.dataset.chatId;
        chatTitle.textContent = chat.textContent;

        chatItems.forEach(function(item) {
            item.classList.remove("active-chat");
        });

        chat.classList.add("active-chat");

        renderMessages();
    });
});

chatSearch.addEventListener("input", function() {
    const searchText = chatSearch.value.toLowerCase();

    chatItems.forEach(function(chat) {
        const chatName = chat.textContent.toLowerCase();

        if (chatName.includes(searchText)) {
            chat.style.display = "block";
        } else {
            chat.style.display = "none";
        }
    });
});

renderMessages();

function showScreen(screen) {
    registerScreen.classList.add("hidden");
    loginScreen.classList.add("hidden");
    messengerScreen.classList.add("hidden");

    screen.classList.remove("hidden");
}

openLoginButton.addEventListener("click", function() {
    showScreen(loginScreen);
});

openRegisterButton.addEventListener("click", function() {
    showScreen(registerScreen);
});



registerForm.addEventListener("submit", function(event) {
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

    const user = {
        username: username,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    registerMessage.textContent = "Аккаунт создан. Теперь войдите.";

    registerUsername.value = "";
    registerPassword.value = "";
    registerPasswordRepeat.value = "";

    showScreen(loginScreen);
});


loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    const savedUserText = localStorage.getItem("user");

    if (savedUserText === null) {
        loginMessage.textContent = "Сначала зарегистрируйтесь";
        return;
    }

    const savedUser = JSON.parse(savedUserText);

    if (username === savedUser.username && password === savedUser.password) {
        loginMessage.textContent = "";
        showScreen(messengerScreen);
    } else {
        loginMessage.textContent = "Неверный логин или пароль";
    }
});

showScreen(registerScreen);

function isImageLink(text) {
    return (
        text.startsWith("http") &&
        (
            text.endsWith(".png") ||
            text.endsWith(".jpg") ||
            text.endsWith(".jpeg") ||
            text.endsWith(".gif") ||
            text.endsWith(".webp")
        )
    );
}