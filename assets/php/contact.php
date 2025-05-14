<?php
header('Content-Type: application/json');

$response = [
    "name" => "",
    "email" => "",
    "message" => "",
    "nameError" => "",
    "emailError" => "",
    "messageError" => "",
    "isSuccess" => false
];

$emailTo = "baptisterenaud81@gmail.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $response["name"] = test_input($_POST["name"] ?? "");
    $response["email"] = test_input($_POST["email"] ?? "");
    $response["message"] = test_input($_POST["message"] ?? "");
    $response["isSuccess"] = true;
    $emailText = "";

    if (empty($response["name"])) {
        $response["nameError"] = "Merci d'indiquer votre nom.";
        $response["isSuccess"] = false;
    } else {
        $emailText .= "Nom: {$response['name']}\n";
    }

    if (!filter_var($response["email"], FILTER_VALIDATE_EMAIL)) {
        $response["emailError"] = "Adresse email invalide.";
        $response["isSuccess"] = false;
    } else {
        $emailText .= "Email: {$response['email']}\n";
    }

    if (empty($response["message"])) {
        $response["messageError"] = "Merci d'écrire un message.";
        $response["isSuccess"] = false;
    } else {
        $emailText .= "Message:\n{$response['message']}\n";
    }

    if ($response["isSuccess"]) {
        $headers = "From: {$response['name']} <{$response['email']}>\r\nReply-To: {$response['email']}";
        mail($emailTo, "Nouveau message depuis le formulaire de contact de votre Portfolio", $emailText, $headers);
    }

    echo json_encode($response);
}

function test_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}
?>
