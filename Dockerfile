# Используем официальный Node.js образ
FROM node:18

# Задаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm i --only=production

# Копируем исходный код
COPY . .

# Строим приложение
RUN npm run build

# Указываем порт, который будет прослушивать приложение
ENV PORT=8080
EXPOSE 8080

# Запускаем приложение
CMD ["npm", "start"]