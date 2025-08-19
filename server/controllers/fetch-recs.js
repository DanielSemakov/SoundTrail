// const apiURL = "https://api.reccobeats.com/v1"

// async function FetchRecommendations(url){
//     //sample url: https://api.reccobeats.com/v1/track/recommendation?size=3&seeds=83dc71c7-b9da-466b-a198-bb3c29ee8f00

//     const requestURL = apiURL + "/track/recommendation?" +url;
//     try{
//         const response = await fetch(requestURL);

//         if (!response.ok){
//             throw new Error("Error: could not fetch recommendations");
//         }

//         return await response.json();
//     }

//     catch (error){console.log(error)}
// }

// // module.exports = {FetchRecommendations};



/**
 * //In the future, I can also have "size" as a parameter, indicating the number of songs 
 * //returned in the list. But for now, I only need to return one song, to keep it simple.
 * getRecommendedSongs(valence, energy, genre) {} return value = spotify_id (of a random song in the list that matches this value)
 *    1. Create a list of spotify id's for all songs that match inputted valence, energy, and genre
 *             a. playlist_genre = inputted genre (e.g. pop, rap, edm, rock, etc.)
 *             b. valence (rounded to tenths place) = inputted valence
 *             c. energy (rounded to tenths place) = inputted energy
 *    2. Return a random spotify id from this list
 * 
 */



/**Returns the spotify id of 1 random song in the spotify_songs.csv file whose valence,
 * energy, and genre match the input. 
 */

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path'); 


async function getRecommendedSong(valence, energy, genre) {
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

  //Get random song from recommended_songs array
  const rand_song = recommended_songs[Math.floor(Math.random() * recommended_songs.length)];

  //Temporarily used to verify song info for testing purposes
  // return {
  //   id: rand_song.track_id,
  //   valence: rand_song.valence,
  //   energy: rand_song.energy,
  //   genre: rand_song.playlist_genre
  // }

  //Return spotify id for rand_song
  return rand_song.track_id;
}

module.exports = {getRecommendedSong};


