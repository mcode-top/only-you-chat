import { h } from './js/render/h.js'
import { throttle, debounce } from './utils/index.js'
const node = h(
  'a',
  { props: { herf: 'baidu.com' } },
  h('span', { props: { herf: 'baidu.com' } }, '链接')
)
document.getElementById('input').oninput = debounce((ev) => {
  const value = ev.target.value
  console.log(value)
}, 200)
console.log(node)
/**
 * @name 二分查找的原理
 * 取一个数组索引的中间值，来跟查找元素进行比对
 * -> 大于中间值表示要查找的元素位置在右边，所以左边的一半就要丢掉（left = min + 1）
 * -> 小于中间值表示要查找的元素位置在左边，所以右边的一半就要丢掉（right = min - 1）
 * -> 中间值等于元素表示这是查找的位置
 * 直到 左边的值大于或等于右边的值表示元素不存在
 */
function binarySearch(array, element) {
  //左边首部
  let left = 0
  //右边尾部
  let right = array.length - 1
  while (left >= right) {
    // 取数组的索引中间值
    const mid = Math.floor((left + right) / 2)
    if (element > array[mid]) {
      left = mid + 1
    } else if (element < array[mid]) {
      right = mid - 1
    } else {
      return mid
    }
  }
  return -1
}
