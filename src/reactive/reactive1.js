/* eslint-disable no-unused-vars */
/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-09 21:15:14
 * @Description: 文件描述
 */

function reactive(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  return new Proxy(obj, {
    get(target, property, receiver) {
      track(receiver, property);
      const result = Reflect.get(target, property, receiver);
      if (typeof result === 'object') {
        // 检查值是否为对象,是的话也加入响应式
        return reactive(result);
      }
      return result;
    },
    set(target, property, value, receiver) {
      const oldValue = Reflect.get(target, property, receiver);
      Reflect.set(target, property, value, receiver);
      trigger(receiver, property, value, oldValue);
    }
  });
}

let globalCacheFn = null;

/**@name 设置监听函数 */
function effect(fn) {
  if (typeof fn !== 'function') {
    return;
  }
  globalCacheFn = fn;
  fn();
  globalCacheFn = null;
  return fn;
}

const targetMap = new WeakMap();
// 添加依赖
function track(self, key) {
  if (!globalCacheFn) {
    return;
  }
  let depMap = targetMap.get(self);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(self, depMap);
  }
  let depObjToKeySet = depMap.get(key);
  if (!depObjToKeySet) {
    depObjToKeySet = new Set();
    depMap.set(key, depObjToKeySet);
  }
  depObjToKeySet.add(globalCacheFn);
}

function trigger(self, key, newValue, oldValue) {
  let depMap = targetMap.get(self);
  if (!depMap) {
    return;
  }
  let depObjToKeySet = depMap.get(key);
  if (!depObjToKeySet) {
    return;
  }
  depObjToKeySet.forEach((item) => {
    item(newValue, oldValue);
  });
}
const obj = reactive({
  a: 1,
  b: 2
});
effect(() => {
  console.log(obj);
});
obj.a = 2;
obj.a = 3;
obj.a = 4;
