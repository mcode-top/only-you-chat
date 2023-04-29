/* eslint-disable no-unused-vars */
/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-09 21:42:09
 * @Description: 文件描述
 */
function reactive(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  return new Proxy(obj, {
    get(target, property, self) {
      track(self, property);
      const result = Reflect.get(target, property, self);
      if (typeof result === 'object') {
        // 检查是对象，如果是对象也给其添加响应式
        return reactive(result);
      }
      return result;
    },
    set(target, property, value, self) {
      Reflect.set(target, property, value, self);
      trigger(self, property);
    }
  });
}
let globalCacheFn = null;
function effect(fn) {
  globalCacheFn = fn;
  fn();
  globalCacheFn = null;
}
const targetMap = new WeakMap();
function track(self, property) {
  if (!globalCacheFn) {
    return;
  }
  let depMap = targetMap.get(self);
  if (!depMap) {
    targetMap.set(self, (depMap = new Map()));
  }
  let effectFnSet = depMap.get(property);
  if (!effectFnSet) {
    depMap.set(property, (effectFnSet = new Set()));
  }
  // 绑定监听
  effectFnSet.add(globalCacheFn);
}
function trigger(self, property) {
  let depMap = targetMap.get(self);
  if (!depMap) {
    return;
  }
  let effectFnSet = depMap.get(property);
  if (!effectFnSet) {
    return;
  }
  effectFnSet.forEach((eff) => {
    eff();
  });
}
const obj = reactive({
  a: 1,
  b: 2
});
effect(() => {
  console.log(obj.a);
});
obj.a = 2;
obj.a = 3;
obj.a = 4;
