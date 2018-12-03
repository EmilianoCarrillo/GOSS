function startGame(tracks){
    var gameTracksIds = getRandomTracks(tracks);

    console.log(gameTracksIds);

    $("#PlaylistsContainer").hide();

    var parametros = {
        tracks: gameTracksIds
    };
    $.ajax({
        data: parametros,
        url: "php/crear_party.php",
        type: "post",
        beforeSend: function(){
            console.log("Cargando...");
        },
        success: function(data){
            console.log(data);
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

