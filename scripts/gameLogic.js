var spotifyApi = new SpotifyWebApi();
var audioPlayer = document.getElementById("AudioPlayer");
var playlistId;
var trackIds;
var playlistName;
var playlistImage;
var adivino = false;

$("#Game").hide();

document.querySelector("#WelcomeScreen button").disabled = true;


var buttonEnter = document.querySelector("#WelcomeScreen button");
var inputUsername = document.querySelector("#WelcomeScreen input");
$('#WelcomeScreen input').on('input',function(e){
    if(inputUsername.value != ""){
        buttonEnter.disabled = false;
    } else{
        buttonEnter.disabled = true;
    }
});



$.ajax({
    url: "https://music-guessing-game.herokuapp.com/",
    type: 'GET',
    success: function (res) {
        setToken(res.token);
        getGameData();
    }
});


function setToken(tokenFromNode){
    // Set authorization token to get access to the API 
    spotifyApi.setAccessToken(tokenFromNode);
}

function getGameData(){
    function findGetParameter(parameterName) {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
              tmp = item.split("=");
              if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }
    
    var idCurrentGame = findGetParameter("id");
    
    var parametros = {
        id: idCurrentGame
    };

    $.ajax({
        data: parametros,
        url: "php/consulta_canciones.php",
        type: "post",
        beforeSend: function(){
            console.log("Cargando canciones...");
        },
        success: function(data){
            trackIds = data.split(",");
            playlistId = trackIds.pop();
            spotifyApi.getPlaylist(playlistId)
            .then(function(playlistFromApi){
                playlistName = playlistFromApi.name;
                playlistImage = playlistFromApi.images[0].url;
                startGame(trackIds, playlistName, playlistImage);
            });
        },
        error: function(request, status, error){
            console.log("Status: " + status + " Error:" + error);
        }
    });
}

function startGame(trackIds, name, image){
    $("#WelcomeScreen h3").text(name);
    $("#WelcomeScreen img").attr("src",image);

    buttonEnter.addEventListener("click", function() {
        
        $("#WelcomeScreen").hide();
        $("#Game").show();

        var username = inputUsername.value;
        var ronda = 1;
        var puntos = 0;

        //empezarRonda(1, 100, 3);
        for(var i = 0; i<=0; i++){
            jugarCancion(ronda, puntos);
            //mostrarCancion(ronda);
        }

    });
}

var source;

function empezarRonda(nRonda, puntos, nSecs){
    var botonAdivinar = document.getElementById("AdivinarBtn");
    botonAdivinar.disabled = true;
    $("#Ronda").text("Canción " + nRonda);
    $("#Puntos").text("Puntos: " + puntos);
    
    spotifyApi.getTrack(trackIds[nRonda-1])
    .then(function(data){
        var s = 10;
        source = data.preview_url;
        playforNSeconds(source, nSecs);
        setTimeout(function(){
            botonAdivinar.disabled = false;
            var interval = setInterval(function () {
                if(s == 0) {
                    clearInterval(interval);
                }
                $("#Tiempo").text(s--);
            }, 1000);
        }, nSecs * 1000);
        document.getElementById("AdivinarBtn").disabled = true;
    });
}

var artistas;
var nombreCancion;

function jugarCancion(ronda, puntos){
    adivino = false;

    document.getElementById("AdivinarBtn").addEventListener("click", function(){
        var guess = document.getElementById("Intento").value;
    
        spotifyApi.getTrack(trackIds[ronda-1])
        .then(function(data){
            nombreCancion = data.name;
            artistas = data.artists;

            artistas.forEach(artista => {
                if(artista.name.toUpperCase() == guess.toUpperCase()){
                    adivino = true;
                    puntos++;
                    return;
                }
                console.log(adivino);
            });

            if(adivino){
                return;
            }
        });
        if(adivino){
            return;
        }
    });

    if(adivino){
        return;
    }

    empezarRonda(ronda,puntos,3)
        
    // empezarRonda(ronda,puntos,3);
    // empezarRonda(ronda,puntos,4);
    // empezarRonda(ronda,puntos,5);

}

function mostrarCancion(ronda){
    $("#Titulo").text(nombreCancion);
    playforNSeconds(source, 15);
}


function playforNSeconds(source, seconds) {
    audioPlayer.src = source;
    audioPlayer.play();
    setTimeout(function () {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }, seconds * 1000);
}