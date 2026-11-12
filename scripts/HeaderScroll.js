/**
 * Селектор для элементов, чью высоту нужно отслеживать и передавать в CSS
 */
const rootSelector = '[data-js-element-observer]'

/**
 * Класс-наблюдатель за конкретным элементом
 */
class ElementObserver {
  cssVar = {
    // Формирует имя CSS-переменной:
    // data-js-element-observer="header-promo" превратится в "--header-promo-height"
    cssVarName: (element) => `--${element.dataset.jsElementObserver}-height`,
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    // Запоминаем имя переменной для этого элемента
    this.currentVarName = this.cssVar.cssVarName(this.rootElement)
    this.initObserver()
  }

  initObserver() {
    // ResizeObserver — современный браузерный API,
    // который срабатывает при ЛЮБОМ изменении размера элемента (ресайз окна, перенос текста)
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // blockSize — это точная физическая высота элемента (height + padding + border)
        const height = entry.borderBoxSize[0].blockSize

        // Записываем вычисленную высоту прямо в тег <html> (:root) в формате пикселей:
        // Например: :root { --header-promo-height: 48px; }
        document.documentElement.style.setProperty(
          this.currentVarName,
          `${height}px`,
        )
      }
    })

    // Начинаем слежку за элементом
    this.observer.observe(this.rootElement)
  }
}

/**
 * Коллекция: находит ВСЕ такие элементы на странице и запускает для каждого наблюдатель
 */
class ElementObserverCollections {
  constructor() {
    this.init()
  }

  init() {
    // Ищем все элементы с атрибутом [data-js-element-observer]
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ElementObserver(element)
    })
  }
}

export default ElementObserverCollections