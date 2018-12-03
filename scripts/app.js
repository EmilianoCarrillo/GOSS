var spotifyApi = new SpotifyWebApi();
var audioPlayer = document.getElementById("AudioPlayer");

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
            startGame(data.items);
        });
    });
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
    console.log("Hola");
    $("#CategoriesContainer").show();
    $("#PlaylistsContainer").hide();
    $("#PlaylistsContainer").html('');
    document.querySelector("#BackButton").addEventListener("click", goToSelectRegion);
}

function goToSelectRegion() {
    console.log("Hi");
    $("#CountrySelection").show();
    $("#CategoriesContainer").hide();
    $("#CategoriesContainer").html('');
}


getTokenFromNode();