// index.js
const movieCards = document.querySelectorAll(".movie");

movieCards.forEach(card => {
  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    const title = card.querySelector("h3").textContent.trim();

    // Save the movie title to localStorage
    localStorage.setItem("selectedMovieTitle", title);

    // Redirect to movie details page
    window.location.href = "movie_page.html";
  });
});