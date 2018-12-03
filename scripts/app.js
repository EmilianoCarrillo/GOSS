var spotifyApi = new SpotifyWebApi();
var audioPlayer = document.getElementById("AudioPlayer");
$("#BackButton").hide();
$("#Game").hide();
document.getElementById("AdivinarBtn").disabled = true;


// POST to my node server to retrieve my Auth Token
function getTokenFromNode() {
    $.ajax({
        url: "https://music-guessing-game.herokuapp.com/",
        type: 'GET',
        success: function (res) {
            setToken(res.token);
        }
    });
}

function setToken(tokenFromNode){
    // Set authorization token to get access to the API 
    spotifyApi.setAccessToken(tokenFromNode);
}

// Choose region
document.querySelector("#CountrySelection button").addEventListener("click", function(){
    $("#BackButton").show();
    var region = document.getElementById("RegionSelector").value;
    getCategories(region);
});

function getCategories(country) {  
    $("#CategoriesContainer").show();
    $("#CountrySelection").hide();
    document.querySelector("#BackButton").removeEventListener("click", goToSelectCountry);
    document.querySelector("#BackButton").addEventListener("click", goToSelectRegion);

    let options;
    if(country == "MX"){
        options = {
            limit: 50,
            country: "MX"
        };
    }else{
        options = {
            limit: 50,
        };
    }

    // Get Categories from API
    spotifyApi.getCategories(options)
        .then(function (data) {
            data.categories.items.forEach(category => {                
                addCategoryToHTML(category);
            });
    });

}

function addCategoryToHTML(category){
    $('#CategoriesContainer').append(
        $('<div>')
        .addClass("column")
        .addClass("is-one-quarter-fullhd")
        .addClass("is-one-quarter-widescreen")
        .addClass("is-one-quarter-desktop")
        .addClass("is-one-quarter-tablet")
        .addClass("is-half-mobile")
        .addClass("category")
        .append(
            $("<img>")
                .attr("src", category.icons[0].url)
        ).append(
            $("<h2>")
            .text(category.name)
        )
    );

    let categoriesCollection = document.querySelectorAll(".category");
    let nCategories = categoriesCollection.length;

    categoriesCollection[nCategories-1].addEventListener("click", function(){
        showPlaylists(category.id);
    });
}

function showPlaylists(id){
    $("#CategoriesContainer").hide();
    $("#PlaylistsContainer").show();
    document.querySelector("#BackButton").removeEventListener("click", goToSelectRegion);
    document.querySelector("#BackButton").addEventListener("click", goToSelectCountry);

    var prev = spotifyApi.getCategoryPlaylists(id, { limit: 50 });
    prev.then(function(data){
        data.playlists.items.forEach(playlist => {
            addPlaylistToHTML(playlist);
        });
    });
}

function addPlaylistToHTML(playlist){
    $('#PlaylistsContainer').append(
        $('<div>')
        .addClass("playlist")
        .addClass("column")
        .addClass("is-one-quarter-fullhd")
        .addClass("is-one-quarter-widescreen")
        .addClass("is-one-quarter-desktop")
        .addClass("is-one-quarter-tablet")
        .addClass("is-half-mobile")
        .addClass("category")
        .append(
            $("<img>")
                .attr("src", playlist.images[0].url)
        )
    );

    let playlistsCollection = document.querySelectorAll(".playlist");
    let nPlaylists = playlistsCollection.length;

    playlistsCollection[nPlaylists-1].addEventListener("click", function(){
        spotifyApi.getPlaylistTracks(playlist.id)
        .then(function(data){
            postTracksAndGetURL(data.items, playlist.id);
        });
    });
}

var actual = 0;
var gameTracksIds;
var interval;
var timeout;
var numOfSongs = 3;

function postTracksAndGetURL(tracks, playlistId){

    $("#PlaylistsContainer").hide();
    $("#Game").show();
    $("#BackButton").hide();
    
    gameTracksIds = getRandomTracks(tracks);

    playRound(gameTracksIds[actual++], 3);

}

function playRound(trackId, seconds){
    spotifyApi.getTrack(trackId)
    .then(function(data){
        playforNSeconds(data.preview_url, seconds);

        var s = 10;
        timeout = setTimeout(function(){
            document.getElementById("AdivinarBtn").disabled = false;
            interval = setInterval(function () {
                if(s == 0) {
                    clearInterval(interval);
                    document.getElementById("TituloCancion").innerHTML = data.name;
                }
                $("#Tiempo").text(s--);
            }, 1000);
        }, seconds * 1000);
        
    });
}

function next(){
    console.log(actual);
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById("TituloCancion").innerHTML = "";
    $("#Tiempo").text("");
    clearInterval(interval);
    clearTimeout(timeout);


    if(actual == numOfSongs){
        alert("FINAL SCORE");
    } else{
        playRound(gameTracksIds[actual++], 3);
    }
}


function getRandomTracks(tracks){
    var flags = new Array(tracks.length); 
    var gameTracks = new Array();

    flags.fill(0);
    var randomNum;

    for(var i = 1; i<= numOfSongs; i++){
        randomNum = Math.floor(Math.random() * 100.0) % tracks.length;
        while(flags[randomNum] == 1 || tracks[randomNum].track.preview_url == null){
            randomNum = Math.floor(Math.random() * 100.0) % tracks.length;
        }
        gameTracks.push(tracks[randomNum].track.id);
        flags[randomNum] = 1;
    }

    return gameTracks;
}


function playforNSeconds(source, seconds) {
    $("#SiguienteBtn").hide();
    audioPlayer.src = source;
    audioPlayer.play();
    setTimeout(function () {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        $("#SiguienteBtn").show();
    }, seconds * 1000);
}

function goToSelectCountry(){
    $("#CategoriesContainer").show();
    $("#PlaylistsContainer").hide();
    $("#PlaylistsContainer").html('');
    document.querySelector("#BackButton").addEventListener("click", goToSelectRegion);
}

function goToSelectRegion() {
    $("#BackButton").hide();
    $("#CountrySelection").show();
    $("#CategoriesContainer").hide();
    $("#CategoriesContainer").html('');
}


getTokenFromNode();