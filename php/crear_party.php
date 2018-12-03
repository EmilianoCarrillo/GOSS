<?php
	include "conexion.php";
	$songs = $_POST['tracks'];
	$category=$_POST['playlist'];
	$sql="INSERT INTO party(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,category) VALUES(";
	$pos=0;
	foreach($songs as $valor){
		$sql=$sql."'".$valor."',";
	}
	$sql=$sql."'".$category."')";
	if(!($connect->query($sql)))
		echo "Error: " . $sql . "<br>" . $connect->error;
	else{
		$consulta2="SELECT * FROM party";
		$query=$connect->query($consulta2);
		if(!$query)
			echo "Error: " . $consulta2 . "<br>" . $connect->error;
		$pos=0;
		while($fila = $query->fetch_assoc()){
			if($fila['id'] > $pos)
				$pos=$fila['id'];
		}
		echo $pos;
	}
	$connect->close();
?>