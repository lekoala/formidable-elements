<?php

$totalSteps = 10;

$currentStep = $_POST['progress_step'] ?? 0;

sleep(random_int(1, 2));
$nextStep = $currentStep + 1;

$response = [
    'message' => 'Progress ' . $currentStep,
    'message_options' => [
        "variant" => "info"
    ],
    'label' => 'Done!',
    'progress_step' => $nextStep,
];

// Show an indeterminate and a progress reponse
$csrf = $_POST['_csrf'] ?? null;
if ($csrf) {
    if ($currentStep > $totalSteps) {
        $response['finished'] = true;
    }
} else {
    $response['progress_total'] = $totalSteps;
}

http_response_code(200);
echo json_encode($response);
