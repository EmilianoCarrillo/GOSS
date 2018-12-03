var spotifyApi = new SpotifyWebApi();

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
            console.log(data);
            var trackIds = data.split(",");
            var playlistId = trackIds.pop();
            spotifyApi.getPlaylist(playlistId)
            .then(function(playlistFromApi){
                var playlistName = playlistFromApi.name;
                var playlistImage = playlistFromApi.images[0].url;
                startGame(trackIds, playlistName, playlistImage);
            });
        },
        error: function(request, status, error){
            console.log("Status: " + status + " Error:" + error);
        }
    });
}


function startGame(trackIds, name, image){
    console.log(trackIds, name, image);
    $("#WelcomeScreen h1").text(name);
    $("#WelcomeScreen img").attr("src",image);
}



