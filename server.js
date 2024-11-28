const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a Requirement Schema and Model
const requirementSchema = new mongoose.Schema({
  stakeholder: String,
  projectDetails: String,
  date: { type: Date, default: Date.now },
});

const Requirement = mongoose.model('Requirement', requirementSchema);

// API Routes
app.post('/api/requirements', async (req, res) => {
  try {
    const { stakeholder, projectDetails } = req.body;
    const requirement = new Requirement({ stakeholder, projectDetails });
    await requirement.save();
    res.status(201).json({ message: 'Requirement saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving requirement', error });
  }
});

app.get('/api/requirements', async (req, res) => {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
