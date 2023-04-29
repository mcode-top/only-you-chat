/* eslint-disable no-unused-vars */
/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-12 16:20:34
 * @Description: 文件描述
 */
// 传入两个序列,判断以二叉树的结构上是否相等
function jugdeTree(seq1, seq2) {
  // 模式一：将其中一个序列转换为二叉树，让第二个序列通过遍历的值再去搜索二叉树，如果发现搜索的路径与之前的一致，那代表两个序列生成的二叉树结构相同
  let mainTree = makeTree(seq1);
  const some = !seq2.some((item) => !check(mainTree, item));
}

// 检查值是否存在与节点 - 如果存在则返回1并设置flag = 1, 如果查找时flag = 1则返回0
// 3 2 1 4
function check(t, value) {
  if (t.flag) {
    if (t.value > value) {
      return check(t.left, value);
    } else if (t.value < value) {
      return check(t.right, value);
    } else {
      // 如果相等就说明重复了
      return 0;
    }
  } else {
    if (value === t.value) {
      t.flag = 1;
      return 1;
    } else {
      return 0;
    }
  }
}
// 创建树
// - 读取序列生成为树 3 1 2 4
//         3
//      1     4
//        2
function makeTree(seq) {
  const tree = makeTreeNodeStruct(seq.shift());
  seq.forEach((element) => {
    insetTreeNode(tree, element);
  });
  return tree;
}
// 插入树节点
function insetTreeNode(t, value) {
  // 判断左右边的条件
  if (t.value > value) {
    if (t.left) {
      t.left = insetTreeNode(t.left, value);
    } else {
      t.left = makeTreeNodeStruct(value);
    }
  } else {
    if (t.right) {
      t.right = insetTreeNode(t.right, value);
    } else {
      t.right = makeTreeNodeStruct(value);
    }
  }
  return t;
}
// 创建树节点结构
function makeTreeNodeStruct(value) {
  return {
    value,
    left: null,
    right: null,
    flag: 0
  };
}
let result = jugdeTree([3, 1, 2, 4], [3, 4, 2, 1]);
console.log('====================================');
console.log(result);
console.log('====================================');
