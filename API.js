// --- Movie Search Using TMDB API ---
const apiKey = "cce59c5f5f30536d92584cbf2e6500bc"; // your TMDB key

const desktopForm = document.querySelector(".search");
const desktopInput = document.querySelector(".search input");
const mobileForm = document.querySelector(".mobile-search");
const mobileInput = document.querySelector(".mobile-search input");
const moviesSection = document.querySelector(".movies");

// Function to trigger movie search
function handleSearch(query) {
  if (query.trim() === "") return;
  fetchMovies(query.trim());
}

// Desktop search
desktopForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(desktopInput.value);
  desktopInput.value = "";
});

// Mobile search
mobileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(mobileInput.value);
  mobileInput.value = "";
});

// Fetch movies from TMDB API (exclude adult movies)
async function fetchMovies(query) {
  try {
    let allResults = [];

    // Fetch up to 3 pages = 60 movies total
    for (let page = 1; page <= 3; page++) {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allResults = allResults.concat(data.results);
      } else {
        break;
      }

      // Stop if no more pages
      if (page >= data.total_pages) break;
    }

    // Filter out any remaining adult results (double safety)
    const safeMovies = allResults.filter((m) => !m.adult);

    displayMovies(safeMovies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Display movies or fallback image
function displayMovies(movies) {
  // No movies found → show fullscreen image
  if (!movies || movies.length === 0) {
    document.body.innerHTML = `
      <div class="no-movies-wrapper">
        <img src="images/no-movies-found-image.png" 
             alt="No Movies Found" 
             class="no-movies-big"
             onclick="window.location.href='index.html'">
      </div>
    `;
    return;
  }

  // Normal movie display
  moviesSection.innerHTML = "";
  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "images/error3.png";

    const title = movie.title || movie.name || "Untitled";
    const language = movie.original_language
      ? movie.original_language.toUpperCase()
      : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    let viewerAge = "UA 13+";
    if (rating >= 8) viewerAge = "UA 16+";
    else if (rating < 5) viewerAge = "UA 7+";

    // Movie card
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie");

    movieCard.innerHTML = `
      <img src="${poster}" alt="${title}"
           onerror="this.onerror=null; this.src='images/error3.png';">
      <h3>${title}</h3>
      <p>${viewerAge}</p>
      <p>${language}</p>
      <p>Rating ⭐ ${rating}/10</p>
      <button class="book-btn">Book</button>
    `;

    // 🎯 Add click listener for Book button
    const bookBtn = movieCard.querySelector(".book-btn");
    bookBtn.addEventListener("click", () => {
      const selectedMovie = {
        id: movie.id,
        title: title,
        language: language,
        rating: rating,
        viewerAge: viewerAge,
        poster: poster,
      };

      // Save data to localStorage
      localStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));

      // Redirect to theatres page
      window.location.href = "theatres.html";
    });

    moviesSection.appendChild(movieCard);
  });

  moviesSection.scrollIntoView({ behavior: "smooth" });
}
