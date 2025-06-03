const API_URL = "http://localhost:3000/bills";
const billForm = document.getElementById("bill-form");

async function fetchBills() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
}

async function displayBills() {
  const bills = await fetchBills();
  const tableBody = document.querySelector("#bill-table tbody");
  tableBody.innerHTML = "";

  bills.forEach((bill, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${bill.invoice_number}</td>
      <td>${bill.issue_date}</td>
      <td>${bill.fulfillment_date}</td>
      <td>${bill.payment_deadline}</td>
      <td>${bill.total_amount}</td>
      <td>${bill.vat_amount}</td>
      <td>${bill.issuer_id}</td>
      <td>${bill.customer_id}</td>
    `;
    tableBody.appendChild(row);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  displayBills();
});

billForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(billForm);
  const bill = Object.fromEntries(formData.entries());

  // Convert numeric fields
  bill.total_amount = parseFloat(bill.total_amount);
  bill.vat_amount = parseFloat(bill.vat_amount);
  bill.issuer_id = parseInt(bill.issuer_id);
  bill.customer_id = parseInt(bill.customer_id);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bill),
    });

    if (!res.ok) throw new Error("Failed to create bill");

    billForm.reset();
    loadBills(); // reload table
  } catch (err) {
    console.error("Error submitting bill:", err);
  }
});