document.addEventListener("DOMContentLoaded", () => {
  // 🔥 Load final order summary
  const booking = JSON.parse(localStorage.getItem("finalOrderSummary"));

  if (!booking) {
    alert("No final order found! Please select seats again.");
    window.location.href = "index.html";
    return;
  }

  /* ------------------------------------------
     FILL SUMMARY SECTION
  ------------------------------------------- */

  // 🎬 Movie Details
  document.getElementById("movieName").textContent = booking.movie;
  document.getElementById("theatreName").textContent = booking.theatre;
  document.getElementById("dateInfo").textContent = booking.date;
  document.getElementById("timeInfo").textContent = booking.time;

  // 🎟 Tickets
  document.getElementById("ticketCount").textContent =
    `${booking.seats.length} Tickets (₹${booking.seatTotal})`;

  // 🍔 FOOD ITEMS SUMMARY
  if (booking.foodItems && booking.foodItems.length > 0) {

    let foodNames = booking.foodItems
      .map(f => `${f.name}${f.size ? " (" + f.size + ")" : ""} × ${f.qty}`)
      .join(", ");

    document.getElementById("foodList").textContent = foodNames;
    document.getElementById("foodTotal").textContent = `₹${booking.foodTotal}`;
  } 
  else {
    document.getElementById("foodList").textContent = "None";
    document.getElementById("foodTotal").textContent = "₹0";
  }

  // 💰 GRAND TOTAL (TICKETS + FOOD)
  document.getElementById("totalAmount").textContent =
    `₹${booking.grandTotal}`;

  /* ------------------------------------------
     CURRENCY CONVERT FOR PAYPAL
  ------------------------------------------- */

  const amountUSD = (booking.grandTotal / 83).toFixed(2);

  /* ------------------------------------------
     PAYPAL PAYMENT
  ------------------------------------------- */

  if (window.paypal) {
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },

      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { value: amountUSD, currency_code: 'USD' },
            description:
              `Movie: ${booking.movie} | ${booking.seats.length} Tickets | Food Items: ${(booking.foodItems || []).length} | Total: ₹${booking.grandTotal}`
          }]
        });
      },

      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {

          // Save final confirmed booking
          localStorage.setItem("confirmedBooking", JSON.stringify({
            ...booking,
            payerName: details.payer.name.given_name,
            paymentMethod: "PayPal",
            orderId: data.orderID,
            paymentTime: new Date().toLocaleString()
          }));

          alert("Payment successful!");

          window.location.href = "ticket.html";
        });
      },

      onError: function (err) {
        console.error("PayPal Error:", err);
        alert("Payment failed. Please try again.");
      }
    }).render("#paypal-button-container");
  }

  /* ------------------------------------------
     UPI PAYMENT (DEMO)
  ------------------------------------------- */

  const upiPayBtn = document.getElementById("upiPayBtn");

  if (upiPayBtn) {
    upiPayBtn.addEventListener("click", () => {
      const name = document.getElementById("upiName").value.trim();
      const upiId = document.getElementById("upiId").value.trim();
      const phone = document.getElementById("upiPhone").value.trim();

      if (!name || !upiId || !phone) {
        alert("Please fill all UPI details.");
        return;
      }

      if (!upiId.includes("@")) {
        alert("Please enter a valid UPI ID (e.g., name@upi)");
        return;
      }

      if (phone.length < 10) {
        alert("Please enter a valid phone number.");
        return;
      }

      // Save confirmed booking with UPI info
      const upiBooking = {
        ...booking,
        payerName: name,
        upiId: upiId,
        phone: phone,
        paymentMethod: "UPI",
        paymentTime: new Date().toLocaleString()
      };

      localStorage.setItem("confirmedBooking", JSON.stringify(upiBooking));

      // alert("UPI payment simulated successfully! Redirecting to your ticket."); //trial
      alert("Redirecting to UPI payment."); //trial

      // window.location.href = "ticket.html"; //trail
      window.location.href = "upi_payment.html";

    });
  }
});
