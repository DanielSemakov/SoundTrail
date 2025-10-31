const sessions = require("./sessions.js");

//Clean up sessions that haven't updated their lastActivityTime recently
function cleanUpInactiveSessions() {
    setInterval(() => {
        const TIMEOUT = 60 * 1000; 
        const now = Date.now();
        
        sessions.forEach(session => {
            if (session.sessionId && session.lastActivityTime && now - session.lastActivityTime > TIMEOUT) {
                console.log(`Releasing playlist for inactive session: ${session.sessionId}`);

                session.sessionId = null;
                session.lastActivityTime = null;
                session.lastPlaylistUpdateTime = null;
            }
        });
    }, 60 * 1000); 
}

module.exports = cleanUpInactiveSessions;

