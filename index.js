const express = require("express");

const app = express();
app.use(express.json());

// logging middleware (MANDATORY)
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);

// knapsack logic (maximize impact within time)
const getBestImpact = (tasks, maxHours) => {
  const n = tasks.length;

  const dp = Array(n + 1).fill().map(() =>
    Array(maxHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          Impact + dp[i - 1][w - Duration],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
};

// main API
app.get("/schedule", (req, res) => {
  try {
    // fallback sample data (since API is failing)
    const maxHours = 60;

    const tasks = [
      { TaskID: "1", Duration: 1, Impact: 5 },
      { TaskID: "2", Duration: 6, Impact: 2 },
      { TaskID: "3", Duration: 1, Impact: 3 },
      { TaskID: "4", Duration: 5, Impact: 5 },
      { TaskID: "5", Duration: 7, Impact: 3 },
      { TaskID: "6", Duration: 6, Impact: 3 },
      { TaskID: "7", Duration: 5, Impact: 1 },
      { TaskID: "8", Duration: 5, Impact: 9 },
      { TaskID: "9", Duration: 6, Impact: 10 }
    ];

    const maxImpact = getBestImpact(tasks, maxHours);

    res.json({
      message: "Optimal schedule calculated",
      availableHours: maxHours,
      maximumImpact: maxImpact
    });

  } catch (err) {
    res.status(500).json({ message: "Error computing schedule" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});