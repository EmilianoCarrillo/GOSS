<?php
	include "conexion.php";
	$songs = $_POST['tracks'];
	$sql="INSERT INTO party(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10) VALUES(";
	$pos=0;
	foreach($songs as $valor){
		if($pos<9)
			$sql=$sql."'".$valor."',";
		else
			$sql=$sql."'".$valor."')";
		$pos++;
	}
	if($connect->query($sql))
		echo "Insercion bien";
	else
		echo "Error: " . $sql . "<br>" . $connect->error;
	$connect->close();
?>