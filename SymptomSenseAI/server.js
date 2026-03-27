const express = require('express');
const cors = require('cors');
const path = require('path');
const rulesEngine = require('./backend/rulesEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the static frontend (we will move preview.html to public/index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Hackathon Standout: Core Assessment API
app.post('/check', (req, res) => {
  const data = req.body; // Expects { main, duration, severity, additional }
  if(!data || !data.main) {
    return res.status(400).json({ error: "Main symptom is required for analysis." });
  }
  
  // Real Rule-based processing
  const result = rulesEngine.analyze(data);
  
  // Simulate network latency for UX loading spinner realism
  setTimeout(() => {
    res.json(result);
  }, 1200);
});

// Fallback routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SymptomSense AI Hackathon Backend is running!`);
  console.log(`🔗 Access it at http://localhost:${PORT}`);
});
