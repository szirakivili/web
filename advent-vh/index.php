<?php
$today = date("j");
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adventi Naptár</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Váchartyáni Adventi Naptár</h1>
    <div class="calendar" id="calendar">
        <?php for ($i = 1; $i <= 24; $i++): ?>
            <div 
                class="day-card <?php echo $i > $today ? 'locked' : ''; ?>" 
                data-day="<?php echo $i; ?>">
                <?php echo $i; ?>
            </div>
        <?php endfor; ?>
    </div>

    <div class="modal" id="modal">
        <div class="modal-content">
            <button class="close-button" id="closeButton">&times;</button>
            <img id="modalImage" src="" alt="Adventi napi kép">
            <p id="modalText"></p>
            <a id="fbButton" class="fb-button" href="#" target="_blank">FB poszt</a>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
