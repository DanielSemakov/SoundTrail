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


