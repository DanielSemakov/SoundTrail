// Change as needed for host
const isProd = process.env.NODE_ENV === 'production';

const BACKEND_URL = isProd
  ? process.env.REACT_APP_BACKEND_URL
  : 'http://localhost:4000';

//NEW VERSION OF THE FUNCTION FOR THE spotify_songs.csv file
async function GetRecommendations(mood, genre) {
    try{
        if (mood.valence == null){
            throw new Error("Error: No valence value inputted");
        }

        if (mood.energy == null){
            throw new Error("Error: No energy value inputted");
        }

        if (!genre){
            throw new Error("Error: No genre value inputted");
        }

        //Ensure genre is encoded in case it contains special characters
        //E.g. the "&" in "r&b"
        const requestURL = `${BACKEND_URL}/song?valence=${mood.valence}&energy=${mood.energy}
        &genre=${encodeURIComponent(genre)}`;
 
        const response = await fetch(requestURL);

        if (!response.ok){
            throw new Error("Error: could not fetch song recommendation.");
        }

        const response_json = await response.json();
        const result = await response_json.spotify_id;
        console.log("Fetched spotify ID: " + result);

        return result;
    }

    catch (error){console.log(error)}
}

module.exports = {GetRecommendations};