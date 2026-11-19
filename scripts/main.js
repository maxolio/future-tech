/*«Импортируем класс, экспортированный по умолчанию, и с помощью new создаём его
 экземпляр, что сразу запускает инициализацию всех блоков на странице».*/
import Header from './Header.js'
import HeaderScroll from './HeaderScroll.js'
import TabsCollections from './Tabs.js'
import VideoPlayerCollection from './Video-player.js'
import ExpandableContentCollection from './ExpandableContent.js'

new Header()
new HeaderScroll()
new TabsCollections()
new VideoPlayerCollection()
new ExpandableContentCollection()

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
