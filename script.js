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
    
	function update_clicks_on_server(clicks) {
        fetch('https://217d-46-158-159-62.ngrok-free.app/update_clicks_on_server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegram_id: userId,
                clicks: currentScore
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Успешно отправлено:', data);
        })
        .catch((error) => {
            console.error('Ошибка при отправке:', error);
        });
    }

	function calculateShrimpPrice(shrimpCount) {
		// Рассчитываем цену в зависимости от количества креветок
		{
			return Math.round(100 * Math.pow(2.72, shrimpCount)); // Примерная логика, нужно заменить на вашу
		}
	}

	function calculateShrimpIncome() {
        currentScore += shrimpCount * 5;
        document.getElementById('score').innerText = currentScore;
    }

	function buyShrimp() {
		update_clicks_on_server();
	
		fetch('https://217d-46-158-159-62.ngrok-free.app/buy_shrimp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				telegram_id: userId
			})
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(err => { throw new Error(err.error); });
			}
			return response.json();
		})
		.then(data => {
			// Получаем актуальное количество кликов и креветок из ответа сервера
			currentScore = data.clicks;
			shrimpCount = data.c_shrimp;
	
			console.log('Успешно куплено. Количество кликов:', currentScore, 'Количество креветок:', shrimpCount);
			
			document.getElementById('score').innerText = currentScore;
			document.getElementById('shrimpCount').innerText = shrimpCount;
			document.getElementById('shrimpPrice').innerText = calculateShrimpPrice(shrimpCount);

			showBubbles(); // для красоты
		})
		.catch((error) => {
			console.error('Ошибка при покупке:', error);
			alert('Ошибка при покупке: ' + error.message);
		});
	}
	
	function showBubbles() {
		const bubbleContainer = document.createElement('div');
		bubbleContainer.style.position = 'absolute';
		bubbleContainer.style.width = '100%';
		bubbleContainer.style.height = '100%';
		bubbleContainer.style.top = 0;
		bubbleContainer.style.left = 0;
		bubbleContainer.style.pointerEvents = 'none';
		document.body.appendChild(bubbleContainer);
	
		for (let i = 0; i < 10; i++) {
			const bubble = document.createElement('div');
			bubble.className = 'bubble';
			bubble.style.left = Math.random() * 100 + 'vw';
			bubble.style.bottom = 0;
			bubbleContainer.appendChild(bubble);
	
			// Удаление пузырька после завершения анимации
			bubble.addEventListener('animationend', () => {
				bubble.remove();
			});
		}
	
		// Удаление контейнера с пузырьками после завершения всех анимаций
		setTimeout(() => {
			bubbleContainer.remove();
		}, 2000);
	}

	function updateInterface(data) {
		// Обновляем элементы интерфейса на основе полученных данных
		currentScore = data.clicks
		shrimpCount = data.c_shrimp
		document.getElementById('score').innerText = data.clicks;
		document.getElementById('shrimpCount').innerText = data.c_shrimp;
		document.getElementById('shrimpPrice').innerText = calculateShrimpPrice(data.c_shrimp);
		// Другие обновления интерфейса...
	}

    function get_all_data() {
        fetch('https://217d-46-158-159-62.ngrok-free.app/get_all_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegram_id: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            // Обработка полученных данных
            console.log('Полученные данные:', data);
            // Обновление интерфейса на основе полученных данных
            updateInterface(data);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
    }

	setInterval(calculateShrimpIncome, 1000);

	setInterval(update_clicks_on_server, 5000);

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
		get_all_data();
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