const apiURL = "https://api.reccobeats.com/v1"
const audioFeatures = ["energy", "valence", "test-shouldbeundefined"];

async function FetchRecommendations(seeds = ['d58affe1-3e80-4318-b33f-9f85bbecf693'], size = 5, features = {energy:"", valence:""}){
    //test url: https://api.reccobeats.com/v1/track/recommendation?size=3&seeds=83dc71c7-b9da-466b-a198-bb3c29ee8f00
    const seedsString = SeedsToString(seeds);

    let recsURL = `/track/recommendation?size=${size}&seeds=${seedsString}`;
    let featuresString = FeaturesToString(features);

    const finalURL = apiURL+recsURL+featuresString;

    try{
        const response = await fetch(finalURL);

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

function FeaturesToString(obj){;
    let featuresString = "";

    for (x in audioFeatures){
        const feature = audioFeatures[x]
        const value = obj[feature];

        // if value exists
        if (value){
            featuresString+= `&${feature}=${value}`;
        }
    }

    return featuresString;
}

module.exports = {FetchRecommendations};
