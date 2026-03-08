# Настройка чата ClickPay — пошаговая инструкция

Чат уже настроен в Supabase (таблицы, RLS, Realtime). Остаётся только добавить данные в Netlify.

---

## Шаг 1. Откройте Supabase

1. Зайдите на [supabase.com/dashboard](https://supabase.com/dashboard)
2. Выберите проект (в URL будет `zriniotzekhfzilxpelm` или похожее)
3. В левом меню нажмите **Project Settings** (иконка шестерёнки)
4. Выберите **API**

---

## Шаг 2. Скопируйте данные из Supabase

На странице API найдите и скопируйте:

| Что скопировать | Где находится |
|-----------------|--------------|
| **Project URL** | Поле "Project URL" — например `https://zriniotzekhfzilxpelm.supabase.co` |
| **anon public** | В блоке "Project API keys" — ключ с пометкой "anon" и "public" |

---

## Шаг 3. Добавьте переменные в Netlify

1. Зайдите на [app.netlify.com](https://app.netlify.com)
2. Выберите сайт ClickPay
3. В меню слева: **Site configuration** → **Environment variables**
4. Нажмите **Add a variable** → **Add a single variable**
5. Добавьте две переменные:

**Первая переменная:**
- Key: `VITE_SUPABASE_URL`
- Value: вставьте **Project URL** из Supabase (из шага 2)
- Нажмите **Create variable**

**Вторая переменная:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: вставьте **anon public** ключ из Supabase
- Нажмите **Create variable**

6. Нажмите **Save** (если есть)

---

## Шаг 4. Пересоберите сайт

1. В Netlify откройте вкладку **Deploys**
2. Нажмите **Trigger deploy** → **Deploy site**
3. Подождите 1–2 минуты, пока деплой завершится

---

## Шаг 5. Проверьте чат

1. Откройте ваш сайт (например `https://ваш-сайт.netlify.app`)
2. Нажмите на зелёную кнопку с планетой (чат) внизу справа
3. Введите имя и нажмите **Начать**
4. Напишите сообщение и нажмите **Отправить**

Если всё настроено верно:
- Сообщение появится в чате
- В Supabase (Table Editor → chat_messages) появится новая строка

---

## Шаг 6. Ответ сотрудника

1. Откройте ссылку **Для сотрудников** в футере сайта (или `/admin/chat`)
2. Введите пароль (тот, что добавлен в таблицу `admin_passwords`)
3. Выберите диалог с клиентом
4. Напишите ответ

Ответ появится у клиента в чате на сайте.

---

## Закрытие чатов (для менеджеров)

Менеджеры могут закрывать диалоги в личном кабинете. Перед этим нужно выполнить SQL в Supabase:

1. Откройте **SQL Editor** в Supabase
2. Скопируйте содержимое файла `supabase-close-chat.sql`
3. Выполните запрос

После этого в админке появится кнопка **Close chat** для каждого диалога.

---

## Если не работает

- Убедитесь, что переменные в Netlify названы **точно**: `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- После добавления переменных обязательно сделайте **Trigger deploy**
- Проверьте страницу диагностики: `https://ваш-сайт.netlify.app/admin/diagnostic`
