/* ------------------------------------------
   UNIQUE SHOW KEY SETUP
------------------------------------------- */

const showData = JSON.parse(localStorage.getItem("selectedShowDetails"));

let showKey = "DEFAULT_SHOW";

if (showData) {
  // Example key: WED-30-OCT_PVR-MOHALI_05-00-PM
  showKey = `${showData.movieTitle}_${showData.language}_${showData.date}_${showData.theatre}_${showData.showTime}`
  .replace(/\s+/g, "-")
  .replace(/:/g, "-");

}


/* ------------------------------------------
   SEAT GRID CONFIG
------------------------------------------- */

const reclinerRows = 1, reclinerCols = 10;
const primeRows = 6, primeCols = 14;
const classicRows = 5, classicCols = 14;

const reclinerContainer = document.querySelector("#recliner-section .seat-grid");
const primeContainer = document.querySelector("#prime-section .seat-grid");
const classicContainer = document.querySelector("#classic-section .seat-grid");

const reclinerPrice = 350;
const primePrice = 200;
const classicPrice = 150;
const MAX_SEATS = 10;

let selectedSeats = [];


/* ------------------------------------------
   HELPER
------------------------------------------- */

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ------------------------------------------
   OCCUPANCY LOGIC BASED ON THEATRE STATUS
------------------------------------------- */

function getOccupancyPercentage() {
  const status = showData.status; // EXACT class name from theatres.js

  if (status === "available") return randomBetween(10, 25);
  if (status === "fast-filling") return randomBetween(30, 60);
  if (status === "almost-full") return randomBetween(65, 90);
  if (status === "sold-out") return 100;

  return 20;
}


/* ------------------------------------------
   GENERATE SEAT LAYOUT BASED ON OCCUPANCY
------------------------------------------- */

function generateSeatLayout(rows, cols, section) {
  const totalSeats = rows * cols;
  const percentage = getOccupancyPercentage();
  const soldSeats = Math.floor((percentage / 100) * totalSeats);

  const flatSeats = [];

  // Fill seats according to percentage
  for (let i = 0; i < totalSeats; i++) {
    flatSeats.push(i < soldSeats ? "sold" : "available");
  }

  // Shuffle so sold seats are random
  flatSeats.sort(() => Math.random() - 0.5);

  // Convert to matrix + add bestseller
  const layout = [];
  let index = 0;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {

      let status = flatSeats[index++];

      // ⭐ NEW — ADD BESTSELLER LOGIC
      // 10% chance to mark available seats as bestseller
      if (status === "available" && Math.random() < 0.10) {
        status = "bestseller";
      }

      row.push({
        section,
        status
      });
    }
    layout.push(row);
  }

  return layout;
}



/* ------------------------------------------
   LOAD OR CREATE SEAT MAP FOR THIS SHOW
------------------------------------------- */

let seatMap = JSON.parse(localStorage.getItem(showKey));

if (!seatMap) {
  seatMap = {
    recliner: generateSeatLayout(reclinerRows, reclinerCols, "recliner"),
    prime: generateSeatLayout(primeRows, primeCols, "prime"),
    classic: generateSeatLayout(classicRows, classicCols, "classic")
  };

  localStorage.setItem(showKey, JSON.stringify(seatMap));
}


/* ------------------------------------------
   RENDER SEATS
------------------------------------------- */

function renderSeats(layout, container) {
  container.innerHTML = "";

  layout.forEach((row, rIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((seat, cIndex) => {
      const seatDiv = document.createElement("div");
      seatDiv.classList.add("seat", seat.status);

      if (seat.section === "recliner") {
        seatDiv.classList.add("recliner-seat");
      }

      seatDiv.dataset.section = seat.section;
      seatDiv.dataset.row = rIndex;
      seatDiv.dataset.col = cIndex;

      rowDiv.appendChild(seatDiv);
    });

    container.appendChild(rowDiv);
  });
}

renderSeats(seatMap.recliner, reclinerContainer);
renderSeats(seatMap.prime, primeContainer);
renderSeats(seatMap.classic, classicContainer);


/* ------------------------------------------
   SEAT CLICK HANDLING
------------------------------------------- */

const summary = document.getElementById("summary");
const payBtn = document.getElementById("payBtn");

document.body.addEventListener("click", (e) => {
  if (!e.target.classList.contains("seat")) return;

  const seat = e.target;

  if (seat.classList.contains("sold")) return; // can't select sold seat

  const section = seat.dataset.section;
  const row = seat.dataset.row;
  const col = seat.dataset.col;

  const price =
    section === "recliner" ? reclinerPrice :
    section === "prime" ? primePrice :
    classicPrice;

  // SELECT SEAT
  if (!seat.classList.contains("selected")) {

    if (selectedSeats.length >= MAX_SEATS) {
      alert("⚠️ You can select a maximum of 10 seats!");
      return;
    }

    seat.classList.add("selected");
    selectedSeats.push({ section, row, col, price });

    seatMap[section][row][col].status = "selected";
  }
  // UNSELECT SEAT
  else {

    seat.classList.remove("selected");

    selectedSeats = selectedSeats.filter(
      s => !(s.section === section && s.row == row && s.col == col)
    );

    seatMap[section][row][col].status = "available";
  }

  localStorage.setItem(showKey, JSON.stringify(seatMap));
  updateSummary();
});


/* ------------------------------------------
   UPDATE SUMMARY
------------------------------------------- */

function updateSummary() {
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  summary.textContent = `${selectedSeats.length} Tickets | ₹${total}`;
  payBtn.textContent = `Pay ₹${total}`;
}


/* ------------------------------------------
   PAY BUTTON → LOCK SEATS
------------------------------------------- */

payBtn.addEventListener("click", () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat!");
    return;
  }

  selectedSeats.forEach(s => {
    seatMap[s.section][s.row][s.col].status = "sold";
  });

  localStorage.setItem(showKey, JSON.stringify(seatMap));

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const bookingSummary = {
    movie: showData.movieTitle,
    theatre: showData.theatre,
    date: showData.date,
    time: showData.showTime,
    seats: selectedSeats,
    seatTotal: total   // 👈 IMPORTANT
  };


  localStorage.setItem("finalBookingSummary", JSON.stringify(bookingSummary));

  window.location.href = "food&merch.html";
});


/* ------------------------------------------
   LOAD HEADER DETAILS
------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (!showData) return;

  document.getElementById("movieTitleHeader").textContent =
    `${showData.movieTitle} (${showData.language})`;

  document.getElementById("movieDetailsHeader").textContent =
    `${showData.theatre} | ${showData.date} | ${showData.showTime}`;

  document.getElementById("timeSlot").textContent = showData.showTime;
});
