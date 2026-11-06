# gogoweru: сайт

Статический сайт (HTML, CSS, JS, картинки). Сборка не нужна.

## Публикация через GitHub Pages
1. Создайте репозиторий на github.com (например, `gogoweru`), публичный.
2. Загрузите содержимое этой папки в корень репозитория:
   Add file → Upload files → перетащите index.html, styles.css, script.js, папку assets и файл .nojekyll → Commit changes.
3. Откройте Settings → Pages.
4. В разделе Build and deployment выберите Source: Deploy from a branch, Branch: main, папка: / (root), нажмите Save.
5. Через 1–2 минуты сайт будет по адресу https://<ваш-логин>.github.io/<имя-репозитория>/

## Изменения через командную строку
git init
git add .
git commit -m "Сайт gogoweru"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/<имя-репозитория>.git
git push -u origin main

Если репозиторий называется <ваш-логин>.github.io, сайт откроется по адресу https://<ваш-логин>.github.io/
