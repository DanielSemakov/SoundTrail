import React, { useEffect, useState } from 'react';

const apiURL = "https://api.reccobeats.com/v1"
let embedIndex = 0;

export default function ShowPlaylist(){
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState(null);

    // TODO: rewrite this to send request to api endpoint, which is in server side
    useEffect(() => {
        FetchRecommendations().then(fetchedTracks =>{
            setTracks(fetchedTracks.content);
            setLoading(false);
        })
    }, []);

    if (loading){
        // placeholder loader
        return <div>loading...</div>;
    }

    return (
    <>
        <Playlist tracks={tracks}/>
    </>

    );
}

function TrackEmbed(track){
    return (
        <iframe 
            // style="border-radius":"12px" 
            src= {GenerateEmbedURL(track)}
            width="100%"
            height="352" 
            // frameBorder="0" 
            // allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
        </iframe>);
}

// sample playlist function that displays all embeds.
function Playlist({tracks}){
    const playlist = [];

    for (let x = 0; x < tracks.length; x++){
        playlist.push(TrackEmbed(tracks[x]));
    }

    console.log("playlist loaded");
    return <div>{playlist}</div>;
}

// TODO: Add the below functions to backend later on
// FUTURE BACKEND FUNCTIONS
async function FetchRecommendations(seeds = ['d58affe1-3e80-4318-b33f-9f85bbecf693'], size = 5, energy = "", valence = ""){
    //test url: https://api.reccobeats.com/v1/track/recommendation?size=3&seeds=83dc71c7-b9da-466b-a198-bb3c29ee8f00
    const seedsString = SeedsToString(seeds);

    let recsURL = `/track/recommendation?size=${size}&seeds=${seedsString}`;

    try{
        const response = await fetch(apiURL+recsURL);

        if (!response.ok){
            throw new Error("Error: could not fetch recommendations");
        }

        return await response.json();
    }

    catch (error){console.log(error)}
}

function SeedsToString(seeds){
    let output = "";

    for (let x = 0; x < seeds.length; x++){
        if (x > 0){
            output += ",";
        }

        output += seeds[x];
    }   

    return output;
}

function GenerateEmbedURL(track){
    const link = track.href;

    // if index for embed hasn't already been calculated
    if (embedIndex === 0){
        let dash = 0;

        for (let x = 0; x < link.length; x++){
            if (link[x] === "/"){
                dash++;
            }

            if (dash === 3){
                embedIndex = x+1;
                break;
            }
        }
    }

    //sample link: https://open.spotify.com/embed/track/6wbt5QD31GiRa28x5vPJty?utm_source=generator
    const embedLink = link.slice(0, embedIndex) + 'embed/' + link.slice(embedIndex) + '?utm_source=generator'; 

    return embedLink;
}


