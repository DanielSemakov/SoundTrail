// Change as needed for host
const hostURL = "http://localhost:4000/";

// desired audio features wanted besides energy and valence
const audioFeatures = [];

async function GetRecommendations(size, seeds, mood, features = {}){
    const seedsString = seeds.toString();
    
    try{
        const requestURL = `${hostURL}playlist?size=${size}&seeds=${seedsString}&energy=${mood.energy}&valence=${mood.valence}${FeaturesToString(features)}`;
        console.log(requestURL);
        const response = await fetch(requestURL);

        if (!response.ok){
            throw new Error("Error: could not fetch recommendations");
        }

        return await response.json();
    }

    catch (error){console.log(error)}
}

function FeaturesToString(obj){;
    let featuresString = "";

    for (let x in audioFeatures){
        const feature = audioFeatures[x]
        const value = obj[feature];

        // if key exists within desired audiofeatures
        if (value){
            featuresString+= `&${feature}=${value}`;
        }
    }

    return featuresString;
}

module.exports = {GetRecommendations};