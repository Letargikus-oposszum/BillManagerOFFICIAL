const API_URL = "http://localhost:3000/bills";
const billForm = document.getElementById("bill-form");
const billsContainer = document.getElementById("bills-container");

async function fetchBills() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
}

function createBillCard(bill, index) {
  const card = document.createElement("div");
  card.className = "bill-card";
  if (bill.status === "storno") card.classList.add("storno");

  card.innerHTML = `
    <div class="bill-header">
      <h3>Invoice #${bill.invoice_number}</h3>
      ${bill.status === "storno" 
        ? `<div class="status-label">STORNO</div>` 
        : `<button class="storno-btn" data-id="${bill.id}">Storno</button>`}
    </div>
    <div class="bill-dates">
      <div><strong>Issue Date:</strong> ${bill.issue_date}</div>
      <div><strong>Fulfillment Date:</strong> ${bill.fulfillment_date}</div>
      <div><strong>Payment Deadline:</strong> ${bill.payment_deadline}</div>
    </div>
    <div class="bill-info">
      <div><strong>Issuer ID:</strong> ${bill.issuer_id}</div>
      <div><strong>Customer ID:</strong> ${bill.customer_id}</div>
      <div><strong>Total Amount:</strong> $${bill.total_amount.toFixed(2)}</div>
      <div><strong>VAT Amount:</strong> $${bill.vat_amount.toFixed(2)}</div>
    </div>
  `;

  return card;
}

async function displayBills() {
  const bills = await fetchBills();
  billsContainer.innerHTML = "";

  bills.forEach((bill, i) => {
    const card = createBillCard(bill, i);
    billsContainer.appendChild(card);
  });
}

billsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("storno-btn")) {
    const billId = e.target.dataset.id;
    if (!confirm("Are you sure you want to storno this bill?")) return;

    try {
      const res = await fetch(`${API_URL}/${billId}/storno`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to storno bill");

      alert("Bill stornoed successfully");
      displayBills();
    } catch (err) {
      alert("Error stornoing bill: " + err.message);
    }
  }
});

billForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(billForm);
  const bill = Object.fromEntries(formData.entries());

  bill.total_amount = parseFloat(bill.total_amount);
  bill.vat_amount = parseFloat(bill.vat_amount);
  bill.issuer_id = parseInt(bill.issuer_id);
  bill.customer_id = parseInt(bill.customer_id);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    });
    if (!res.ok) throw new Error("Failed to create bill");

    billForm.reset();
    displayBills();
  } catch (err) {
    console.error("Error submitting bill:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  displayBills();
});
