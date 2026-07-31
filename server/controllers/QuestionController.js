const QuestionAnswer = require("../models/QuestionAnswer");

// Get today's question (or create it from API Ninjas if missing)
exports.getTodayQuestion = async (req, res) => {
  try {
    const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Check if entry already exists in MongoDB
    let record = await QuestionAnswer.findOne({ dateKey: todayKey });

    if (!record) {
      let fetchedQuestion = "What does love look like to you on an ordinary Tuesday?";

      // Call API Ninjas securely from backend server
      try {
        const apiKey = process.env.API_NINJAS_KEY || "9H84RBTLjGLy0OgzC86fQSLo07UFxv49NMXS5zbd"; // Fallback to default if not set
        const apiRes = await fetch("https://api.api-ninjas.com/v1/triviaoftheday", {
          headers: { "X-Api-Key": apiKey }
        });
        const apiData = await apiRes.json();
        
        if (apiData && apiData.length > 0 && apiData[0].question) {
          fetchedQuestion = `"${apiData[0].question}"`;
        }
      } catch (apiErr) {
        console.error("API Ninjas Fetch Error, falling back to default:", apiErr);
      }

      // Save new record to MongoDB
      record = new QuestionAnswer({
        dateKey: todayKey,
        question: fetchedQuestion,
        answers: { Alex: "", Sam: "" }
      });
      await record.save();
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to load question from database.", error: error.message });
  }
};

// Submit or update an answer for Alex or Sam
exports.submitAnswer = async (req, res) => {
  try {
    const { dateKey, user, answer } = req.body; // user = "Alex" or "Sam"

    if (!dateKey || !user || !answer) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const record = await QuestionAnswer.findOne({ dateKey });
    if (!record) {
      return res.status(404).json({ message: "Question entry not found for this date." });
    }

    // Save answer under the appropriate user key
    record.answers[user] = answer;
    await record.save();

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit answer.", error: error.message });
  }
};

// Get past questions history
exports.getHistory = async (req, res) => {
  try {
    const todayKey = new Date().toISOString().slice(0, 10);
    // Find all entries prior to today
    const history = await QuestionAnswer.find({ dateKey: { $ne: todayKey } })
      .sort({ dateKey: -1 })
      .limit(10);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve history.", error: error.message });
  }
};