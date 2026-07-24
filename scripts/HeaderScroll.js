const rootSelector = '[data-js-element-observer]'

class ElementObserver {
  cssVar = {
    // Безопасно формирует имя переменной на основе значения из HTML-атрибута
    cssVarName: (element) => `--${element.dataset.jsElementObserver}-height`,
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.currentVarName = this.cssVar.cssVarName(this.rootElement)
    this.initObserver()
  }

  initObserver() {
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Получаем физическую высоту элемента с учётом внутренних отступов и рамок
        const height = entry.borderBoxSize[0].blockSize

        // Записываем значение высоты в глобальные стили :root
        document.documentElement.style.setProperty(this.currentVarName, `${height}px`)
      }
    })

    this.observer.observe(this.rootElement)
  }
}

class ElementObserverCollections {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ElementObserver(element)
    })
  }
}

export default ElementObserverCollections