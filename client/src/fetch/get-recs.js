// Change as needed for host
const isProd = process.env.NODE_ENV === 'production';

const BACKEND_URL = isProd
  ? process.env.REACT_APP_BACKEND_URL
  : 'http://localhost:4000';


async function startSession() {
    try { 
        const res = await fetch(`${BACKEND_URL}/start-session`, { method: 'GET', credentials: 'include' }); 
        const data = await res.json(); 
        console.log('Session started:', data.sessionId); 
    } catch (err) { 
        console.error('Session error:', err); 
    } 
}

async function getPlaylistRec(mood, genre) {
    try{
        const { valence, energy } = mood;

        if (valence == null){
            throw new Error("Error: No valence value inputted");
        }

        if (energy == null){
            throw new Error("Error: No energy value inputted");
        }

        if (!genre){
            throw new Error("Error: No genre value inputted");
        }

        const response = await fetch(`${BACKEND_URL}/api/generate-playlist`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valence, energy, genre })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate playlist');
        }

        console.log("Successfully received playlist from the frontend's getPlaylistRec() function:\n" +
            data.playlist
        );

        return data.playlist;
    } catch (err) {
        throw err;
    } 
}

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

module.exports = {getPlaylistRec, startSession};