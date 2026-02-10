async function loadStats() {
    const res = await fetch("/summary/statistics");
    const data = await res.json();

    income.innerText = "₹" + data.income.toLocaleString();
    expense.innerText = "₹" + data.expense.toLocaleString();
    balance.innerText = "₹" + data.balance.toLocaleString();

    drawDonut(data.expense, data.income);
}

let donutChartInstance;

function drawDonut(expense, income) {
    if (donutChartInstance) donutChartInstance.destroy();

    donutChartInstance = new Chart(donutChart, {
        type: "doughnut",
        data: {
            labels: ["Expense", "Income"],
            datasets: [{
                data: [expense, income],
                backgroundColor: ["#ff6b6b", "#3fa37c"]
            }]
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 12,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// CATEGORY GRAPH
async function loadCategory() {
    const res = await fetch("/summary/category");
    const data = await res.json();

    new Chart(categoryChart, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: "#3fa37c",
                borderRadius: 6
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: { font: { size: 12 } }
                },
                x: {
                    ticks: { font: { size: 12 } }
                }
            }
        }
    });
}

loadStats();
loadCategory();
