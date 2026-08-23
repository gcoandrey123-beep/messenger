const API_URL = "http://127.0.0.1:8000";

const accountName = document.getElementById("accountName");
const openProfileButton = document.getElementById("openProfileButton");

const chatList = document.getElementById("chatList");
const chatSearch = document.getElementById("chatSearch");
const chatTitle = document.getElementById("chatTitle");

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const currentUserText = localStorage.getItem("currentUser");

if (currentUserText === null) {
    window.location.href = "login.html";
}

const currentUser = JSON.parse(currentUserText);

let users = [];
let selectedUser = null;


accountName.textContent = currentUser.username;


openProfileButton.addEventListener("click", function() {
    window.location.href = "profile.html";
});


async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users?current_user_id=${currentUser.id}`);

        if (!response.ok) {
            chatList.textContent = "Не удалось загрузить пользователей";
            return;
        }

        users = await response.json();

        renderUsers();

    } catch (error) {
        chatList.textContent = "Backend не отвечает";
        console.log(error);
    }
}


function renderUsers() {
    chatList.innerHTML = "";

    const searchText = chatSearch.value.toLowerCase();

    const filteredUsers = users.filter(function(user) {
        return user.username.toLowerCase().includes(searchText);
    });

    if (filteredUsers.length === 0) {
        chatList.textContent = "Пользователей нет";
        return;
    }

    filteredUsers.forEach(function(user) {
        const chat = document.createElement("div");

        chat.classList.add("chat");
        chat.textContent = user.username;

        if (selectedUser !== null && selectedUser.id === user.id) {
            chat.classList.add("active-chat");
        }

        chat.addEventListener("click", function() {
            selectedUser = user;
            chatTitle.textContent = user.username;

            renderUsers();
            loadMessages();
        });

        chatList.appendChild(chat);
    });
}


async function loadMessages() {
    if (selectedUser === null) {
        messages.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/messages?user_id=${currentUser.id}&other_user_id=${selectedUser.id}`
        );

        if (!response.ok) {
            messages.textContent = "Не удалось загрузить сообщения";
            return;
        }

        const dialogMessages = await response.json();

        renderMessages(dialogMessages);

    } catch (error) {
        messages.textContent = "Backend не отвечает";
        console.log(error);
    }
}


function renderMessages(dialogMessages) {
    messages.innerHTML = "";

    if (dialogMessages.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("message", "ai-message");
        emptyMessage.textContent = "Сообщений пока нет";
        messages.appendChild(emptyMessage);
        return;
    }

    dialogMessages.forEach(function(message) {
        const newMessage = document.createElement("div");

        if (message.sender_id === currentUser.id) {
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


async function sendMessage() {
    if (selectedUser === null) {
        return;
    }

    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    const messageType = isImageLink(text) ? "image" : "text";

    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender_id: currentUser.id,
                receiver_id: selectedUser.id,
                text: text,
                message_type: messageType
            })
        });

        if (!response.ok) {
            console.log("Сообщение не отправилось");
            return;
        }

        messageInput.value = "";

        await loadMessages();

    } catch (error) {
        console.log(error);
    }
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


chatSearch.addEventListener("input", function() {
    renderUsers();
});


function isImageLink(text) {
    const lowerText = text.toLowerCase();

    return (
        lowerText.startsWith("http") &&
        (
            lowerText.endsWith(".png") ||
            lowerText.endsWith(".jpg") ||
            lowerText.endsWith(".jpeg") ||
            lowerText.endsWith(".gif") ||
            lowerText.endsWith(".webp")
        )
    );
}


loadUsers();