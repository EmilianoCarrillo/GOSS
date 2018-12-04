var spotifyApi = new SpotifyWebApi();
var audioPlayer = document.getElementById("AudioPlayer");
$("#BackButton").hide();
$("#Game").hide();

$("#MainTitle").hide();
$("#MainTitle2").hide();
$("#ScoreContainer").hide();
document.getElementById("AdivinarBtn").disabled = false;
document.getElementById("Intento").focus();


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
    $("#Goss").hide();
    $("#MainTitle").show();
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
    $("#MainTitle").hide();
    $("#MainTitle2").show();
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
            postTracksAndGetURL(data.items, playlist.name);
        });
    });
}

var actual = 0;
var gameTracksIds;
var interval;
var timeout;
var numOfSongs = 8;
var cancionActual;
var points = 0;

function postTracksAndGetURL(tracks, playlistName){
    document.getElementById("Intento").focus();
    $("header").hide();
    $("#MainTitle").hide();
    $("#MainTitle2").hide();
    $("#PlaylistsContainer").hide();
    $("#Game").show();
    $("#BackButton").hide();
    
    gameTracksIds = getRandomTracks(tracks);
    document.getElementById("PlaylistName").innerHTML = "\""+ playlistName + "\"";
    document.getElementById("Ronda").innerHTML = ("CANCIÓN " + parseInt(actual+1));

    playRound(gameTracksIds[actual++], 5);

}

function playRound(trackId, seconds){
    spotifyApi.getTrack(trackId)
    .then(function(data){
        cancionActual = data.name;
        playforNSeconds(data.preview_url, seconds);

        var s = 10;
        timeout = setTimeout(function(){
            document.getElementById("AdivinarBtn").disabled = false;
            interval = setInterval(function () {
                if(s == 0) {
                    clearInterval(interval);
                    document.getElementById("TituloCancion").innerHTML = "Respuesta: " + data.name;
                    $("#Intento").hide();
                    $("#AdivinarBtn").hide();
                }
                $("#Tiempo").text("Tiempo restante: " + (s--) + " seg");
            }, 1000);
        }, seconds * 1000);
        
    });
}

function next(){
    document.getElementById("Intento").focus();
    document.getElementById("Ronda").innerHTML = ("Canción "  + parseInt(actual+1));
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById("TituloCancion").innerHTML = "";
    $("#Tiempo").text("");
    clearInterval(interval);
    clearTimeout(timeout);


    if(actual == numOfSongs){
        $("#Game").hide();
        $("#ScoreContainer").show();
        $("#ScoreContainer").text("PUNTAJE FINAL: " + points);
    } else{
        playRound(gameTracksIds[actual++], 5);
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
    $("#Intento").show();
    $("#AdivinarBtn").show();
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
    $("#Goss").hide();
    $("#MainTitle").show();
    $("#MainTitle2").hide();
    $("#CategoriesContainer").show();
    $("#PlaylistsContainer").hide();
    $("#PlaylistsContainer").html('');
    document.querySelector("#BackButton").addEventListener("click", goToSelectRegion);
}

function goToSelectRegion() {
    $("#Goss").show();
    $("#MainTitle").hide();
    $("#MainTitle2").hide();
    $("#BackButton").hide();
    $("#CountrySelection").show();
    $("#CategoriesContainer").hide();
    $("#CategoriesContainer").html('');
}

var adivinarBtn = document.getElementById("AdivinarBtn").addEventListener("click", adivinar);

function adivinar(){
    var inputText = document.getElementById("Intento").value;
    console.log("cancion: " + cancionActual);
    function trun(cancion_Actual){
        var i;
        var newCad = "";
        for(i = 0; i < cancion_Actual.length; i++){
            if(cancion_Actual[i] == "(" || cancion_Actual[i] == "-"){
                break;
            }
            newCad += cancion_Actual[i];
        }
        return newCad;
    }
    
    cancionActual = trun(cancionActual);

    if(similarity(inputText, cancionActual)*100 > 60.0){
        points++;
        
        document.getElementById("Puntos").innerHTML = "Puntos: " + points;
        next();
    }

    document.getElementById("Intento").value = "";
};


function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }


  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }


document.querySelector("#Intento").addEventListener('keyup',function(e){
    if (e.keyCode === 13) {
        adivinar();
    }
});

getTokenFromNode();