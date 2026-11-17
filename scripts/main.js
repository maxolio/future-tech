import Header from './Header.js'
import HeaderScroll from './HeaderScroll.js'
import TabsCollections from './Tabs.js'
import VideoPlayerCollection from './Video-player.js'

new Header()
new HeaderScroll()
new TabsCollections()
new VideoPlayerCollection()

/*
Если из файла нужно отдать одну главную штуку
(как наш класс для всех видеоплееров) — пишем export default,
 и тогда при подключении в другом файле не нужны фигурные скобки,
  просто берём её и всё.

Если же в файле лежит много разных мелких функций
  (как ящик с инструментами) — пишем обычный export перед каждой,
  и в другом файле в фигурных скобках { ... }
  перечисляем по именам только те, которые хотим забрать.
  */
