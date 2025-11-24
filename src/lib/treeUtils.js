// Utility functions to mutate a nested tree safely

export function findItemPath(tree, id) {
  const path = [];

  function dfs(arr, trail) {
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      const current = [...trail, i];
      if (node.id === id) return current;
      if (node.children?.length) {
        const res = dfs(node.children, current.concat('children'));
        if (res) return res;
      }
    }
    return null;
  }

  // We treat 'children' as a key in the path; format like [0,'children',2,'children',1]
  return dfs(tree, []);
}

export function getItemByPath(tree, path) {
  let ref = tree;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (key === 'children') {
      ref = ref.children;
    } else {
      ref = ref[key];
    }
  }
  return ref;
}

export function removeItemById(tree, id) {
  const cloned = deepClone(tree);
  const path = findItemPath(cloned, id);
  if (!path) return { newTree: tree, removedItem: null };

  // Identify parent array that holds the item
  let parentArr = cloned;
  let indexToRemove = null;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (typeof key === 'number') {
      if (i === path.length - 1) {
        indexToRemove = key;
      } else {
        parentArr = parentArr[key];
      }
    } else if (key === 'children') {
      parentArr = parentArr.children;
    }
  }

  const removedItem = parentArr.splice(indexToRemove, 1)[0];
  return { newTree: cloned, removedItem };
}

export function insertItemAtPath(tree, path, item, index = null) {
  const cloned = deepClone(tree);
  let ref = cloned;

  // Navigate to target level array
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (typeof key === 'number') {
      ref = ref[key];
    } else if (key === 'children') {
      ref = ref.children;
    }
  }

  if (!Array.isArray(ref)) {
    // If ref is an object, expect its children
    ref.children = ref.children || [];
    ref = ref.children;
  }

  if (index === null || index < 0 || index > ref.length) {
    ref.push(item);
  } else {
    ref.splice(index, 0, item);
  }
  return cloned;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Build a map of ids per level to support same-level sorting
// Keys: 'root' for top-level, or string path '0.children.1.children'
export function flattenLevelIds(tree) {
  const levels = { root: tree.map(n => n.id) };

  function walk(arr, pathKeyArr) {
    arr.forEach((node, idx) => {
      const levelKey = [...pathKeyArr, idx, 'children'].join('.');
      if (node.children?.length) {
        levels[levelKey] = node.children.map(n => n.id);
        walk(node.children, [...pathKeyArr, idx, 'children']);
      }
    });
  }
  walk(tree, []);
  return levels;
}
