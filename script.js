    // Установка цвета фона приложения
    Telegram.WebApp.setBackgroundColor('#f0f0f0'); // Установка серого цвета фона

    // Переменные для отслеживания кликов
    var score = 0;
    var clickButton = document.getElementById('clickButton');
    // Переменные для отслеживания кликов и ID пользователя
    var scoreDisplay = document.getElementById('score');
    var userInfoElement = document.getElementById('userInfo');
    var userId = window.Telegram.WebApp.initDataUnsafe.user.id;

    // Функция для отправки запроса на сервер
    // Функция для загрузки количества кликов с сервера
    function loadClicks() {
        fetch('https://03a0-46-158-159-62.ngrok-free.app/get_clicks?telegram_id=' + userId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке кликов');
            }
            return response.json();
        })
        .then(data => {
            // Обновляем счетчик кликов на фронтенде
            scoreDisplay.textContent = data.clicks;
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    // Функция для отправки запроса на сервер при клике
    function sendClickRequest() {
        fetch('https://03a0-46-158-159-62.ngrok-free.app/update_clicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegram_id: window.Telegram.WebApp.initDataUnsafe.user.id })
            body: JSON.stringify({ telegram_id: userId })
        })
        .then(response => {
            if (!response.ok) {
@@ -24,23 +41,16 @@ document.addEventListener('DOMContentLoaded', function() {
            return response.json();
        })
        .then(data => {
            // Обновление счетчика кликов на фронтенде
            // Обновляем счетчик кликов на фронтенде
            scoreDisplay.textContent = data.clicks;
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    // Обработчик клика по кнопке
    clickButton.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = score;
        // Если количество кликов кратно 10, отправляем запрос на сервер
        if (score % 10 === 0) {
            sendClickRequest();
        }
    });
    // Загружаем количество кликов для текущего пользователя при загрузке страницы
    loadClicks();

    // Проверка наличия Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
@@ -64,8 +74,13 @@ document.addEventListener('DOMContentLoaded', function() {
        console.error('Telegram WebApp API не доступен');
    }

    // Обработчик клика по кнопке
    document.getElementById('clickButton').addEventListener('click', function() {
        sendClickRequest();
    });

    // Предотвращение увеличения масштаба при двойном тапе
    clickButton.addEventListener('touchmove', function(event) {
    document.getElementById('clickButton').addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }