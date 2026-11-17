const rootSelector = '[data-js-video-player]' // ([...] = поиск тега по HTML-атрибуту)

class VideoPlayer {
  selectors = {
    root: rootSelector,
    video: '[data-js-video-player-video]',
    panel: '[data-js-video-player-panel]',
    playButton: '[data-js-video-player-play-button]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.videoElement = this.rootElement.querySelector(this.selectors.video)
    this.panelElement = this.rootElement.querySelector(this.selectors.panel)
    this.playButtonElement = this.rootElement.querySelector(this.selectors.playButton)
    this.bindEvents()
  }

  // Стрелка (=>) приваривает this к экземпляру VideoPlayer (иначе при клике this стал бы кнопкой <button>)
  onPlayButtonClick = () => {
    document.querySelectorAll(this.selectors.video).forEach((video) => {
      if (video !== this.videoElement) {
        video.pause()
      }
    })
    this.videoElement.play()
    this.videoElement.controls = true // Включаем стандартную панель управления браузера
    this.panelElement.classList.remove(this.stateClasses.isActive) // Прячем нашу обложку с кнопкой Play
  }

  // Срабатывает, когда видео поставили на паузу: возвращаем обложку и убираем панель браузера
  onVideoPause = () => {
    this.videoElement.controls = false
    this.panelElement.classList.add(this.stateClasses.isActive)
  }

  bindEvents() {
    // Передаём функции БЕЗ скобок (), чтобы передать адрес, а не запускать сразу
    this.playButtonElement.addEventListener('click', this.onPlayButtonClick)
    this.videoElement.addEventListener('pause', this.onVideoPause)
  }
}

class VideoPlayerCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new VideoPlayer(element)
    })
  }
}

export default VideoPlayerCollection
