const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const iconv = require("iconv-lite");   // encoding fix
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let data = [];

// ✅ CSV file ko UTF-8 without BOM ke saath decode karna
fs.createReadStream("NATIONAL AYURVEDA MORBIDITY CODES.csv")
  .pipe(iconv.decodeStream("utf8"))   // 👈 important
  .pipe(csv())
  .on("data", (row) => {
    data.push(row);
  })
  .on("end", () => {
    console.log("✅ CSV successfully processed with UTF-8 encoding");
  });

// ✅ GET all records (ALL FIELDS included)
app.get("/records", (req, res) => {
  res.json(data);   // 👈 pura row bhej rahe hain
});

// ✅ GET record by ID
app.get("/records/:id", (req, res) => {
  const record = data.find((r) => r.NAMC_ID === req.params.id);
  record ? res.json(record) : res.status(404).json({ message: "Not found" });
});

// ✅ POST new record
app.post("/records", (req, res) => {
  const newRecord = req.body;
  data.push(newRecord);
  res.status(201).json({ message: "Record added", record: newRecord });
});

// ✅ PUT update record
app.put("/records/:id", (req, res) => {
  const index = data.findIndex((r) => r.NAMC_ID === req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    res.json({ message: "Record updated", record: data[index] });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// ✅ DELETE record
app.delete("/records/:id", (req, res) => {
  const index = data.findIndex((r) => r.NAMC_ID === req.params.id);
  if (index !== -1) {
    const deleted = data.splice(index, 1);
    res.json({ message: "Record deleted", record: deleted });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
