function reactive(obj: any): any {
  if (typeof obj !== 'object') {
    return obj;
  }
  const proxy = new Proxy(obj, {
    get(target, p, receiver) {
      track(receiver, p);
      const result = Reflect.get(target, p, receiver);
      if (typeof result === 'object') {
        return reactive(obj);
      }
      return result;
    },
    set(target, p, newValue, receiver) {
      const result = Reflect.set(target, p, newValue, receiver);
      trigger(receiver, p);
      return result;
    }
  });
  return proxy;
}

let activeEffect: any = null;

/**@name 监听响应式 */
function effect(this: any, fn: Function) {
  const _effect = {
    run: fn
  };
  activeEffect = _effect;
  _effect.run();
  return _effect;
}
const targetMap = new WeakMap();
/**@name 添加依赖 */
function track(receiver: any, key: any) {
  let depMap: Map<any, Set<any>> = targetMap.get(receiver);
  if (!depMap) {
    targetMap.set(receiver, (depMap = new Map()));
  }
  let effectSet = depMap.get(key);
  if (!effectSet) {
    depMap.set(key, (effectSet = new Set()));
  }
  effectSet.add(activeEffect);
}
/**@name 触发effect */
function trigger(receiver: any, key: any) {
  const depMap: Map<any, Set<any>> = targetMap.get(receiver);
  if (!depMap) {
    return;
  }
  const effectSet = depMap.get(key);
  if (!effectSet) {
    return;
  }
  effectSet.forEach((ef) => {
    ef.run();
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
