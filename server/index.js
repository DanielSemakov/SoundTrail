// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🎵 80s-style mock track data
const genreToMockTrack = {
  rock: {
    name: "Epic Rock",
    artists: [{ name: "AlexGrohl" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  pop: {
    name: "80s Pop Vibe",
    artists: [{ name: "RetroBeat" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  jazz: {
    name: "Smooth Retro Jazz",
    artists: [{ name: "JazzMaster" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  classical: {
    name: "Classical Serenity",
    artists: [{ name: "Orchestra 88" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  electronic: {
    name: "Synthwave Drive",
    artists: [{ name: "ElectroPulse" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  "hip-hop": {
    name: "Boom Bap Classic",
    artists: [{ name: "DJ OldSchool" }],
    album: {
      images: [
        {
          url: "https://www.creativefabrica.com/wp-content/uploads/2020/08/06/Music-Logo-Graphics-4868281-1-1-580x386.jpg",
        },
      ],
    },
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
};

// API route: returns one track per genre
app.post('/api/recommendation', (req, res) => {
  const { genre } = req.body;

  const mockTrack = genreToMockTrack[genre];
  if (!mockTrack) {
    return res.status(400).json({ error: 'Unsupported genre' });
  }

  res.json({ tracks: [mockTrack] });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
