var spotifyApi = new SpotifyWebApi();
var audioPlayer = document.getElementById("AudioPlayer");
$("#BackButton").hide();

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

function postTracksAndGetURL(tracks, playlistId){
    var gameTracksIds = getRandomTracks(tracks);

    $("#PlaylistsContainer").hide();

    var parametros = {
        tracks: gameTracksIds,
        playlist: playlistId
    };
    $.ajax({
        data: parametros,
        url: "php/crear_party.php",
        type: "post",
        beforeSend: function(){
            console.log("Cargando...");
        },
        success: function(data){
            window.location.href = ("./game.html?id=") + data;
        },
        error: function(request, status, error){
            console.log("Status: " + status + " Error:" + error);
        }
    });

}


function getRandomTracks(tracks){
    var flags = new Array(tracks.length); 
    var gameTracks = new Array();

    flags.fill(0);
    var randomNum;

    for(var i = 1; i<= 10; i++){
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
    audioPlayer.src = source;
    audioPlayer.play();
    setTimeout(function () {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
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