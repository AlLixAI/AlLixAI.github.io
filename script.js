document.addEventListener('DOMContentLoaded', function() {
    // Установка цвета фона приложения
    Telegram.WebApp.setBackgroundColor('#f0f0f0'); // Установка серого цвета фона

    // Переменные для отслеживания кликов и ID пользователя
    var scoreDisplay = document.getElementById('score');
    var userInfoElement = document.getElementById('userInfo');
    var userId = 123456789; // Замените на актуальный ID пользователя

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

    // Загружаем количество кликов для текущего пользователя при загрузке страницы
    loadClicks();

    // Проверка наличия Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram WebApp API доступен');

        // Проверка наличия данных пользователя
        if (window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            // Формирование строки с именем и фамилией пользователя
            const fullName = (user.first_name || '') + ' ' + (user.last_name || '');
            // Обновление информации о пользователе
            userInfoElement.textContent = `Пользователь: ${fullName.trim()}`;
        } else {
            userInfoElement.textContent = 'Данные пользователя недоступны';
            console.error('Данные пользователя недоступны');
        }

        // Сообщаем Telegram, что мини-приложение готово
        window.Telegram.WebApp.ready();
    } else {
        console.error('Telegram WebApp API не доступен');
    }
});
