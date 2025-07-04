const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve React static files from the build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Define API routes here
app.get('/api/song', (req, res) => {
  res.json({ title: 'Sample Song', artist: 'Artist Name' });
});

// For any other request, serve React's index.html (enables client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
