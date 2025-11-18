// movie_page.js
const apiKey = "cce59c5f5f30536d92584cbf2e6500bc";

document.addEventListener("DOMContentLoaded", async () => {
  const movieTitle = localStorage.getItem("selectedMovieTitle");

  if (!movieTitle) {
    document.querySelector(".text h1").textContent = "Movie Not Found";
    return;
  }

  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      document.querySelector(".text h1").textContent = `${movieTitle} (Not found on TMDB)`;
      return;
    }

    const movie = searchData.results[0];
    const movieId = movie.id;

    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos`;
    const detailsResponse = await fetch(detailsUrl);
    const details = await detailsResponse.json();

    // ✅ Update main details
    document.querySelector(".text h1").textContent = details.title;
    document.querySelector(".main-rating span").textContent = (details.vote_average?.toFixed(1) || "N/A") + "/10";

    const tagsEl = document.querySelector(".tags");
    const genres = details.genres.map(g => g.name).join(", ") || "No genres";
    tagsEl.innerHTML = `<span>${genres}</span>`;

    const infoEl = document.querySelector(".info");
    const runtime = details.runtime ? `${details.runtime}m` : "Unknown duration";
    const release = details.release_date ? details.release_date.slice(0, 10) : "N/A";
    infoEl.innerHTML = `${runtime} • ${genres} • ${details.adult ? "A" : "UA"} • ${release}`;

    const aboutEl = document.querySelector(".about");
    aboutEl.innerHTML = `
      <h2>About The Movie</h2>
      <p>${details.overview || "No description available."}</p>
    `;

    // ✅ Background
    const bg = document.querySelector(".movie_card");
    const bgImage = details.backdrop_path
      ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
      : "https://via.placeholder.com/1200x600?text=No+Image";
    bg.style.backgroundImage = `linear-gradient(rgba(10,15,31,0.85), rgba(10,15,31,0.85)), url('${bgImage}')`;

    // ✅ Trailer
    const iframe = document.querySelector(".trailer iframe");
    const trailer = details.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    iframe.src = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "https://www.youtube.com/embed/tQ0mzXRk-oM";

    // ✅ CAST (unchanged)
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
    const creditsResponse = await fetch(creditsUrl);
    const creditsData = await creditsResponse.json();

    const castSection = document.createElement("div");
    castSection.classList.add("cast-section");
    castSection.innerHTML = `<h2>Cast</h2><div class="cast-container"></div>`;
    document.querySelector("main").appendChild(castSection);

    const castContainer = castSection.querySelector(".cast-container");

    creditsData.cast.slice(0, 8).forEach(actor => {
      const img = actor.profile_path
        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
        : "images/default_actor.png";

      const castCard = `
        <div class="cast-card">
          <img src="${img}" alt="${actor.name}" onerror="this.onerror=null;this.src='images/default_actor.png';">
          <p class="actor-name">${actor.name}</p>
          <p class="actor-role">${actor.character || "Unknown role"}</p>
        </div>`;
      castContainer.innerHTML += castCard;
    });

    // 🎟️ --- FIXED: Book Tickets Click ---
    const bookBtn = document.querySelector(".book a");
    if (bookBtn) {
      bookBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // ✅ Store movie data for theatres page
        const selectedMovieData = {
          title: details.title,
          runtime: runtime,
          certification: details.adult ? "A" : "UA",
          genres: details.genres.map(g => g.name),
          language: details.original_language?.toUpperCase() || "N/A",
          poster: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : "images/default_poster.png"
        };

        localStorage.setItem("selectedMovieTheatre", JSON.stringify(selectedMovieData));

        // ✅ Redirect
        console.log("Redirecting to theatres...");
        window.location.href = "theatres.html";
      });
    }

  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  
});
