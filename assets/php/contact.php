<?php

$array = array(
    "name" => "",
    "email" => "",
    "message" => "",
    "nameError" => "",
    "emailError" => "",
    "messageError" => "",
    "isSuccess" => false
);

$emailTo = "contact@johntaieb.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $array["name"] = test_input($_POST["name"]);
    $array["email"] = test_input($_POST["email"]);
    $array["message"] = test_input($_POST["message"]);
    $array["isSuccess"] = true;
    $emailText = "";

    // Vérification du nom
    if (empty($array["name"])) {
        $array["nameError"] = "Et oui je veux tout savoir. Même ton nom !";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Name: {$array['name']}\n";
    }

    // Vérification de l'email
    if (!isEmail($array["email"])) {
        $array["emailError"] = "T'essaies de me rouler ? C'est pas un email ça !";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Email: {$array['email']}\n";
    }

    // Vérification du message
    if (empty($array["message"])) {
        $array["messageError"] = "Qu'est-ce que tu veux me dire ?";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Message: {$array['message']}\n";
    }

    // Envoi de l'email si tout est bon
    if ($array["isSuccess"]) {
        $headers = "From: {$array['name']} <{$array['email']}>\r\nReply-To: {$array['email']}";
        mail($emailTo, "Un message de votre portfolio", $emailText, $headers);
    }

    // Réponse en JSON si le formulaire est envoyé par Ajax
    header('Content-Type: application/json');
    echo json_encode($array);
}

// Fonctions utilitaires
function isEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
function test_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}
?>
