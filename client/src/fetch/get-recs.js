// Change as needed for host
const backend_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000/";

// desired audio features wanted besides energy and valence
const audioFeatures = [];

async function GetRecommendations(size, seeds, mood, features = {}){
    const seedsString = seeds.toString();
    
    try{
        const requestURL = `${backend_url}playlist?size=${size}&seeds=${seedsString}&energy=${mood.energy}&valence=${mood.valence}${FeaturesToString(features)}`;

        if (!seeds){
            throw new Error("Error: No genre selected/empty seeds array");
        }

        const response = await fetch(requestURL);

        if (!response.ok){
            throw new Error("Error: could not fetch recommendations. ");
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