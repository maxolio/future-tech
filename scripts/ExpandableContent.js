import pxToRem from './utils/pxToRem.js'

const rootSelector = '[data-js-expandable-content]'

class ExpandableContent {
  /*«Мы выносим селекторы, классы состояний и настройки анимации в отдельные
  объекты-словари в начале класса, чтобы убрать «магические строки и числа»,
  сделать код читабельным и менять всё в одном месте».*/

  /*«Ключи пишем в camelCase (первое слово с маленькой буквы, остальные с
  заглавной, например isExpanded). В selectors значения — это строки-селекторы
  ('[data-js-...]'), в stateClasses — имена классов строкой без точки
  ('is-expanded'), а числовые настройки (500) — обычными числами без кавычек»*/
  selectors = {
    root: rootSelector,
    button: '[data-js-expandable-content-button]',
  }

  stateClasses = {
    isExpanded: 'is-expanded',
  }

  animationParams = {
    duration: 500,
    easing: 'ease',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElement = this.rootElement.querySelector(this.selectors.button)
    this.initialHeight = this.rootElement.offsetHeight
    this.bindEvents()

    /*  «В constructor мы принимаем rootElement, сохраняем его в свойство
    экземпляра this.rootElement, находим внутри него свою кнопку
    this.buttonElement и сразу вызываем this.bindEvents() для навешивания
    обработчиков».*/
  }

  expand() {
    const {offsetHeight, scrollHeight} = this.rootElement

    this.rootElement.classList.add(this.stateClasses.isExpanded)

    this.buttonElement.querySelector('span').textContent = 'Show Less'

    this.rootElement.animate(
      [
        {maxHeight: `${pxToRem(offsetHeight)}rem`},
        {maxHeight: `${pxToRem(scrollHeight)}rem`},
      ],
      this.animationParams,
    )
  }

  collapse() {
    const {scrollHeight} = this.rootElement

    this.buttonElement.querySelector('span').textContent = 'Read Full Blog'
    
    const animation = this.rootElement.animate(
      [
        {maxHeight: `${pxToRem(scrollHeight)}rem`},
        {maxHeight: `${pxToRem(this.initialHeight)}rem`},
      ],
      this.animationParams,
    )
    // Убираем .is-expanded только ПОСЛЕ завершения плавной анимации, чтобы не дёрнулось
    animation.onfinish = () => {
      this.rootElement.classList.remove(this.stateClasses.isExpanded)
    }
  }

  onButtonClick = () => {
    const isExpanded = this.rootElement.classList.contains(this.stateClasses.isExpanded)
    if (isExpanded) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
    /*«В bindEvents мы берём сохранённую кнопку экземпляра this.buttonElement,
    вешаем на неё слушатель 'click' и передаём (без ()) стрелочный метод
    this.onButtonClick, чтобы сохранить контекст this привязанным к текущему
    экземпляру».*/
  }
}

class ExpandableContentCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ExpandableContent(element)
    })
  }

  /*«В классе ExpandableContentCollection конструктор вызывает метод this.init().
   Внутри init мы находим все элементы по rootSelector (получаем NodeList),
   перебираем их через forEach и для каждого элемента создаём новый экземпляр
   класса ExpandableContent(element)».*/
}

export default ExpandableContentCollection