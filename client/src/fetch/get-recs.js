// Change as needed for host
const isProd = process.env.NODE_ENV === 'production';

const BACKEND_URL = isProd
  ? process.env.REACT_APP_BACKEND_URL
  : 'http://localhost:4000';

//NEW VERSION OF THE FUNCTION FOR THE spotify_songs.csv file
async function GetRecommendations(mood, genre) {
    try{
        if (!mood.valence){
            throw new Error("Error: No valence value inputted");
        }

        if (!mood.energy){
            throw new Error("Error: No energy value inputted");
        }

        if (!genre){
            throw new Error("Error: No genre value inputted");
        }

        const requestURL = `${BACKEND_URL}/song?valence=${mood.valence}&energy=${mood.energy}&genre=${genre}`;
 
        const response = await fetch(requestURL);

        if (!response.ok){
            throw new Error("Error: could not fetch song recommendation.");
        }

        return await response;
    }

    catch (error){console.log(error)}
}


// desired audio features wanted besides energy and valence
// const audioFeatures = ['loudness'];

// async function GetRecommendations(size, seeds, mood, features = {}){
//     const seedsString = seeds.toString();
    
//     try{
//         const requestURL = `${BACKEND_URL}/playlist?size=${size}&seeds=${seedsString}&energy=${mood.energy}&valence=${mood.valence}${FeaturesToString(features)}`;
//         if (!seeds){
//             throw new Error("Error: No genre selected/empty seeds array");
//         }

//         const response = await fetch(requestURL);

//         if (!response.ok){
//             throw new Error("Error: could not fetch recommendations. ");
//         }

//         return await response.json();
//     }

//     catch (error){console.log(error)}
// }




// function FeaturesToString(obj){;
//     let featuresString = "";

//     for (let x in audioFeatures){
//         const feature = audioFeatures[x]
//         const value = obj[feature];

//         // if key exists within desired audiofeatures
//         if (value){
//             featuresString+= `&${feature}=${value}`;
//         }
//     }

//     return featuresString;
// }

module.exports = {GetRecommendations};