from flask import Flask, request, jsonify
import psycopg2
from OpenSSL import SSL

app = Flask(__name__)

# Подключение к базе данных PostgreSQL
conn = psycopg2.connect(
    dbname="1234",
    user="postgres",
    password="1234!",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

@app.route('/update_clicks', methods=['POST'])
def update_clicks():
    data = request.json
    telegram_id = data.get('telegram_id')

    # Проверяем, существует ли пользователь с таким Telegram ID
    cur.execute('SELECT * FROM telegramusers WHERE telegram_id = %s', (telegram_id,))
    existing_user = cur.fetchone()

    if not existing_user:
        # Если запись не найдена, создаем новую запись
        cur.execute('INSERT INTO telegramusers (telegram_id, clicks) VALUES (%s, %s)', (telegram_id, 0))
        conn.commit()
    else:
        # Обновляем количество кликов пользователя
        cur.execute('UPDATE telegramusers SET clicks = clicks + 1 WHERE telegram_id = %s', (telegram_id,))
        conn.commit()

    # Получаем текущее количество кликов пользователя
    cur.execute('SELECT clicks FROM telegramusers WHERE telegram_id = %s', (telegram_id,))
    clicks = cur.fetchone()[0]

    return jsonify({'clicks': clicks}), 200

if __name__ == '__main__':
    app.run(host='192.168.0.13', port=5000)
