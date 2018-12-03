
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
        trackIds = data.split(",");
    },
    error: function(request, status, error){
        console.log("Status: " + status + " Error:" + error);
    }
});




