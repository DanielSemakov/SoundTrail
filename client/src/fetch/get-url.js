function GenerateEmbedURL(track){
    let embedIndex = 0;
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

module.exports = {GenerateEmbedURL};