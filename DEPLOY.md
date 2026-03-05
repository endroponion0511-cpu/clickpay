# Развёртывание ClickPay

## Локальная разработка

```bash
npm install
npm run dev
```

Сайт откроется на **http://localhost:5173/**

---

## Деплой на хостинг

### Вариант 1: Vercel (рекомендуется)

1. Установите Vercel CLI: `npm i -g vercel`
2. Войдите: `vercel login`
3. Деплой: `npm run deploy:vercel` или `npx vercel --prod`

### Вариант 2: Netlify Drop (без CLI)

1. Соберите проект: `npm run build`
2. Откройте https://app.netlify.com/drop
3. Перетащите папку **dist** в область загрузки
4. Получите ссылку вида `*.netlify.app`

### Вариант 3: Netlify CLI

1. Установите: `npm i -g netlify-cli`
2. Войдите: `netlify login`
3. Деплой: `npm run deploy:netlify`

### Вариант 4: GitHub Pages

1. Добавьте в `vite.config.ts`:
   ```ts
   base: '/имя-репозитория/'
   ```
2. Настройте GitHub Actions или загрузите содержимое `dist/` в ветку `gh-pages`

---

## Предпросмотр production-сборки

```bash
npm run build
npm run preview
```
