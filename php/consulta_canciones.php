<?php
	include "conexion.php";
	$id_=$_POST['id'];
	$sql="SELECT * FROM party WHERE id=".$id_;
	$query=$connect->query($sql);
	$result="";
	if(!$query)
		echo "Error: " . $sql . "<br>" . $connect->error;
	$fila = $query->fetch_assoc();
	$pos=0;
	foreach($fila as $valor){
		$result=$result.$valor;
		if($pos<=9)
			$result=$result.",";
		$pos++;
	}
	echo $result;
	$connect->close();
?>