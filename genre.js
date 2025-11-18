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