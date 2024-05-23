document.addEventListener('DOMContentLoaded', function() {
  // Установка цвета фона приложения
  Telegram.WebApp.setBackgroundColor('#f0f0f0'); // Установка серого цвета фона

  // Переменные для отслеживания кликов
  var score = 0;
  var clickButton = document.getElementById('clickButton');
  var scoreDisplay = document.getElementById('score');
  var userInfoElement = document.getElementById('userInfo');

  // Функция для отправки запроса на сервер
  function sendClickRequest() {
    fetch('http://192.168.0.13:5000/update_clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ telegram_id: window.Telegram.WebApp.initDataUnsafe.user.id })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при отправке запроса');
      }
      return response.json();
    })
    .then(data => {
      // Обновление счетчика кликов на фронтенде
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

  // Проверка наличия Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    console.log('Telegram WebApp API доступен');

    // Проверка наличия данных пользователя
    if (window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      // Формирование строки с именем и фамилией пользователя
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
      // Обновление информации о пользователе
      userInfoElement.textContent = `Пользователь: ${fullName}`;
    } else {
      userInfoElement.textContent = 'Данные пользователя недоступны';
      console.error('Данные пользователя недоступны');
    }

    // Сообщаем Telegram, что мини-приложение готово
    window.Telegram.WebApp.ready();
  } else {
    console.error('Telegram WebApp API не доступен');
  }

  // Предотвращение увеличения масштаба при двойном тапе
  clickButton.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

});
