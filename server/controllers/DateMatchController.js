const DateMatch = require("../models/DateMatch");

// Mocking standard date ideas mapped around the date-ideas-api style endpoints
const DATE_POOL = [
  { id: "act_1", title: "Movie Marathon", description: "Pick a series, build a fort, and get completely cozy.", location: "At Home", cost: "Free", category: "At-home", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800" },
  { id: "act_2", title: "Stargazing Picknick", description: "Grab a warm blanket, a bottle of wine, and head out to look at the night sky.", location: "Outdoors", cost: "Cheap", category: "Romantic", image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800" },
  { id: "act_3", title: "Cooking Challenge", description: "Pick 3 random ingredients from your pantry and try to craft a gourmet meal.", location: "At Home", cost: "Free", category: "Funny", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" }
];

exports.getIdeasForCouple = async (req, res) => {
  try {
    const { coupleId } = req.params;

    // Check if deck is already generated for this session
    let sessionCards = await DateMatch.find({ couple: coupleId });

    if (sessionCards.length === 0) {
      // Seed initial sequence using API template profiles
      const instances = DATE_POOL.map(idea => ({
        couple: coupleId,
        dateIdeaId: idea.id,
        title: idea.title,
        description: idea.description,
        location: idea.location,
        cost: idea.cost,
        category: idea.category,
        image: idea.image,
        likes: {}
      }));
      sessionCards = await DateMatch.insertMany(instances);
    }
    res.status(200).json(sessionCards);
  } catch (error) {
    res.status(500).json({ message: "Error loading the interactive matching deck." });
  }
};

exports.swipeDateIdea = async (req, res) => {
  try {
    const { matchCardId, userId, liked } = req.body;

    const card = await DateMatch.findById(matchCardId);
    if (!card) return res.status(404).json({ message: "Card target record not found." });

    // Assign dynamic map path value
    card.likes.set(userId, liked);

    // Verify if multiple separate keys evaluate to true within the pair mapping track
    const positiveLikes = Array.from(card.likes.values()).filter(v => v === true);
    
    // If there are 2 positive entries, we have a match!
    if (positiveLikes.length >= 2) {
      card.isMatched = true;
    }

    await card.save();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Error recording selection track." });
  }
};