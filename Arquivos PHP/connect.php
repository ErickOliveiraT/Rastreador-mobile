<?php

// $conn = new mysqli("http://projeto-rastreador.000webhostapp.com", "user-rastreador", "bd-rastreador-admin", "rastreador");

$conn = mysqli_connect("https://rastreador-com241.000webhostapp.com", "id11033304_user", "bd-rastreador-admin", "id11033304_rastreador");
if (!$conn) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;

?>