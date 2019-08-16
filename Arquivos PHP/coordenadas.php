<?php

if ($_SERVER['REQUEST_METHOD'] =='POST'){

    $login = $_POST['login'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $hora = $_POST['hora'];

    require_once 'connect.php';

    $sql = "INSERT INTO coordenadas (login, latitude, longitude, hour) VALUES ('$login', '$latitude', '$longitude', '$hora')";

    if ( mysqli_query($conn, $sql) ) {
        $result["success"] = "1";
        $result["message"] = "success";

        echo json_encode($result);
        mysqli_close($conn);

    } else {

        $result["success"] = "0";
        $result["message"] = "error";

        echo json_encode($result);
        mysqli_close($conn);
    }
}

?>