const fs = require('fs');
const csv = require('csv-parser');
const path = require('path'); 


async function getRecommendedSongs(valence, energy, genre) {
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
  
      // console.log(`Found song with valence diff ${Math.abs(valence - song.valence)}, expected
      // valence diff: ${valence_diff},  
      // requested valence=${valence}, song's actual valence=${song.valence},
      // `);
        
      return true;
    });

    

    valence_diff += 0.05;
    energy_diff += 0.05;
    /*
    Be wary that, due to floating point precision errors, that valence_diff may end up 
    having a different value than expected (slightly less than expected in my experience). 
    E.g. if you expect valence_diff to be 0.4, it might really be 0.399999999997. Therefore, 
    I compare valence_diff to a float using <= rather than <. 
    */ 
  } while (recommended_songs.length < 10 && valence_diff <= 0.35);

  //Test
  // console.log("\n\n\n\n\n\n\n-------------------------------------\n");
  // console.log("Requested valence: " + valence + ", energy: " + energy + ", genre: " + genre + "\n");
  // console.log("Recommended songs in the backend: \n\n")
  // recommended_songs.forEach(song => {
  // console.log(`Spotify ID: ${song.track_id}, Valence: ${song.valence}, Energy: ${song.energy}, 
  //   Genre: ${song.playlist_genre}\n`);
  // });

    /*Return an array of spotify track id's, which can be used to add songs to a spotify
    playlist.

    Format:
    ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "spotify:track:1301WleyT98MSxVHPZCA6M",
    ...]

    It's recommended to prepend the id's with "spotify:track:" to work with Spotify API,
    though not technically necessary.
    */
    //return recommended_songs.map(song => `spotify:track:${song.track_id}`);
    return recommended_songs.map(song => ({
      track_id: `spotify:track:${song.track_id}`,
      track_name: song.track_name,
      track_artist: song.track_artist
    }));
}

module.exports = getRecommendedSongs;


