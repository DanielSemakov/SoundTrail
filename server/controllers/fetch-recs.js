const apiURL = "https://api.reccobeats.com/v1"

async function FetchRecommendations(url){
    //sample url: https://api.reccobeats.com/v1/track/recommendation?size=3&seeds=83dc71c7-b9da-466b-a198-bb3c29ee8f00

    const requestURL = apiURL + "/track/recommendation?" +url;
    try{
        const response = await fetch(requestURL);

        if (!response.ok){
            throw new Error("Error: could not fetch recommendations");
        }

        return await response.json();
    }

    catch (error){console.log(error)}
}

module.exports = {FetchRecommendations};



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
 * energy, and genre match the input. The valence and energy in the csv file are rounded
 * to the nearest tenth.
 */
async function getRecommendedSong(valence, energy, genre) {
  const fs = require('fs');
  const csv = require('csv-parser');

  const all_songs = [];
  fs.createReadStream('songs.csv') // Open the file as a stream
    .pipe(csv())                   // Pipe it into the parser
    .on('data', (row) => {
      all_songs.push(row);            // Push each parsed row into the array
    })
    .on('end', () => {
      console.log(all_songs);         // Log the full array once parsing is done
    });



  //All songs in recommended_songs match inputted genre, valence, and energy

  const recommended_songs = 0;

  if (genre === 'all') {
    recommended_songs = all_songs;
  } else {
    recommended_songs = all_songs.filter(item => {
    if (item.playlist_genre !== genre) return false;

    rounded_valence = Math.round(valence * 10) / 10;
    if (item.valence !== rounded_valence) return false;

    rounded_energy = Math.round(energy * 10) / 10;
    if (item.energy !== rounded_energy) return false;

    return true;
  });
  }

  //Get random song from recommended_songs array
  const rand_song = recommended_songs[Math.floor(Math.random() * recommended_songs.length)];

  //Return spotify id for rand_song
  return rand_song.track_id;
}

module.exports = {getRecommendedSong};
