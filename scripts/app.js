var spotifyApi = new SpotifyWebApi();
var myToken;
var audioPlayer = document.getElementById("AudioPlayer");

console.log("Hola");

// POST to my node server to retrieve my Auth Token
function getTokenFromNode() {
    $.ajax({
        url: "http://localhost:3000/token",
        type: 'GET',
        success: function(res) {
            main(res.token);
        }
    }); 
}

function main(tokenFromNode){
    
    // Set authorization token to get access to the API 
    spotifyApi.setAccessToken(tokenFromNode);

    // Get Categories from API
    spotifyApi.getCategories({limit: 50})
    .then(function(data){
        console.log(data.categories);
        data.categories.items.forEach(category => {
            console.log(category.name);
        });
    });


    spotifyApi.getTrack("2Foc5Q5nqNiosCNqttzHof")
    .then(function (data){
        playforNSeconds(data.preview_url, 1);
    });

}

function playforNSeconds(source, seconds){
    audioPlayer.src = source;
    audioPlayer.play();
    setTimeout(function (){
        audioPlayer.pause();
        audioPlayer.currentTime = 0;        
    }, seconds * 1000);
}

getTokenFromNode();

