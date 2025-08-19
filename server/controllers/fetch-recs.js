const fs = require('fs');
const csv = require('csv-parser');
const path = require('path'); 


async function getRecommendedSong(valence, energy, genre) {
  console.log("Requested mood inside backend:", valence, energy);

  const all_songs = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'songs.csv'))
      //Cast values in the csv file for the specified headers into floats before storing them 
      //in all_songs
      .pipe(csv({ mapValues: ({ header, value }) => {
        //Only convert these specific numeric columns
        const numericColumns = ['valence', 'energy', 'danceability', 'loudness', 'speechiness', 
          'acousticness', 'instrumentalness', 'liveness', 'tempo', 'duration_ms'];
        
        if (numericColumns.includes(header)) {
          const num = parseFloat(value);
          return isNaN(num) ? value : num;
        }
        return value; // Keep everything else as string
      }}))
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

  let recommended_songs = [];

  //The acceptable difference between the inputted valence & energy and the actual valence and energy of 
  //the returned songs. If at least 5 songs don't fall within the current acceptable difference, that 
  //difference is incremented until 5 songs are returned and stored in recommended_songs.
  let valence_diff = 0.05;
  let energy_diff = 0.05;

  do {
    recommended_songs = all_songs.filter(song => {

      if (Math.abs(valence - song.valence) > valence_diff) return false;

      if (Math.abs(energy - song.energy) > energy_diff) return false;

      if (genre.toLowerCase() !== "all" 
        && song.playlist_genre.toLowerCase() !== genre.toLowerCase()) {
          return false;
      }
  
      return true;
    });

    valence_diff += 0.05;
    energy_diff += 0.05;
  } while (recommended_songs.length < 5);

  //Test
  console.log("\n\n\n\n\n\n\n-------------------------------------\n");
  console.log("Requested valence: " + valence + ", energy: " + energy + ", genre: " + genre);
  recommended_songs.forEach(song => {
  console.log(`Recommended songs in the backend: Spotify ID: ${song.track_id}, Valence: ${song.valence}, Energy: ${song.energy}, 
    Genre: ${song.playlist_genre}`);
  });

  //Get random song from recommended_songs array
  const rand_song = recommended_songs[Math.floor(Math.random() * recommended_songs.length)];

  //Test
  console.log("\n------------------------\nReturned song: spotify_id: " + rand_song.track_id + 
    ", valence: " + rand_song.valence + 
    ", energy: " + rand_song.energy + ", genre: " + rand_song.playlist_genre
  );

  return rand_song.track_id;
}

module.exports = {getRecommendedSong};


