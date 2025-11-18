const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu li a");

// Toggle mobile menu
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  menu.classList.toggle("active");
});

// Active link highlight
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // close menu on mobile after click
    menuToggle.classList.remove("active");
    menu.classList.remove("active");
  });
});

// Profile section 
const userProfileContainer = document.getElementById("userProfileContainer");
const userProfileIcon = document.getElementById("userProfileIcon");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

// Toggle dropdown
userProfileIcon.addEventListener("click", () => {
  userProfileContainer.classList.toggle("active");
});

// Load user on page load
window.addEventListener("load", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    updateUserProfile(loggedInUser);
  } else {
    resetUserProfile();
  }
});

// Update user info when logged in
function updateUserProfile(user) {
  userProfileIcon.style.backgroundImage = 'url("images/user-logged.png")';
  userAvatar.src = "images/user-logged.png";

  userName.textContent = user.name || user.email.split("@")[0];
  userEmail.textContent = "Email: " + user.email;

  // ADD THIS LINE
  userProfileContainer.classList.add("logged-in");
}

function resetUserProfile() {
  userProfileIcon.style.backgroundImage = 'url("images/Sample_User_Icon.png")';
  userAvatar.src = "images/Sample_User_Icon.png";
  userName.textContent = "Not Logged In";
  userEmail.textContent = "Email: Not available";

  // REMOVE logged-in class
  userProfileContainer.classList.remove("logged-in");
}


// Logout
function userLogout() {
  localStorage.removeItem("loggedInUser");
  resetUserProfile();
  userProfileContainer.classList.remove("active");
}