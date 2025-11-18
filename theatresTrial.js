// --- FINAL THEATRES.JS (UNIQUE THEATRE-WISE SEAT AVAILABILITY) ---

// Theatre list
const mockTheatres = [
  {
    name: "PVR: MOHALI WALK",
    logo: "images/pvr-logo.avif"
  },
  {
    name: "Cinepolis: Bestech Square, Mohali",
    logo: "images/cinepolis-logo.avif"
  },
  {
    name: "PVR: Centra Chandigarh",
    logo: "images/pvr-logo.avif"
  },
  {
    name: "INOX: Zirakpur",
    logo: "images/inox-logo.avif"
  }
];

// Default timings
const defaultTimings = ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM", "11:30 PM"];


// Generate random seat status FOR EACH THEATRE + DATE
function generateShowDataForThisTheatre(storageKey) {
  const showData = defaultTimings.map(time => {
    const random = Math.random();
    let status = "available";

    if (random < 0.2) status = "sold-out";
    else if (random < 0.4) status = "almost-full";
    else if (random < 0.6) status = "fast-filling";

    return { time, status };
  });

  localStorage.setItem(storageKey, JSON.stringify(showData));
  return showData;
}



// Load theatres + availability for selected date
function loadShowsForDate(dateKey) {
  const theatresContainer = document.querySelector(".rest-container-timings");
  theatresContainer.innerHTML = "";

  mockTheatres.forEach(theatre => {

    // Unique key for each theatre & date
    const theatreKey = theatre.name.replace(/\s+/g, "-");
    const storageKey = `${dateKey}_${theatreKey}`;

    // Load existing OR generate new
    const saved = localStorage.getItem(storageKey);
    const showTimes = saved
      ? JSON.parse(saved)
      : generateShowDataForThisTheatre(storageKey);

    // Create card
    const card = document.createElement("div");
    card.classList.add("theatre-card");

    card.innerHTML = `
      <div class="theatre-info">
        <img src="${theatre.logo}" alt="Theatre Logo" class="theatre-logo">
        <span class="theatre-name">${theatre.name}</span>
      </div>

      <div class="showtimes">
        <span class="like-btn">&#10084;</span>

        ${showTimes
          .map(show => `<button class="${show.status}">${show.time}</button>`)
          .join("")}
      </div>
    `;

    theatresContainer.appendChild(card);
  });

  setupShowtimeClicks();
  setupLikeButtons();
}



// Handle like button
function setupLikeButtons() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("liked"));
  });
}



// When user selects a showtime
function setupShowtimeClicks() {
  document.querySelectorAll(".showtimes button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (btn.classList.contains("sold-out")) return;

      const theatreCard = e.target.closest(".theatre-card");
      const theatreName = theatreCard.querySelector(".theatre-name").textContent;

      // Get active date
      const selectedDateDiv = document.querySelector(".date.active");
      const day = selectedDateDiv.children[0].textContent;
      const dateNum = selectedDateDiv.children[1].textContent;
      const month = selectedDateDiv.children[2].textContent;

      const selectedMovie =
        JSON.parse(localStorage.getItem("selectedMovieTheatre")) || {};

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



// Date click system
function setupDateClicks() {
  document.querySelectorAll(".date").forEach(dateDiv => {
    dateDiv.addEventListener("click", () => {
      document.querySelectorAll(".date").forEach(d =>
        d.classList.remove("active")
      );

      dateDiv.classList.add("active");

      const day = dateDiv.children[0].textContent;
      const dateNum = dateDiv.children[1].textContent;
      const month = dateDiv.children[2].textContent;

      const dateKey = `${day}-${dateNum}-${month}`;

      loadShowsForDate(dateKey);
    });
  });
}



// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  setupDateClicks();

  // Default = first date active
  const firstDate = document.querySelector(".date");
  firstDate.classList.add("active");

  const day = firstDate.children[0].textContent;
  const dateNum = firstDate.children[1].textContent;
  const month = firstDate.children[2].textContent;

  const dateKey = `${day}-${dateNum}-${month}`;

  loadShowsForDate(dateKey);
});
