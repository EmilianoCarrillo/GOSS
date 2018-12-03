<?php
$host_name = "db712538097.db.1and1.com";
$database = "db712538097";
$user_name = "dbo712538097";
$password = "ovejanegra123";

$connect = new mysqli($host_name,$user_name,$password,$database);
if (!$connect) {
    die('<p>Error al conectar con servidor MySQL: '.mysql_error().'</p>');
}
?>