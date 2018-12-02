function startGame(tracks){
    var gameTracks = getRandomTracks(tracks);

    $("#PlaylistsContainer").hide();

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
        gameTracks.push(tracks[randomNum].track);
        flags[randomNum] = 1;
    }

    return gameTracks;
}

