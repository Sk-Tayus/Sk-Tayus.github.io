// Try to get confirmed booking (after payment)
let order = JSON.parse(localStorage.getItem("confirmedBooking"));

// Fallback: if someone opens directly without payment, use finalOrderSummary
if (!order) {
    order = JSON.parse(localStorage.getItem("finalOrderSummary"));
}

if (!order) {
    alert("No ticket data found!");
    window.location.href = "index.html";
}

// --- Movie & Basic Info ---
document.getElementById("ticketTitle").innerText = order.movie + " Ticket";
document.getElementById("movie").innerText = order.movie;
document.getElementById("theatre").innerText = order.theatre;
document.getElementById("date").innerText = order.date;
document.getElementById("time").innerText = order.time;

// --- Seats ---
if (order.seats && order.seats.length > 0) {
    let seatList = order.seats.map(s =>
        `${s.section.toUpperCase()[0]}${parseInt(s.row) + 1}-${parseInt(s.col) + 1}`
    );

    document.getElementById("tickets").innerText = seatList.length + " Seat(s)";
    document.getElementById("seatRows").innerText = seatList.join(", ");
} else {
    document.getElementById("tickets").innerText = "0 Seat(s)";
    document.getElementById("seatRows").innerText = "N/A";
}

// --- Food Items ---
if (!order.foodItems || order.foodItems.length === 0) {
    document.getElementById("foodItems").innerText = "No Food Purchased";
} else {
    let foodList = order.foodItems.map(f => `${f.name} (x${f.qty})`);
    document.getElementById("foodItems").innerText = foodList.join(", ");
}

// --- Price & Payment ---
document.getElementById("totalPaid").innerText = "₹" + (order.grandTotal || 0);
document.getElementById("payerName").innerText = order.payerName || "Guest User";
document.getElementById("paymentMode").innerText = order.paymentMethod || "Not Available";

// --- Download Ticket ---
document.getElementById("downloadBtn").addEventListener("click", () => {
    html2canvas(document.querySelector(".ticket")).then(canvas => {
        let link = document.createElement("a");
        link.download = "Flicker-Ticket.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});
