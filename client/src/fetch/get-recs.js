import toast from 'react-hot-toast';

// Change as needed for host
const isProd = process.env.NODE_ENV === 'production';

const BACKEND_URL = isProd
  ? process.env.REACT_APP_BACKEND_URL
  : 'http://localhost:4000';




async function startSession() {
    try { 
        const sessionId = localStorage.getItem('sessionId');

        if (sessionId) {
            console.log('Using existing session ID');
            return sessionId;
        }

        const res = await fetch(`${BACKEND_URL}/start-session`, {
             method: 'GET' 
        }); 

        const data = await response.json();

        localStorage.setItem('sessionId', data.sessionId);
        console.log('Created new session ID');

        return data.sessionId;
    } catch (err) { 
        console.error('Error starting session:', err); 
    } 
}

let hasHeartbeatStarted = false;

async function startHeartbeat() {
    // Prevent multiple intervals
    if (hasHeartbeatStarted) return;
    
    hasHeartbeatStarted = true;
        
    setInterval(() => {
        fetch(`${BACKEND_URL}/api/heartbeat`, {
        method: 'POST',
        credentials: 'include'
        });
    }, 30000);
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
            credentials: 'include', 
            body: JSON.stringify({ valence, energy, genre })
        });

        const data = await response.json();

        if (!response.ok) {
            //Status code 429 is part of HTTP Standard for "Too Many Requests"
            if (response.status === 429) {
                alert(data.message || 'Please wait before creating another playlist');
                return;
            } 

            throw new Error(`Server error (${response.status})`);
        }

        console.log("Successfully received playlist from the frontend's getPlaylistRec() function:\n" +
            data.playlist
        );

        startHeartbeat();

        return data.playlist;
    } catch (err) {
        throw err;
    } 
}

export {getPlaylistRec, startSession};