const selectedMetrics = [];

function generateReport() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  selectedMetrics.length = 0;
  checkboxes.forEach((box) => selectedMetrics.push(box.value));

  if (selectedMetrics.length === 0) {
    alert("Please select at least one metric.");
    return;
  }

  fetch('/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics: selectedMetrics })
  })
  .then((res) => res.json())
  .then((data) => {
    renderChart(data);
  });
}

function renderChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.metrics,
      datasets: [{
        label: 'Dummy Data',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    }
  });
}

function downloadCSV() {
  window.open('/download-csv', '_blank');
}
