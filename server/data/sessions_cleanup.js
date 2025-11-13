const sessions = require("./sessions.js");

//Clean up sessions that haven't updated their lastActivityTime recently
function cleanUpInactiveSessions() {
    setInterval(() => {
        const TIMEOUT = 60 * 1000; 
        const now = Date.now();

        //Test
        console.log('\n********************');
        console.log("SEARCHING FOR INACTIVE SESSIONS...");
        console.log('********************\n');
        
        sessions.forEach(session => {
            if (session.sessionId && session.lastActivityTime && now - session.lastActivityTime > TIMEOUT) {
                console.log('\n********************');
                console.log(`ClEANING UP INACTIVE SESSION WITH SESSION ID: ${session.sessionId} and
                    PLAYLIST ID: ${session.playlistId}`);
                console.log('********************\n');

                session.sessionId = null;
                session.lastActivityTime = null;
                session.lastPlaylistUpdateTime = null;
            }
        });
    }, 60 * 1000); 
}

module.exports = cleanUpInactiveSessions;

