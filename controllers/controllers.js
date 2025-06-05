import dbPromise from "../db/db.js";

// Get all active bills only (ignore storno)
export const getBill = async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM Bills WHERE status = 'active'");

  const result = rows.map(row => ({
    id: row.id,
    issuer_id: row.issuer_id,
    customer_id: row.customer_id,
    invoice_number: row.invoice_number,
    issue_date: row.issue_date,
    fulfillment_date: row.fulfillment_date,
    payment_deadline: row.payment_deadline,
    total_amount: row.total_amount,
    vat_amount: row.vat_amount,
    status: row.status,
  }));

  res.status(200).json(result);
};

// Get bill by ID regardless of status
export const getBillById = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const row = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);

  if (!row) return res.status(404).json({ message: "Bill not found" });

  res.status(200).json({
    id: row.id,
    issuer_id: row.issuer_id,
    customer_id: row.customer_id,
    invoice_number: row.invoice_number,
    issue_date: row.issue_date,
    fulfillment_date: row.fulfillment_date,
    payment_deadline: row.payment_deadline,
    total_amount: row.total_amount,
    vat_amount: row.vat_amount,
    status: row.status,
  });
};

// Create bill (default status = active)
export const createBill = async (req, res) => {
  const db = await dbPromise;
  const {
    issuer_id,
    customer_id,
    invoice_number,
    issue_date,
    fulfillment_date,
    payment_deadline,
    total_amount,
    vat_amount,
  } = req.body;

  if (
    !issuer_id || !customer_id || !invoice_number || !issue_date ||
    !fulfillment_date || !payment_deadline || !total_amount || vat_amount === undefined
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const result = await db.run(
    `INSERT INTO Bills 
     (issuer_id, customer_id, invoice_number, issue_date, fulfillment_date, payment_deadline, total_amount, vat_amount, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [
      issuer_id,
      customer_id,
      invoice_number,
      issue_date,
      fulfillment_date,
      payment_deadline,
      total_amount,
      vat_amount,
    ]
  );

  const newBill = await db.get("SELECT * FROM Bills WHERE id = ?", [result.lastID]);
  res.status(201).json(newBill);
};

// Storno bill (mark as canceled instead of deleting)
export const stornoBill = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);

  const bill = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);
  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }

  // Update status to 'storno'
  await db.run("UPDATE Bills SET status = 'storno' WHERE id = ?", [id]);

  res.status(200).json({ message: `Bill ID ${id} has been stornoed (canceled).` });
};

