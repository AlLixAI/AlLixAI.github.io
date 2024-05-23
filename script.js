document.addEventListener('DOMContentLoaded', function() {
  // Проверка наличия Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    console.log('Telegram WebApp API доступен');

    const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    console.log('initDataUnsafe:', initDataUnsafe);

    // Проверка наличия данных пользователя
    if (initDataUnsafe && initDataUnsafe.user) {
      const user = initDataUnsafe.user;
      console.log('User:', user);

      const userInfoElement = document.getElementById('userInfo');

      // Формирование строки с именем и фамилией пользователя
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

      // Обновление информации о пользователе
      userInfoElement.textContent = `Пользователь: ${fullName}`;
    } else {
      document.getElementById('userInfo').textContent = 'Данные пользователя недоступны';
      console.log('Данные пользователя недоступны');
    }

    // Сообщаем Telegram, что мини-приложение готово
    window.Telegram.WebApp.ready();
  } else {
    console.error('Telegram WebApp API не доступен');

    // Эмуляция данных для локального тестирования
    const userInfoElement = document.getElementById('userInfo');
    const simulatedUser = {
      first_name: 'Тест',
      last_name: 'Пользователь'
    };

    const fullName = [simulatedUser.first_name, simulatedUser.last_name].filter(Boolean).join(' ');
    userInfoElement.textContent = `Пользователь: ${fullName}`;
  }

  // Ваш текущий код для обработки кликов
  var score = 0;
  var clickButton = document.getElementById('clickButton');
  var scoreDisplay = document.getElementById('score');

  clickButton.addEventListener('click', function() {
    score++;
    scoreDisplay.textContent = score;
  });

  // Предотвращение увеличения масштаба при двойном тапе
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

  var lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
});
