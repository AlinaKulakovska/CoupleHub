const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bucketListRoutes = require("./routes/bucketListRoutes");
const moodRoutes = require("./routes/MoodRoutes");
const expenseRoutes = require("./routes/expenseRouutes");
const taskRoutes = require("./routes/taskRoutes");
const challengeRoutes = require("./routes/ChallengeRoutes");
const memoryRoutes = require("./routes/memoryRoutes"); // Import memory routes
const truthDareRoutes = require("./routes/truthDareRoutes"); // Import truth/dare routes
const recipeRoutes = require("./routes/recipeRoutes"); // Moved up with other imports

require("dotenv").config();

const app = express();

// 1. GLOBAL MIDDLEWARES (MUST GO FIRST)
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your React dev server
    credentials: true
}));
app.use(express.json()); // Parses incoming json requests so req.body works!

// 2. MOUNT ROUTERS (MUST GO AFTER GLOBAL MIDDLEWARES)
app.use("/api/bucket-list", bucketListRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/truth-dare", truthDareRoutes);
app.use("/api/challenges", challengeRoutes);
// app.use('/api/recipes', recipeRoutes); // Mount your recipe routes here if needed

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});