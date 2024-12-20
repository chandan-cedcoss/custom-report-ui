const express = require('express');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

let selectedMetrics = [];

app.post('/generate-report', (req, res) => {
  selectedMetrics = req.body.metrics;

  const dummyData = selectedMetrics.map(() => Math.floor(Math.random() * 100));
  res.json({ metrics: selectedMetrics, values: dummyData });
});

app.get('/download-csv', (req, res) => {
  const csvFields = selectedMetrics;
  const csvData = [];

  for (let i = 0; i < 10; i++) {
    const row = {};
    selectedMetrics.forEach((metric) => {
      row[metric] = Math.floor(Math.random() * 100);
    });
    csvData.push(row);
  }

  const json2csvParser = new Parser({ fields: csvFields });
  const csv = json2csvParser.parse(csvData);

  const filePath = path.join(__dirname, 'report.csv');
  fs.writeFileSync(filePath, csv);

  res.download(filePath, 'report.csv', () => {
    fs.unlinkSync(filePath);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
