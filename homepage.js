const movieCards = document.querySelectorAll(".movie");

  movieCards.forEach(card => {
    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent;
      const rating = card.querySelectorAll("p")[0].textContent;
      const language = card.querySelectorAll("p")[1].textContent;

      // Store movie details in localStorage
      localStorage.setItem("selectedMovie", JSON.stringify({
        title: title,
        rating: rating,
        language: language
      }));

      // Redirect to theatres page
      window.location.href = "movie_page.html";
    });
  });