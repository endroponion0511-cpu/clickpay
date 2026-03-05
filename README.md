# ClickPay — конверсионный лендинг

React + TypeScript + Vite + Tailwind CSS

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте **http://localhost:5173/**

## Чат поддержки

Встроенный live-чат: пользователь вводит имя, пишет сообщения, вы отвечаете на сайте.

1. Создайте проект в [Supabase](https://supabase.com)
2. Скопируйте `.env.example` в `.env` и укажите `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. В Supabase SQL Editor выполните `supabase-chat-schema.sql` и `supabase-admin-passwords.sql`
4. Панель менеджеров: **http://localhost:5173/admin/chat** — вход по паролю из таблицы `admin_passwords`
5. Добавить менеджера: в админке нажмите «Add manager», введите свой пароль и новый пароль

## Деплой

См. [DEPLOY.md](./DEPLOY.md) — инструкции для Vercel, Netlify и GitHub Pages.
