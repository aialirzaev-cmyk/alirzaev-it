const ALIRZAEV_CONFIG = {
  brand: {
    name: "alirzaev-it",
    tagline: "digital-студия для HoReCa",
    description: "Цифровые меню, QR-решения и сайты для заведений общепита."
  },

  whatsappNumber: "79285018424",
  contacts: {
    phone: "+7 928 501-84-24",
    email: "",
    address: "",
    workingHours: ""
  },
  socials: [
    { label: "Telegram-канал", url: "https://t.me/alirzaevit", icon: "telegram" },
    { label: "Instagram", url: "https://www.instagram.com/alirzaev22/", icon: "instagram" }
  ],

  pricing: {
    urgent: {
      label: "2 дня",
      name: "Срочно",
      description: "Самый быстрый запуск — с приоритетом в работе. Стоимость — самая высокая.",
      hint: "Для запуска в ближайшие дни",
      price: null
    },
    standard: {
      label: "5 дней",
      name: "Стандарт",
      description: "Сбалансированный вариант: качественный результат без лишнего ожидания.",
      hint: "Оптимальный срок",
      price: null
    },
    economy: {
      label: "10 дней",
      name: "Эконом",
      description: "Экономичный вариант для проектов, которые можно подготовить без спешки.",
      hint: "Самая низкая стоимость",
      price: null
    }
  },

  orderServices: [
    "Цифровое меню",
    "QR-меню",
    "Сайт ресторана",
    "Сайт кафе или кофейни",
    "Сайт бара, пекарни или другого заведения",
    "Landing page",
    "Комплексное решение",
    "Другое"
  ],

  venueTypes: [
    "Ресторан",
    "Кафе",
    "Кофейня",
    "Бар",
    "Пекарня",
    "Фастфуд",
    "Другое"
  ],

  services: [
    {
      id: "digital-menu",
      number: "01",
      title: "Цифровое меню",
      description: "Красивое меню с фотографиями, описаниями и ценами. Открывается на смартфоне и выглядит как часть фирменного стиля заведения.",
      tags: ["Фото блюд", "Категории", "Мобильный формат"],
      orderValue: "Цифровое меню",
      size: "wide",
      art: "menu"
    },
    {
      id: "qr-menu",
      number: "02",
      title: "QR-меню",
      description: "Гость сканирует QR-код на столе и сразу открывает меню в браузере. Без приложений и лишних действий.",
      tags: ["QR на столе", "Без установки", "Мгновенный доступ"],
      orderValue: "QR-меню",
      size: "narrow",
      art: "qr"
    },
    {
      id: "restaurant-site",
      number: "03",
      title: "Сайт ресторана",
      description: "Сайт с атмосферой заведения: меню, фотографии, информация, контакты и адрес. Всё, что помогает гостю решиться на визит.",
      tags: ["Дизайн под концепцию", "Меню", "Контакты"],
      orderValue: "Сайт ресторана",
      size: "third",
      art: "restaurant"
    },
    {
      id: "cafe-site",
      number: "04",
      title: "Сайт кафе или кофейни",
      description: "Тёплый digital-образ заведения: акцент на атмосферу, продукты и детали, которые хочется показать гостям.",
      tags: ["Атмосфера", "Фото", "Адаптивность"],
      orderValue: "Сайт кафе или кофейни",
      size: "third",
      art: "cafe"
    },
    {
      id: "bar-bakery-site",
      number: "05",
      title: "Сайт бара, пекарни или другого заведения",
      description: "Индивидуальный сайт под характер места — от лаконичной пекарни до атмосферного бара.",
      tags: ["Индивидуальный стиль", "Гибкая структура", "Все устройства"],
      orderValue: "Сайт бара, пекарни или другого заведения",
      size: "third",
      art: "bar"
    },
    {
      id: "landing",
      number: "06",
      title: "Landing page",
      description: "Продающая страница для открытия, специального предложения или нового проекта заведения.",
      tags: ["Один сценарий", "Ясная структура", "Фокус на действии"],
      orderValue: "Landing page",
      size: "half",
      art: "landing"
    },
    {
      id: "custom",
      number: "07",
      title: "Индивидуальные digital-решения",
      description: "Нестандартная задача для вашего заведения? Обсудим формат, который действительно нужен именно вам.",
      tags: ["Свободный формат", "Под задачу", "Обсуждение"],
      orderValue: "Другое",
      size: "half",
      art: "custom"
    }
  ],

  portfolio: [
    {
      id: "coffee-menu-concept",
      number: "01",
      title: "Меню для кофейни",
      category: "Цифровое меню",
      description: "Демонстрационный макет мобильного меню: крупные фотографии, спокойные категории и акцент на атмосферу кофейни.",
      image: "assets/img/coffee-900.webp",
      imageSmall: "assets/img/coffee-480.webp",
      alt: "Демонстрационный макет цифрового меню для кофейни",
      tags: ["Мобильное меню", "Категории", "Фото"],
      service: "Цифровое меню",
      hidden: false
    },
    {
      id: "restaurant-site-concept",
      number: "02",
      title: "Сайт ресторана",
      category: "Сайт заведения",
      description: "Демонстрационный макет сайта ресторана: выразительный первый экран, атмосферные фотографии и понятная структура.",
      image: "assets/img/restaurant-900.webp",
      imageSmall: "assets/img/restaurant-480.webp",
      alt: "Демонстрационный макет сайта ресторана",
      tags: ["Первый экран", "Фотографии", "Структура"],
      service: "Сайт ресторана",
      hidden: false
    },
    {
      id: "bakery-landing-concept",
      number: "03",
      title: "Лендинг пекарни",
      category: "Landing page",
      description: "Демонстрационный макет лендинга для пекарни: фокус на продукте, тёплая визуальная подача и один ясный сценарий.",
      image: "assets/img/bakery-900.webp",
      imageSmall: "assets/img/bakery-480.webp",
      alt: "Демонстрационный макет лендинга пекарни",
      tags: ["Продукт", "Атмосфера", "Сценарий"],
      service: "Landing page",
      hidden: false
    },
    {
      id: "qr-table-concept",
      number: "04",
      title: "QR-меню на столе",
      category: "QR-решение",
      description: "Демонстрация того, как QR-код становится частью сервиса: аккуратная подача на столе и быстрый переход к меню.",
      image: "assets/img/dish-plate-900.webp",
      imageSmall: "assets/img/dish-plate-480.webp",
      alt: "Демонстрационный макет QR-меню на столе",
      tags: ["QR-код", "Сервис", "Мобайл"],
      service: "QR-меню",
      hidden: false
    }
  ],

  advantages: [
    {
      number: "01",
      title: "Современный дизайн",
      text: "Визуальный язык, который соответствует уровню заведения и ожиданиям гостей.",
      icon: "spark"
    },
    {
      number: "02",
      title: "Удобство для пользователей",
      text: "Понятные сценарии, крупные акценты и никаких лишних действий.",
      icon: "touch"
    },
    {
      number: "03",
      title: "Адаптация под устройства",
      text: "Комфортно на смартфоне, планшете и большом экране.",
      icon: "devices"
    },
    {
      number: "04",
      title: "Внимание к деталям",
      text: "Типографика, отступы, фотографии и мелочи, из которых складывается впечатление.",
      icon: "detail"
    },
    {
      number: "05",
      title: "Индивидуальный подход",
      text: "Решения под концепцию, кухню и характер конкретного заведения.",
      icon: "person"
    }
  ],

  about: {
    title: "Digital-студия с фокусом на гостеприимство",
    lead: "alirzaev-it помогает заведениям общепита выглядеть современнее, представлять блюда в цифровом формате и создавать удобный опыт для посетителей.",
    story: "",
    founderName: "",
    founderRole: "Основатель студии",
    specialization: ["Рестораны", "Кафе и кофейни", "Бары и пекарни", "HoReCa-проекты"],
    principles: [
      {
        title: "Сначала — гость",
        text: "Каждое решение проверяем с точки зрения человека, который откроет его на своём смартфоне."
      },
      {
        title: "Дизайн под заведение",
        text: "Не используем один шаблон для всех: стиль должен продолжать характер места."
      },
      {
        title: "Понятный результат",
        text: "Структура, тексты и интерфейс работают на простую задачу — помочь гостю выбрать и захотеть прийти."
      }
    ]
  },

  demoMenu: {
    venueName: "olive & ember",
    venueLabel: "демо-меню",
    cover: "assets/img/restaurant-900.webp",
    categories: [
      { id: "all", label: "Всё меню" },
      { id: "breakfast", label: "Завтраки" },
      { id: "main", label: "Основное" },
      { id: "drinks", label: "Напитки" }
    ],
    items: [
      {
        id: "syrniki",
        category: "breakfast",
        title: "Сырники с ягодным соусом",
        description: "Нежные сырники, сезонные ягоды и сливочный соус",
        price: "390 ₽",
        image: "assets/img/dessert-480.webp",
        badge: "выбор гостей"
      },
      {
        id: "croissant",
        category: "breakfast",
        title: "Круассан с миндалём",
        description: "Слоёный круассан, миндальный крем и свежая выпечка",
        price: "290 ₽",
        image: "assets/img/bakery-480.webp"
      },
      {
        id: "steak",
        category: "main",
        title: "Стейк из мраморной говядины",
        description: "Обжаренный стейк, печёные овощи и соус чимичурри",
        price: "1 290 ₽",
        image: "assets/img/dish-plate-480.webp",
        badge: "шеф"
      },
      {
        id: "salad",
        category: "main",
        title: "Салат с томатами и страчателлой",
        description: "Сезонные томаты, страчателла, базилик и оливковое масло",
        price: "490 ₽",
        image: "assets/img/salad-480.webp"
      },
      {
        id: "cappuccino",
        category: "drinks",
        title: "Капучино",
        description: "Эспрессо и мягкое молоко на выбор",
        price: "240 ₽",
        image: "assets/img/coffee-480.webp"
      },
      {
        id: "lemonade",
        category: "drinks",
        title: "Авторский лимонад",
        description: "Цитрус, травы и лёгкая горчинка",
        price: "320 ₽",
        image: "assets/img/cocktail-480.webp"
      }
    ]
  }
};
