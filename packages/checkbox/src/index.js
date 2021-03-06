import checkbox from './checkbox.vue'
import checkboxIcon from './checkboxIcon.vue'
import checkboxItem from './checkboxItem.vue'
import checkboxTag from './checkboxTag.vue'
import './index.scss'

const suite = {
  [checkbox.name]: checkbox,
  [checkboxIcon.name]: checkboxIcon,
  [checkboxItem.name]: checkboxItem,
  [checkboxTag.name]: checkboxTag
}

export {
  suite as checkbox
}
