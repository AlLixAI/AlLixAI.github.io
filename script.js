document.addEventListener('DOMContentLoaded', function() {
  // Проверка наличия Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;

    // Проверка наличия данных пользователя
    if (initDataUnsafe && initDataUnsafe.user) {
      const user = initDataUnsafe.user;
      const userInfoElement = document.getElementById('userInfo');

      // Формирование строки с именем и фамилией пользователя
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

      // Обновление информации о пользователе
      userInfoElement.textContent = `Пользователь: ${fullName}`;
    } else {
      document.getElementById('userInfo').textContent = 'Данные пользователя недоступны';
      console.log('Данные пользователя недоступны');
    }
  } else {
    console.error('Telegram WebApp API не доступен');
  }

  // Ваш текущий код для обработки кликов
  var score = 0;
  var clickButton = document.getElementById('clickButton');
  var scoreDisplay = document.getElementById('score');

  clickButton.addEventListener('click', function() {
    score++;
    scoreDisplay.textContent = score;
  });
});
