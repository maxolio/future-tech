# 📑 Полное руководство компонента «Табы» (Tabs)

Этот файл — твой персональный справочник по компоненту табов. Здесь собрана вся анатомия: от семантической разметки W3C ARIA до каждого метода JavaScript в двух плоскостях (простыми словами «под капотом» + профессиональная формулировка для собеседования).

---

## 1. Семантическая HTML-разметка и связи W3C WAI-ARIA

```html
<div class="tabs" data-js-tabs>
  <h3 class="visually-hidden" id="tabs-title">Навигация по разделам</h3>
  
  <header class="tabs__header">
    <div class="tabs__buttons" role="tablist" aria-labelledby="tabs-title">
      <!-- Активная кнопка -->
      <button class="tabs__button is-active"
              id="tab-1"
              type="button"
              role="tab"
              aria-controls="tabpanel-1"
              aria-selected="true"
              tabindex="0"
              data-js-tabs-button>
        All
      </button>

      <!-- Неактивная кнопка -->
      <button class="tabs__button"
              id="tab-2"
              type="button"
              role="tab"
              aria-controls="tabpanel-2"
              aria-selected="false"
              tabindex="-1"
              data-js-tabs-button>
        Quantum Computing
      </button>
    </div>
  </header>

  <div class="tabs__body">
    <!-- Активная панель -->
    <div class="tabs__content is-active"
         id="tabpanel-1"
         role="tabpanel"
         aria-labelledby="tab-1"
         tabindex="0"
         data-js-tabs-content>
      ...
    </div>

    <!-- Неактивная панель -->
    <div class="tabs__content"
         id="tabpanel-2"
         role="tabpanel"
         aria-labelledby="tab-2"
         data-js-tabs-content>
      ...
    </div>
  </div>
</div>
```

### Схема ARIA-связей:
* `aria-controls="ID панели"`: Кнопка управляет панелью контента.
* `aria-labelledby="ID кнопки"`: Панель подписывается именем кнопки.
* `aria-selected="true"`: Доступность — сообщает скринридеру текущий выбор.
* `tabindex="0"`: Только активная кнопка открыта для клавиши `Tab`. У неактивных `tabindex="-1"` (навигация стрелками `←` `→`).

---

## 2. Менеджер всех табов: `TabsCollection`

### Исходный код:
```javascript
const rootSelector = '[data-js-tabs]';

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element);
    });
  }
}

export default TabsCollection;
```

---

## 3. ЧАСТЬ 1: Базовая логика табов (Клик мышкой и реактивность)

> 💡 **Архитектурный рубеж (Этап 1):**  
> На этом этапе табы полностью функциональны для мыши и тач-устройств. Мы научили компонент слушать клики, мутировать свойство состояния `activeTabIndex` и синхронизировать классы и ARIA-атрибуты через `updateUi()`. Навигация стрелками с клавиатуры вынесена в Часть 2.

### Полный код Части 1:
```javascript
const rootSelector = '[data-js-tabs]'

class Tabs {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  stateAttributes = {
    ariaSelected: 'aria-selected',
    tabIndex: 'tabindex',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
    this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
    this.state = {
      activeTabIndex: [...this.buttonElements]
        .findIndex(buttonElement => buttonElement.classList.contains(this.stateClasses.isActive)),
    }
    this.limitTabIndex = this.buttonElements.length - 1
    this.bindEvents()
  }

  updateUi() {
    const { activeTabIndex } = this.state

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = index === activeTabIndex

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
      buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
      buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
    })

    this.contentElements.forEach((contentElement, index) => {
      const isActive = index === activeTabIndex

      contentElement.classList.toggle(this.stateClasses.isActive, isActive)
    })
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex
    this.updateUi()
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => {
        this.onButtonClick(index)
      })
    })
  }
}

class TabsCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element)
    })
  }
}

export default TabsCollection
```

---

## 4. Разбор методов Части 1 (пошаговая анатомия)


### 🟢 Версия 1: Простая и понятная (своими словами)
> «Класс `TabsCollection` управляет всеми блоками табов на странице. В методе `init()` он находит через `document.querySelectorAll` все блоки по дата-атрибуту `[data-js-tabs]`. Для каждого найденного блока он рождает отдельный независимый экземпляр `new Tabs(element)`, чтобы каждый блок жил своей жизнью и управлял своими кнопками, не ломая другие табы на сайте».

### 🔵 Версия 2: Профессиональная (для технического интервью)
> «Здесь реализован паттерн **Collection / Item** для масштабируемой инициализации компонентов:
> 1. Слабая связанность (Loose Coupling): класс коллекции выступает точкой входа, инкапсулируя обход DOM.
> 2. Разделение ответственности (SoC): поиск ведётся по data-атрибутам, изолируя логику JS от CSS-классов.
> 3. Изоляция контекста: каждый узел получает собственный экземпляр с изолированным `this`, предотвращая конфликты при наличии нескольких табов на одной странице».

---

## 3. Анатомия класса `Tabs`: Конструктор и инструменты объекта

### Исходный код:
```javascript
class Tabs {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  };

  stateClasses = {
    isActive: 'is-active',
  };

  stateAttributes = {
    ariaSelected: 'aria-selected',
    tabIndex: 'tabindex',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.contentElements = this.rootElement.querySelectorAll(this.selectors.content);
    this.state = {
      activeTabIndex: [...this.buttonElements]
        .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
    };
    this.limitTabIndex = this.buttonElements.length - 1;

    this.bindEvents();
  }
}
```

### 🟢 Версия 1: Простая и понятная (своими словами)
> «В конструкторе мы наполняем наш живой объект `this` пятью инструментами:
> 1. `this.rootElement` — сохраняем ссылку на наш блок (ключ от своей комнаты), чтобы искать элементы только внутри своих стен.
> 2. `this.buttonElements` и `this.contentElements` — кэшируем свои кнопки и панели, чтобы не искать их заново при каждом клике.
> 3. `this.state = { activeTabIndex }` — блокнот текущего состояния. Через спред превращаем NodeList в массив и методом `.findIndex` автоматически узнаём, на какой кнопке верстальщик в HTML поставил класс `is-active` (если на первой — запишется 0).
> 4. `this.limitTabIndex = length - 1` — отбойник границ. Для 6 кнопок максимальный индекс равен 5. Нужен для безопасной навигации стрелками по кругу».

### 🔵 Версия 2: Профессиональная (для технического интервью)
> «Инициализация экземпляра реализует инкапсуляцию области видимости (Scoped DOM Querying):
> 1. Кэширование DOM-ссылок снижает затраты на повторный парсинг дерева при интеракциях.
> 2. Динамическая инициализация состояния: активный индекс вычисляется из начального HTML через предикат `classList.contains`, формируя Single Source of Truth без хардкода.
> 3. Верхняя граница (`limitTabIndex`) подготавливает компонент к циклической навигации стрелками по спецификации WAI-ARIA».

---

## 4. Подключение датчиков клика: `bindEvents()`

### Исходный код:
```javascript
bindEvents() {
  this.buttonElements.forEach((buttonElement, index) => {
    buttonElement.addEventListener('click', () => {
      this.onButtonClick(index);
    });
  });
}
```

### 🟢 Версия 1: Простая и понятная (своими словами)
> «Метод обходит все наши кнопки и на каждую вешает слушатель клика. Благодаря стрелочной функции `() =>` каждая кнопка намертво запоминает свой личный порядковый номер `index` и при клике вызывает метод нашего объекта `this.onButtonClick(номер)`, сохраняя луч лазерной указки `this` на нашем классе».

### 🔵 Версия 2: Профессиональная (для технического интервью)
> «Регистрация обработчиков событий (Event Binding): использование стрелочной функции обеспечивает сохранение лексического контекста `this` экземпляра и замыкает локальный индекс итерации для передачи в обработчик».

---

## 5. Изменение состояния и отрисовка: `onButtonClick()` и `updateUi()`

### Исходный код:
```javascript
onButtonClick(buttonIndex) {
  this.state.activeTabIndex = buttonIndex;
  this.updateUi();
}

updateUi() {
  const { activeTabIndex } = this.state;

  this.buttonElements.forEach((buttonElement, index) => {
    const isActive = index === activeTabIndex;

    buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
    buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString());
    buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1');
  });

  this.contentElements.forEach((contentElement, index) => {
    const isActive = index === activeTabIndex;

    contentElement.classList.toggle(this.stateClasses.isActive, isActive);
  });
}
```

### 🟢 Версия 1: Простая и понятная (своими словами)
> «Здесь работает главный закон фронтенда: **UI = f(State)**:
> 1. В методе `onButtonClick` мы **НЕ трогаем стили напрямую** — мы просто меняем число в объекте памяти: `this.state.activeTabIndex = buttonIndex`.
> 2. Метод `updateUi` заглядывает в память, берёт обновлённую цифру и перерисовывает страницу:
>    - `classList.toggle(класс, isActive)`: если номер совпал — класс `is-active` добавляется, если нет — снимается одной строчкой без `if/else`.
>    - `aria-selected`: превращает `true/false` в строку через `.toString()` для скринридеров.
>    - `tabindex`: активной кнопке даёт `'0'` (вход по Tab), а неактивным `'-1'` (чтобы не забивать очередь табуляции).
>    - Панели со статьями переключаются по тому же принципу: активная показывается, остальные прячутся».

### 🔵 Версия 2: Профессиональная (для технического интервью)
> «Реализация Data-Driven подхода (однонаправленный поток данных):
> 1. Метод `onButtonClick` лишь мутирует состояние (`state`), делегируя отображение методу `updateUi`.
> 2. Идемпотентность рендеринга: второй булев аргумент `classList.toggle` гарантирует предсказуемое синхронное состояние классов.
> 3. Реализация паттерна WAI-ARIA Roving Tabindex: только активный таб доступен по клавише `Tab`, неактивные элементы исключены (`tabindex="-1"`), а атрибут `aria-selected` синхронизируется в строковом формате для ассистивных технологий».
