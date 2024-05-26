document.addEventListener('DOMContentLoaded', function() {
    // Установка цвета фона приложения
    Telegram.WebApp.setBackgroundColor('#f0f0f0'); // Установка серого цвета фона

    // Переменные для отслеживания кликов и ID пользователя
    var scoreDisplay = document.getElementById('score');
    var userInfoElement = document.getElementById('userInfo');
    var userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    var currentScore = 0;
    var shrimpCount = 0;
    var click_ratio = 1;

    // Функция для увеличения количества кликов
    function click_calc() {
        currentScore = currentScore + (1 * click_ratio);
        document.getElementById('score').innerText = currentScore; // Исправлено на innerText
    }
    
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

    // Обработчик клика по кнопке
    document.getElementById('clickButton').addEventListener('click', function() {
        click_calc();
    });

    document.getElementById('shrimpButton').addEventListener('click', function() {
        buyShrimp();
    });

    // Предотвращение увеличения масштаба при двойном тапе
    document.getElementById('clickButton').addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
});
