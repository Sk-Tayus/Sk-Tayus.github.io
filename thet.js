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


// go to seat selection
document.addEventListener("DOMContentLoaded", () => {
  const timeButtons = document.querySelectorAll(".showtimes button");

  timeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Only redirect if the button is NOT grey (sold out)
      if (!btn.classList.contains("sold-out")) {
        window.location.href = "seat_selection.html";
      }
    });
  });
});





document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "cce59c5f5f30536d92584cbf2e6500bc"; // if you use it here

  // --- Find movie id (from data attribute or localStorage) ---
  const movieTitleEl = document.getElementById("movieTitle");
  const movieId = movieTitleEl?.dataset?.movieId || localStorage.getItem("selectedMovieId");

  if (!movieId) {
    console.warn("No movieId found on this page. TMDb fetches will be skipped until a valid id is provided.");
  } else {
    // Safe TMDb fetch example (only if movieId exists)
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    fetch(tmdbUrl)
      .then(res => {
        if (!res.ok) throw new Error(`TMDb returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Loaded selected movie:", data);
        // populate UI if needed
      })
      .catch(err => {
        console.error("TMDb fetch failed:", err);
      });
  }

  // --- Showtime click handling (skip sold-out) ---
  const timeButtons = document.querySelectorAll(".showtimes button");

  timeButtons.forEach(btn => {
    // make sure sold-out is detected either by class or disabled attribute
    btn.addEventListener("click", (e) => {
      // If you disable sold-out buttons earlier, check disabled too
      const isSoldOut = btn.classList.contains("sold-out") || btn.disabled || btn.classList.contains("sold-out");
      if (isSoldOut) {
        // optional: give user feedback
        e.preventDefault();
        console.log("Clicked sold-out time — navigation cancelled.");
        return;
      }

      // Save currently selected movie and time for seat_selection page:
      try {
        if (movieId) localStorage.setItem("selectedMovieId", movieId);
        localStorage.setItem("selectedShowtime", btn.textContent.trim());
      } catch (err) {
        console.warn("Could not save selected movie/time to localStorage:", err);
      }

      // Finally navigate
      window.location.href = "seat_selection.html";
    });
  });

  // Extra helpful debug: list any scripts/styles/images that failed to load in Network
  window.addEventListener("error", (ev) => {
    // resource loading errors have ev.target (element) and a src/href
    if (ev.target && (ev.target.src || ev.target.href)) {
      console.error("Resource failed to load:", ev.target.tagName, ev.target.src || ev.target.href);
    }
  }, true);
});
