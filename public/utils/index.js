/**
 * @name 节流
 * 节流的特性是，一段时间内重复调用一个函数时他只会执行一次
 */
export function throttle(fn, waitTime) {
  //第一次运行时执行
  let oldTime = 0;
  const self = this;
  return (...args) => {
    const currentTime = new Date().getTime();
    if (currentTime - oldTime >= waitTime) {
      fn.apply(self, args);
      oldTime = new Date().getTime();
    }
  };
}

/**
 * @name 防抖
 * 防抖特性，在等待时间内一直重复调用函数他都不会执行，并且会重新开启等待，直到等待时间结束会立即执行
 *  */
export function debounce(fn, waitTime) {
  let time = 0;
  const self = this;
  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(self, args);
    }, waitTime);
  };
}

/**
 * @name 中序遍历二叉树（双循环）
 *
 */
export function midTreeTraverse(tree) {
  const stack = [];
  let currentTree = tree;
  while (currentTree || stack.length !== 0) {
    // 遍历左树
    while (currentTree) {
      // 将当前树压入栈中
      stack.push(currentTree);
      currentTree = currentTree.left;
    }
    // 遍历右树
    if (stack.length !== 0) {
      currentTree = stack.pop();
      console.log(currentTree.data);
      currentTree = currentTree.right;
    }
  }
}
