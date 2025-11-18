// const menuToggle = document.querySelector(".menu-toggle");
// const menu = document.querySelector(".menu");
// const menuLinks = document.querySelectorAll(".menu li a");

// // Toggle mobile menu
// menuToggle.addEventListener("click", () => {
//   menuToggle.classList.toggle("active");
//   menu.classList.toggle("active");
// });

// // Active link highlight
// menuLinks.forEach((link) => {
//   link.addEventListener("click", () => {
//     menuLinks.forEach((l) => l.classList.remove("active"));
//     link.classList.add("active");

//     // close menu on mobile after click
//     menuToggle.classList.remove("active");
//     menu.classList.remove("active");
//   });
// });

// // Profile section 
// const userProfileContainer = document.getElementById("userProfileContainer");
// const userProfileIcon = document.getElementById("userProfileIcon");
// const userDropdown = document.getElementById("userDropdown");
// const userName = document.getElementById("userName");
// const userEmail = document.getElementById("userEmail");
// const userAvatar = document.getElementById("userAvatar");

// // Toggle dropdown
// userProfileIcon.addEventListener("click", () => {
//   userProfileContainer.classList.toggle("active");
// });

// // Load user on page load
// window.addEventListener("load", () => {
//   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   if (loggedInUser) {
//     updateUserProfile(loggedInUser);
//   } else {
//     resetUserProfile();
//   }
// });

// // Update user info when logged in
// function updateUserProfile(user) {
//   userProfileIcon.style.backgroundImage = 'url("images/user-logged.png")';
//   userAvatar.src = "images/user-logged.png";

//   userName.textContent = user.name || user.email.split("@")[0];
//   userEmail.textContent = "Email: " + user.email;

//   // ADD THIS LINE
//   userProfileContainer.classList.add("logged-in");
// }

// function resetUserProfile() {
//   userProfileIcon.style.backgroundImage = 'url("images/Sample_User_Icon.png")';
//   userAvatar.src = "images/Sample_User_Icon.png";
//   userName.textContent = "Not Logged In";
//   userEmail.textContent = "Email: Not available";

//   // REMOVE logged-in class
//   userProfileContainer.classList.remove("logged-in");
// }


// // Logout
// function userLogout() {
//   localStorage.removeItem("loggedInUser");
//   resetUserProfile();
//   userProfileContainer.classList.remove("active");
// }






//GENRE JS
const track = document.querySelector(".carousel-track");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let scrollAmount = 0;
const cardWidth = 240; // card width + gap
const totalCards = document.querySelectorAll(".genre-card").length;

function getVisibleCards() {
  return Math.floor(document.querySelector(".carousel-container").offsetWidth / cardWidth);
}

function getMaxScroll() {
  return -(cardWidth * (totalCards - getVisibleCards()));
}

function updateCarousel() {
  // keep scrollAmount in valid range when resizing
  const maxScroll = getMaxScroll();
  if (scrollAmount < maxScroll) scrollAmount = maxScroll;
  if (scrollAmount > 0) scrollAmount = 0;
  track.style.transform = `translateX(${scrollAmount}px)`;
}

rightBtn.addEventListener("click", () => {
  scrollAmount -= cardWidth * 2; // move 2 cards per click
  if (scrollAmount < getMaxScroll()) scrollAmount = getMaxScroll();
  updateCarousel();
});

leftBtn.addEventListener("click", () => {
  scrollAmount += cardWidth * 2;
  if (scrollAmount > 0) scrollAmount = 0;
  updateCarousel();
});

// Recalculate when screen resizes
window.addEventListener("resize", updateCarousel);

// Initial setup
updateCarousel();





