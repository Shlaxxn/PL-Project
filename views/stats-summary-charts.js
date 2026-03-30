 
function computeCumulativeWinRates(stats) {
  // Sort stats by submittedAt
  const sortedStats = stats
    .filter(s => s.submittedAt)
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

  if (!sortedStats.length) return [];

  let totalGames = 0;
  let totalWins = 0;

  return sortedStats.map((stat, index) => {
    totalGames += 1;
    if ((stat.result || '').toLowerCase() === 'win') {
      totalWins += 1;
    }
    const winRate = totalGames ? Number((totalWins / totalGames * 100).toFixed(1)) : 0;

    return {
      gameNumber: index + 1,
      date: new Date(stat.submittedAt).toLocaleDateString(),
      games: totalGames,
      wins: totalWins,
      winRate: winRate,
    };
  });
}

function renderWinRateTable(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const gameData = computeCumulativeWinRates(stats);
  if (!gameData.length) {
    container.innerHTML = '<p>No game data available yet.</p>';
    return;
  }

  // Clear any existing content
  container.innerHTML = '';

  // Create canvas for chart
  const canvas = document.createElement('canvas');
  canvas.id = 'winrateChart';
  canvas.width = 400;
  canvas.height = 200;

  container.innerHTML = `
    <section class="stat-item">
      <h3>Win Rate Over Games Played</h3>
      <div style="margin-top: 0.5rem;">${canvas.outerHTML}</div>
    </section>
  `;

  // Prepare data for Chart.js
  const labels = gameData.map(item => `${item.gameNumber}`);
  const data = gameData.map(item => item.winRate);

  new Chart(document.getElementById('winrateChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Win Rate (%)',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}
