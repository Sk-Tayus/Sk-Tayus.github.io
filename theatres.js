// ----------------- MOVIE INFO LOAD -----------------
document.addEventListener("DOMContentLoaded", () => {
  const movieData = JSON.parse(localStorage.getItem("selectedMovieTheatre"));

  if (movieData) {
    document.getElementById("movieTitle").textContent =
      `${movieData.title} (${movieData.language})`;

    document.getElementById("movieLang").innerHTML = `
      <span class="tag">Runtime: ${movieData.runtime}</span>
      <span class="tag">${movieData.certification}</span>
      ${movieData.genres.map(g => `<span class="tag">${g}</span>`).join("")}
    `;
  }
});


// ----------------- THEATRE LIST -----------------
const mockTheatres = [
  { name: "PVR: MOHALI WALK", logo: "images/pvr-logo.avif" },
  { name: "Cinepolis: Bestech Square, Mohali", logo: "images/cinepolis-logo.avif" },
  { name: "PVR: Centra Chandigarh", logo: "images/pvr-logo.avif" },
  { name: "INOX: Zirakpur", logo: "images/inox-logo.avif" }
];

const defaultTimings = ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM", "11:30 PM"];


// ----------------- GENERATE SHOW DATA -----------------
function generateShowDataForThisTheatre(storageKey) {
  const showData = defaultTimings.map(time => {
    const r = Math.random();
    let status = "available";

    if (r < 0.2) status = "sold-out";
    else if (r < 0.4) status = "almost-full";
    else if (r < 0.6) status = "fast-filling";

    return { time, status };
  });

  localStorage.setItem(storageKey, JSON.stringify(showData));
  return showData;
}


// ----------------- LOAD SHOWS FOR SELECTED DATE -----------------
function loadShowsForDate(dateKey) {
  const container = document.querySelector(".rest-container-timings");
  container.innerHTML = "";

  mockTheatres.forEach(theatre => {
    const theatreKey = theatre.name.replace(/\s+/g, "-");
    const storageKey = `${dateKey}_${theatreKey}`;

    const saved = localStorage.getItem(storageKey);
    const showTimes = saved
      ? JSON.parse(saved)
      : generateShowDataForThisTheatre(storageKey);

    const card = document.createElement("div");
    card.classList.add("theatre-card");

    card.innerHTML = `
      <div class="theatre-info">
        <img src="${theatre.logo}" class="theatre-logo">
        <span class="theatre-name">${theatre.name}</span>
      </div>
      <div class="showtimes">
        <span class="like-btn">&#10084;</span>
        ${showTimes.map(show =>
          `<button class="${show.status}">${show.time}</button>`
        ).join("")}
      </div>
    `;

    container.appendChild(card);
  });

  setupLikeButtons();
  setupShowtimeClicks();
}


// ----------------- LIKE BUTTON LOGIC -----------------
function setupLikeButtons() {
  document.querySelectorAll(".like-btn").forEach(btn =>
    btn.addEventListener("click", () => btn.classList.toggle("liked"))
  );
}


// ----------------- SHOWTIME CLICK → SAVE DATA -----------------
function setupShowtimeClicks() {
  document.querySelectorAll(".showtimes button").forEach(btn => {

    btn.addEventListener("click", e => {
      if (btn.classList.contains("sold-out")) return;

      const theatreCard = e.target.closest(".theatre-card");
      const theatreName = theatreCard.querySelector(".theatre-name").textContent;

      const activeDate = document.querySelector(".date.active");
      const day = activeDate.children[0].textContent;
      const dateNum = activeDate.children[1].textContent;
      const month = activeDate.children[2].textContent;

      const selectedMovie = JSON.parse(localStorage.getItem("selectedMovieTheatre")) || {};

      const showDetails = {
        movieTitle: selectedMovie.title || "Unknown Movie",
        language: selectedMovie.language || "N/A",
        theatre: theatreName,
        showTime: btn.textContent,
        date: `${day}, ${dateNum} ${month} 2025`,
        status:
          btn.classList.contains("sold-out") ? "sold-out" :
          btn.classList.contains("almost-full") ? "almost-full" :
          btn.classList.contains("fast-filling") ? "fast-filling" :
          "available"
      };

      localStorage.setItem("selectedShowDetails", JSON.stringify(showDetails));

      window.location.href = "seat_selection.html";
    });
  });
}


// ----------------- DATE CLICK HANDLING -----------------
function setupDateClicks() {
  document.querySelectorAll(".date").forEach(dateDiv => {
    dateDiv.addEventListener("click", () => {
      document.querySelectorAll(".date").forEach(d => d.classList.remove("active"));
      dateDiv.classList.add("active");

      const day = dateDiv.children[0].textContent;
      const dateNum = dateDiv.children[1].textContent;
      const month = dateDiv.children[2].textContent;

      loadShowsForDate(`${day}-${dateNum}-${month}`);
    });
  });
}


// ----------------- INITIALIZE PAGE -----------------
document.addEventListener("DOMContentLoaded", () => {
  setupDateClicks();

  const firstDate = document.querySelector(".date");
  firstDate.classList.add("active");

  const day = firstDate.children[0].textContent;
  const dateNum = firstDate.children[1].textContent;
  const month = firstDate.children[2].textContent;

  loadShowsForDate(`${day}-${dateNum}-${month}`);
});
