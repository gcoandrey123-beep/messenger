const profileUsername = document.getElementById("profileUsername");
const backToMessengerButton = document.getElementById("backToMessengerButton");
const logoutButton = document.getElementById("logoutButton");
const profileMessage = document.getElementById("profileMessage");
const editName = document.getElementById("editName");
const usernameEditBlock = document.getElementById("usernameEditBlock");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameButton = document.getElementById("saveUsernameButton");

const currentUserText = localStorage.getItem("currentUser");

if (currentUserText === null) {
    window.location.href = "login.html";
}

const currentUser = JSON.parse(currentUserText);

profileUsername.textContent = currentUser.username;

backToMessengerButton.addEventListener("click", function() {
    window.location.href = "messenger.html";
});

logoutButton.addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});

editName.addEventListener("click", function() {
    usernameInput.value = currentUser.username;
    usernameEditBlock.classList.remove("hidden");
});

saveUsernameButton.addEventListener("click", async function() {
    const newUsername = usernameInput.value.trim();

    if (newUsername === "") {
        profileMessage.textContent = "Логин не может быть пустым";
        return;
    }

    const response = await fetch(`/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: newUsername
        })
    });

    const data = await response.json();

    if (!response.ok) {
        profileMessage.textContent =
            data.detail || "Не удалось изменить логин";
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(data)
    );

    profileUsername.textContent = data.username;

    usernameEditBlock.classList.add("hidden");

    profileMessage.textContent = "Логин изменён";
});