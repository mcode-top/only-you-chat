export function h(sel, data, children) {
  // 如果返回是文本则输出文本
  if (typeof children === 'number' || typeof children === 'string') {
    return vnode(sel, data, undefined, children, undefined);
  } else if (Array.isArray(children)) {
    // 如果返回的是数组则表示它下面有一组
    return vnode(sel, data, children, undefined);
  } else if (typeof children === 'object' && children.hasOwnProperty('sel')) {
    return vnode(sel, data, [children], undefined);
  }
  return;
}

export function vnode(sel, data, children, text, element) {
  return { sel, data, children, text, element };
}
