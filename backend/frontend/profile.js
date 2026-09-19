const profileUsername = document.getElementById("profileUsername");
const inviteLink = document.getElementById("inviteLink");
const copyInviteButton = document.getElementById("copyInviteButton");
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

const inviteCode = currentUser.inviteCode || currentUser.username;
inviteLink.value = window.location.origin + "/invite/" + inviteCode;

copyInviteButton.addEventListener("click", function() {
    inviteLink.select();
    document.execCommand("copy");

    profileMessage.textContent = "Ссылка скопирована";
});

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