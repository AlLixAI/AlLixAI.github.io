document.addEventListener('DOMContentLoaded', function() {
    // Установка цвета фона приложения
    Telegram.WebApp.setBackgroundColor('#f0f0f0'); // Установка серого цвета фона

    // Переменные для отслеживания кликов и ID пользователя
    var scoreDisplay = document.getElementById('score');
    var userInfoElement = document.getElementById('userInfo');
    var userId = window.Telegram.WebApp.initDataUnsafe.user.id;

    // Функция для загрузки количества кликов с сервера
	function loadClicks() {
		fetch('https://03a0-46-158-159-62.ngrok-free.app/get_clicks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ telegram_id: userId })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при загрузке кликов');
			}
			return response.json();
		})
		.then(data => {
			scoreDisplay.textContent = data.clicks;
		})
		.catch(error => {
			console.error('Ошибка при загрузке кликов:', error.message);
		});
	}


    // Функция для отправки запроса на сервер при клике
    function sendClickRequest() {
        fetch('https://03a0-46-158-159-62.ngrok-free.app/update_clicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegram_id: userId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при отправке запроса');
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
	
	function sendActivityStatus(status) {
			fetch('https://03a0-46-158-159-62.ngrok-free.app/update_activity', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ telegram_id: userId, status: status })
			})
			.then(response => {
				if (!response.ok) {
					throw new Error('Ошибка при отправке статуса активности');
				}
				return response.json();
			})
			.then(data => {
				console.log(`Статус активности: ${status}`);
			})
			.catch(error => {
				console.error('Ошибка при отправке статуса активности:', error.message);
			});
		}
	
	function update_user_clicks() {
		fetch('https://03a0-46-158-159-62.ngrok-free.app/get_user_data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ telegram_id: userId })
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Ошибка при обновлении кликов пользователя');
				}
				return response.json();
			})
			.then(data => {
				// Обновляем счетчик кликов на фронтенде
				loadClicks();
			})
			.catch(error => {
				console.error('Ошибка при обновлении кликов пользователя:', error.message);
			});
	}
	
	function buyShrimp() {
		// Отправка запроса на покупку креветок
		fetch('https://03a0-46-158-159-62.ngrok-free.app/buy_shrimp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ telegram_id: userId })
		})
		.then(response => {
			if (!response.ok) {
				// Если покупка не удалась, делаем кнопку красной
				document.getElementById('shrimpButton').style.backgroundColor = '#dc3545';
				// Через 1 секунду возвращаем кнопку к зеленому цвету
				setTimeout(() => {
					document.getElementById('shrimpButton').style.backgroundColor = '#28a745';
				}, 1000);
				throw new Error('Ошибка при покупке креветок');
			}
			return response.json();
		})
		.then(data => {
			// Если покупка прошла успешно, обновляем количество креветок и очков
			console.log('Куплено креветок:', data.amount);
			document.getElementById('score').textContent = data.clicks;
			document.getElementById('shrimpCount').textContent = data.c_shrimp;
		})
		.catch(error => {
			console.error('Ошибка при покупке креветок:', error.message);
		});
	}

	function loadShrimpCount() {
		fetch('https://03a0-46-158-159-62.ngrok-free.app/update_shrimp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ telegram_id: userId })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при загрузке количества креветок');
			}
			return response.json();
		})
		.then(data => {
			// Обновляем количество креветок на фронтенде
			document.getElementById('shrimpCount').textContent = data.c_shrimp;
		})
		.catch(error => {
			console.error('Ошибка при загрузке количества креветок:', error.message);
		});
	}


    setInterval(() => {
		loadClicks();
        sendActivityStatus('online');
    }, 5000);

    // потом открыть мб window.addEventListener('blur', () => sendActivityStatus('offline'));
	
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

        // Загружаем количество кликов для текущего пользователя при загрузке страницы
		update_user_clicks()
        loadClicks();
		loadShrimpCount();

        // Сообщаем Telegram, что мини-приложение готово
        window.Telegram.WebApp.ready();
    } else {
        console.error('Telegram WebApp API не доступен');
    }

    // Обработчик клика по кнопке
    document.getElementById('clickButton').addEventListener('click', function() {
        sendClickRequest();
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
