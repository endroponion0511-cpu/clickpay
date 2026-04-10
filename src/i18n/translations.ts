export const translations = {
  ru: {
    // Header
    nav: {
      services: 'Услуги',
      directions: 'Направления',
      howItWorks: 'Как это работает',
      faq: 'FAQ',
      adminChat: 'Личный кабинет',
      logoHome: 'ClickPay — наверх страницы',
    },
    cta: 'Оставить заявку',

    // Hero
    hero: {
      badges: ['SWIFT переводы', 'Обмен валют', 'Крипто ↔ Фиат', '24/7 Поддержка'],
      title: 'Денежные переводы по всему миру с',
      lead: 'Финансовые перестановки быстро и безопасно.',
      subtitle:
        'Быстрые переводы в 50+ стран. Персональная поддержка 24/7. Чтобы рассчитать перевод или задать вопрос. Жмите на кнопку ниже.',
      calculateBtn: 'Рассчитать перевод',
      status: 'Статус:',
      processedToday: 'Обработано сегодня',
      avgRate: 'Средний курс',
      ratesError: 'Не удалось загрузить курсы',
      loading: 'загрузка…',
      calculateModal: {
        title: 'Заявка на расчёт перевода',
        lead:
          'Заполните форму ниже — менеджер свяжется с вами, а копия заявки уйдёт в Telegram, чтобы ничего не потерять.',
        telegramNote:
          'В поле контакта укажите @username в Telegram или номер, привязанный к Telegram.',
        close: 'Закрыть',
      },
    },

    // Trust
    trust: {
      title: 'Почему выбирают',
      subtitle: 'Мы обеспечиваем надежность и скорость каждого перевода благодаря передовым технологиям и глобальной сети партнеров.',
      metrics: {
        transfers: 'Успешных переводов',
        countries: 'Стран назначения',
        success: 'Успешных транзакций',
        avgTime: 'Среднее время (мин)',
      },
    },

    // Services
    services: {
      title: 'Наши услуги',
      subtitle: 'Комплексные финансовые решения для частных лиц и бизнеса',
      items: [
        { title: 'SWIFT переводы', desc: 'Трансграничные банковские переводы в 50+ стран с фиксированным курсом', action: 'Рассчитать' },
        { title: 'Обмен валют', desc: 'RUB ↔ THB, USD, EUR и другие пары по выгодному курсу', action: 'Обменять' },
        { title: 'Крипто ↔ Фиат', desc: 'Обмен криптовалют на фиатные деньги и обратно. USDT, BTC, ETH.', action: 'Начать' },
        { title: 'Консультация', desc: 'Персональный менеджер поможет выбрать оптимальный маршрут перевода', action: 'Написать' },
      ],
      submit: 'Оставить заявку',
    },

    // Directions
    directions: {
      title: 'Направления переводов',
      subtitle: 'Мы работаем с банками и платежными системами по всему миру, обеспечивая лучшие маршруты для ваших средств.',
      clarify: 'Уточнить направление',
      mapLoadError: 'Не удалось загрузить карту. Обновите страницу или попробуйте позже.',
      mapHint:
        'Популярные направления — в плавающем блоке. Нажмите на страну на карте — кратко подскажем, как связаться с менеджером по этому направлению.',
      floatingTitle: 'Актуальные направления',
      floatingDestinations: [
        'Таиланд — THB, 1–2 дня',
        'ОАЭ — AED, SWIFT',
        'Германия — EUR, надёжно',
        'США — USD, крупные суммы',
        'Великобритания — GBP',
        'Сингапур — SGD',
        'Турция — TRY',
        'Казахстан — KZT',
        'Вьетнам — VND',
        'Индонезия — IDR',
        'Канада — CAD',
        'Польша — PLN',
        'Испания — EUR',
        'Франция — EUR',
        'Швейцария — CHF',
      ],
      countryModalTitle: 'Направление: {country}',
      countryModalBody:
        'Свяжитесь с менеджером ClickPay — подберём маршрут, курс и сроки под этот коридор.',
      countryModalCorridorsHint: 'Нажмите на строку — откроются действия. Ещё раз или крестик — свернуть.',
      countryModalRowNote: 'Оставьте заявку — укажем условия по выбранному направлению.',
      countryModalClose: 'Понятно',
      countryModalCta: 'Оставить заявку',
    },

    // How it works
    howItWorks: {
      title: 'Как это работает',
      subtitle: 'Простой и прозрачный процесс перевода средств',
      steps: [
        { title: 'Заявка', desc: 'Оставьте заявку на сайте или в мессенджере' },
        { title: 'Расчёт', desc: 'Получите точный расчёт с фиксированным курсом' },
        { title: 'Оплата', desc: 'Переведите средства удобным способом' },
        { title: 'Обработка', desc: 'Мы обрабатываем перевод в кратчайшие сроки' },
        { title: 'Получение', desc: 'Получатель получает средства на счёт' },
      ],
    },

    // Security
    security: {
      badge: 'Безопасность',
      title: 'Ваша безопасность —',
      titleHighlight: 'наш приоритет',
      desc: 'Мы используем передовые технологии шифрования и следуем строгим международным стандартам безопасности, чтобы гарантировать сохранность ваших средств и данных.',
      features: [
        'Шифрование данных по стандарту AES-256',
        'Верификация каждой транзакции',
        'Соответствие международным стандартам AML/KYC',
        'Защита персональных данных по GDPR',
        'Двухфакторная аутентификация',
      ],
      guarantee: '100% Гарантия',
      guaranteeDesc: 'Все операции защищены и застрахованы. Мы несем полную финансовую ответственность за сохранность средств во время перевода.',
    },

    // FAQ
    faq: {
      title: 'Частые вопросы',
      subtitle: 'Ответы на популярные вопросы о работе сервиса',
      items: [
        { q: 'Какие документы нужны для перевода?', a: 'Для большинства переводов достаточно паспорта и реквизитов получателя. Для сумм свыше $10,000 может потребоваться подтверждение источника средств.' },
        { q: 'Сколько времени занимает перевод?', a: 'SWIFT переводы обрабатываются за 1-3 рабочих дня в зависимости от направления. Криптовалютные операции — от 15 минут до 1 часа.' },
        {
          q: 'Какая комиссия за перевод?',
          a: 'Комиссия сервиса составляет 1% от суммы перевода. Точный расчёт вы получите от менеджера до подтверждения операции.',
        },
        { q: 'Можно ли отменить перевод?', a: 'До момента обработки перевод можно отменить. После отправки средств отмена возможна только через процедуру возврата (recall) через банк-получатель, что может занять время.' },
        { q: 'Работаете ли вы с юридическими лицами?', a: 'Да, мы работаем как с физическими, так и с юридическими лицами. Для бизнес-клиентов доступны специальные условия, инвойсы и закрывающие документы.' },
      ],
    },

    // CTA
    ctaSection: {
      title: 'Начните перевод',
      titleHighlight: 'прямо сейчас',
      subtitle: 'Заполните форму, и наш менеджер свяжется с вами в течение 5 минут для уточнения деталей и фиксации курса.',
      namePlaceholder: 'Ваше имя',
      contactPlaceholder: 'Телефон или Telegram',
      messagePlaceholder: 'Сумма и направление перевода (например: 100,000 RUB в THB)',
      submit: 'Отправить заявку',
      submitting: 'Отправка…',
      success: 'Заявка отправлена! Менеджер свяжется с вами в ближайшее время.',
      error: 'Ошибка отправки. Попробуйте позже или напишите в Telegram/WhatsApp.',
      privacy: 'Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных',
      contacts: 'Контакты',
      schedule: 'Ежедневно, 09:00 — 21:00 (ICT)',
    },

    // Footer
    footer: 'Все права защищены.',
    footerStaff: 'Для сотрудников',

    // Chat widget
    chat: {
      title: 'Чат поддержки',
      desc: 'Напишите нам — мы ответим прямо на сайте.',
      descFallback: 'Напишите нам в WhatsApp или Telegram.',
      namePlaceholder: 'Ваше имя',
      messagePlaceholder: 'Сообщение…',
      send: 'Отправить',
      connecting: 'Подключение…',
      typeName: 'Введите имя, чтобы начать',
      start: 'Начать',
      connectionError: 'Чат временно недоступен. Напишите нам:',
      retry: 'Повторить подключение',
      retryHint: 'Попробуйте снова — наш сотрудник ответит прямо на сайте',
      autoReply: 'Здравствуйте, {name}! Мы свяжемся с вами в течение 10 минут.',
      chatClosed: 'Чат закрыт. Напишите нам снова, чтобы начать новый диалог.',
      closedDialogue: 'Завершённый диалог',
      closedDialogueDesc: 'История переписки',
      startNewChat: 'Начать новый чат',
      endConversation: 'Завершить диалог',
      whatsappHint: 'Быстрый ответ',
      telegramHint: 'Поддержка 24/7',
    },
  },

  en: {
    nav: {
      services: 'Services',
      directions: 'Directions',
      howItWorks: 'How it works',
      faq: 'FAQ',
      adminChat: 'Personal office',
      logoHome: 'ClickPay — scroll to top',
    },
    cta: 'Submit request',

    hero: {
      badges: ['SWIFT transfers', 'Currency exchange', 'Crypto ↔ Fiat', '24/7 Support'],
      title: 'Money transfers worldwide with',
      lead: 'Financial transfers quickly and securely.',
      subtitle:
        'Fast transfers to 50+ countries. Personal 24/7 support. To calculate a transfer or ask a question. Use the button below.',
      calculateBtn: 'Calculate transfer',
      status: 'Status:',
      processedToday: 'Processed today',
      avgRate: 'Average rate',
      ratesError: 'Failed to load rates',
      loading: 'loading…',
      calculateModal: {
        title: 'Transfer quote request',
        lead:
          'Fill in the form below — a manager will reach out, and a copy goes to Telegram so nothing is missed.',
        telegramNote: 'In the contact field, add your Telegram @username or a number linked to Telegram.',
        close: 'Close',
      },
    },

    trust: {
      title: 'Why choose',
      subtitle: 'We ensure reliability and speed of every transfer through advanced technology and a global partner network.',
      metrics: {
        transfers: 'Successful transfers',
        countries: 'Destination countries',
        success: 'Successful transactions',
        avgTime: 'Average time (min)',
      },
    },

    services: {
      title: 'Our services',
      subtitle: 'Comprehensive financial solutions for individuals and businesses',
      items: [
        { title: 'SWIFT transfers', desc: 'Cross-border bank transfers to 50+ countries with fixed rates', action: 'Calculate' },
        { title: 'Currency exchange', desc: 'RUB ↔ THB, USD, EUR and other pairs at competitive rates', action: 'Exchange' },
        { title: 'Crypto ↔ Fiat', desc: 'Exchange cryptocurrency for fiat and vice versa. USDT, BTC, ETH.', action: 'Start' },
        { title: 'Consultation', desc: 'A personal manager will help you choose the optimal transfer route', action: 'Contact' },
      ],
      submit: 'Submit request',
    },

    directions: {
      title: 'Transfer directions',
      subtitle: 'We work with banks and payment systems worldwide, providing the best routes for your funds.',
      clarify: 'Clarify direction',
      mapLoadError: 'Could not load the map. Refresh the page or try again later.',
      mapHint:
        'Popular corridors are in the floating panel. Tap a country on the map for a short note on how to reach your manager for that route.',
      floatingTitle: 'Live corridors',
      floatingDestinations: [
        'Thailand — THB, 1–2 days',
        'UAE — AED, SWIFT',
        'Germany — EUR, reliable',
        'United States — USD, large sums',
        'United Kingdom — GBP',
        'Singapore — SGD',
        'Turkey — TRY',
        'Kazakhstan — KZT',
        'Vietnam — VND',
        'Indonesia — IDR',
        'Canada — CAD',
        'Poland — PLN',
        'Spain — EUR',
        'France — EUR',
        'Switzerland — CHF',
      ],
      countryModalTitle: 'Corridor: {country}',
      countryModalBody:
        'Contact a ClickPay manager — we will match the route, rate, and timeline for this destination.',
      countryModalCorridorsHint: 'Tap a row to expand actions. Tap again or use × to collapse.',
      countryModalRowNote: 'Submit a request — we will confirm terms for the corridor you picked.',
      countryModalClose: 'Got it',
      countryModalCta: 'Request a quote',
    },

    howItWorks: {
      title: 'How it works',
      subtitle: 'Simple and transparent fund transfer process',
      steps: [
        { title: 'Request', desc: 'Submit a request on the website or via messenger' },
        { title: 'Quote', desc: 'Receive an exact quote with a fixed rate' },
        { title: 'Payment', desc: 'Transfer funds using your preferred method' },
        { title: 'Processing', desc: 'We process your transfer as quickly as possible' },
        { title: 'Delivery', desc: 'The recipient receives the funds to their account' },
      ],
    },

    security: {
      badge: 'Security',
      title: 'Your security is',
      titleHighlight: 'our priority',
      desc: 'We use advanced encryption technology and follow strict international security standards to ensure the safety of your funds and data.',
      features: [
        'AES-256 data encryption',
        'Verification of every transaction',
        'Compliance with international AML/KYC standards',
        'GDPR personal data protection',
        'Two-factor authentication',
      ],
      guarantee: '100% Guarantee',
      guaranteeDesc: 'All operations are protected and insured. We take full financial responsibility for the safety of funds during transfer.',
    },

    faq: {
      title: 'FAQ',
      subtitle: 'Answers to common questions about our service',
      items: [
        { q: 'What documents are needed for a transfer?', a: 'For most transfers, a passport and recipient details are sufficient. For amounts over $10,000, proof of source of funds may be required.' },
        { q: 'How long does a transfer take?', a: 'SWIFT transfers are processed within 1-3 business days depending on the direction. Cryptocurrency operations — from 15 minutes to 1 hour.' },
        {
          q: 'What is the transfer fee?',
          a: 'The service fee is 1% of the transfer amount. You will receive an exact quote from our manager before confirming the operation.',
        },
        { q: 'Can a transfer be cancelled?', a: 'A transfer can be cancelled before processing. After funds are sent, cancellation is only possible through a recall procedure via the receiving bank, which may take time.' },
        { q: 'Do you work with legal entities?', a: 'Yes, we work with both individuals and legal entities. Business clients have access to special terms, invoices, and closing documents.' },
      ],
    },

    ctaSection: {
      title: 'Start your transfer',
      titleHighlight: 'right now',
      subtitle: 'Fill out the form and our manager will contact you within 5 minutes to clarify details and fix the rate.',
      namePlaceholder: 'Your name',
      contactPlaceholder: 'Phone or Telegram',
      messagePlaceholder: 'Amount and transfer direction (e.g.: 100,000 RUB to THB)',
      submit: 'Submit request',
      submitting: 'Sending…',
      success: 'Request sent! Our manager will contact you shortly.',
      error: 'Failed to send. Please try again later or contact us via Telegram/WhatsApp.',
      privacy: 'By clicking the button, you agree to the personal data processing policy',
      contacts: 'Contacts',
      schedule: 'Daily, 09:00 — 21:00 (ICT)',
    },

    footer: 'All rights reserved.',
    footerStaff: 'For staff',

    chat: {
      title: 'Support chat',
      desc: 'Write to us — we will reply right here on the site.',
      descFallback: 'Contact us via WhatsApp or Telegram.',
      namePlaceholder: 'Your name',
      messagePlaceholder: 'Message…',
      send: 'Send',
      connecting: 'Connecting…',
      typeName: 'Enter your name to start',
      start: 'Start',
      connectionError: 'Chat temporarily unavailable. Contact us:',
      retry: 'Retry connection',
      retryHint: 'Try again — our staff will reply right on the website',
      autoReply: 'Hello, {name}! We will contact you within 10 minutes.',
      chatClosed: 'Chat closed. Write to us again to start a new conversation.',
      closedDialogue: 'Closed dialogue',
      closedDialogueDesc: 'Conversation history',
      startNewChat: 'Start new chat',
      endConversation: 'End conversation',
      whatsappHint: 'Quick reply',
      telegramHint: '24/7 support',
    },
  },
} as const;

export type Locale = keyof typeof translations;
