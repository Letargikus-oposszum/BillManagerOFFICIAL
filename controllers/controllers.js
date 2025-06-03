import dbPromise from "../db/db.js";

export const getBill = async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM Bills");

  const result = rows.map(row => ({
    issuer_id: row.issuer_id,
    customer_id: row.customer_id,
    invoice_number: row.invoice_number,
    issue_date: row.issue_date,
    fulfillment_date: row.fulfillment_date,
    payment_deadline: row.payment_deadline,
    total_amount: row.total_amount,
    vat_amount: row.vat_amount,
    Bills: JSON.parse(row.Bill_list),
  }));

  res.status(200).json(result);
};

export const getBillById = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const row = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);

  if (!row) return res.status(404).json({ message: "Bill not found" });

  res.status(200).json({
    issuer_id: row.issuer_id,
    customer_id: row.customer_id,
    invoice_number: row.invoice_number,
    issue_date: row.issue_date,
    fulfillment_date: row.fulfillment_date,
    payment_deadline: row.payment_deadline,
    total_amount: row.total_amount,
    vat_amount: row.vat_amount,
    Bills: JSON.parse(row.Bill_list),
  });
};

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
     (issuer_id, customer_id, invoice_number, issue_date, fulfillment_date, payment_deadline, total_amount, vat_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

// Update a bill
export const updateBill = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
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

  const check = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);
  if (!check) return res.status(404).json({ message: "Bill not found" });

  await db.run(
    `UPDATE Bills SET 
     issuer_id = ?, customer_id = ?, invoice_number = ?, issue_date = ?, 
     fulfillment_date = ?, payment_deadline = ?, total_amount = ?, vat_amount = ?
     WHERE id = ?`,
    [
      issuer_id,
      customer_id,
      invoice_number,
      issue_date,
      fulfillment_date,
      payment_deadline,
      total_amount,
      vat_amount,
      id,
    ]
  );

  const updated = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);
  res.status(200).json(updated);
};

// Delete a bill
export const deleteBill = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);

  const check = await db.get("SELECT * FROM Bills WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "Bill not found" });
  }

  await db.run("DELETE FROM Bills WHERE id = ?", [id]);
  res.status(200).json({ message: "Delete successful" });
};

