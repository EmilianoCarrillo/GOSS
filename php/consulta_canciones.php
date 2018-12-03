<?php
	include "conexion.php";
	$id_=$_POST['id'];
	$sql="SELECT * FROM party WHERE id=".$id_;
	$query=$connect->query($sql);
	$result="";
	if(!$query)
		echo "Error: " . $sql . "<br>" . $connect->error;
	$fila = $query->fetch_assoc();
	$result.=$fila['c1'];
	$result.=",";
	$result.=$fila['c2'];
	$result.=",";
	$result.=$fila['c3'];
	$result.=",";
	$result.=$fila['c4'];
	$result.=",";
	$result.=$fila['c5'];
	$result.=",";
	$result.=$fila['c6'];
	$result.=",";
	$result.=$fila['c7'];
	$result.=",";
	$result.=$fila['c8'];
	$result.=",";
	$result.=$fila['c9'];
	$result.=",";
	$result.=$fila['c10'];
	$result.=",";
	$result.=$fila['category'];
	echo $result;
	$connect->close();
?>