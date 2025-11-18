// Load booking details
const booking = JSON.parse(localStorage.getItem("finalOrderSummary"));

if (!booking) {
  alert("No order found!");
  window.location.href = "index.html";
}

document.getElementById("amountBox").textContent =
  `Amount: ₹${booking.grandTotal}`;

// -----------------------------------------
// GENERATE UPI QR CODE (STATIC QR)
// -----------------------------------------

// ❗ Put your UPI ID here
const myUpiId = "myupi@id";

// Payment URL
const upiURL = `upi://pay?pa=${myUpiId}&pn=Flicker%20Movies&am=${booking.grandTotal}&cu=INR`;

// Use external QR API
document.getElementById("upiQR").src =
  `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiURL)}`;

// -----------------------------------------
// AFTER PAYMENT CONFIRMATION
// -----------------------------------------

document.getElementById("paidBtn").addEventListener("click", () => {

  // We trust user (static site cannot verify UPI)
  const confirmedBooking = {
    ...booking,
    paymentMethod: "UPI-QR",
    paymentTime: new Date().toLocaleString(),
    upiIdUsed: myUpiId
  };

  localStorage.setItem("confirmedBooking", JSON.stringify(confirmedBooking));

  alert("Payment confirmation received! Redirecting to your ticket...");

  window.location.href = "ticket.html";
});
