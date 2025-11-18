const API_KEY = "cce59c5f5f30536d92584cbf2e6500bc";
const movieContainer = document.querySelector('.movies'); // your movie list container

// Map genre names to TMDB IDs
const genreMap = {
  drama: 18,
  crime: 80,
  food: 99, // closest: Documentary
  action: 28,
  thriller: 53,
  romance: 10749,
  comedy: 35,
  horror: 27,
  adventure: 12,
  "sci-fi": 878,
  mystery: 9648 // also Documentary
};

// Event listener for genre cards
document.querySelectorAll(".genre-card").forEach(card => {
  card.addEventListener("click", async () => {
    const selectedGenre = card.dataset.filter;
    const genreId = genreMap[selectedGenre];
    if (!genreId) return;

    try {
      let allResults = [];

      // Fetch up to 3 pages (≈60 movies)
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&include_adult=false`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          allResults = allResults.concat(data.results);
        } else {
          break; // stop if no more results
        }
        if (page >= data.total_pages) break; // stop if last page
      }

      // Filter adult content just in case
      const safeMovies = allResults.filter(m => !m.adult);
      displayMovies(safeMovies);
    } catch (err) {
      console.error("Error fetching movies by genre:", err);
    }
  });
});

function displayMovies(movies) {
  movieContainer.innerHTML = ''; // clear previous content

  if (!movies || movies.length === 0) {
    movieContainer.innerHTML = `<p class="no-results">No movies found for this genre.</p>`;
    return;
  }

  movies.forEach(movie => {
    const poster = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : 'images/placeholder.jpg';

    const title = movie.title || movie.name || "Untitled";
    const language = movie.original_language ? movie.original_language.toUpperCase() : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    let viewerAge = "UA 13+";
    if (rating >= 8) viewerAge = "U/A 16+";
    else if (rating < 5) viewerAge = "U/A 7+";

    const movieCard = `
      <div class="movie">
        <img src="${poster}" alt="${title}">
        <h3>${title}</h3>
        <p>${viewerAge}</p>
        <p>${language}</p>
        <p>Rating ⭐ ${rating}/10</p>
        <button>Book</button>
      </div>
    `;

    movieContainer.insertAdjacentHTML('beforeend', movieCard);
  });

  movieContainer.scrollIntoView({ behavior: 'smooth' });
}
