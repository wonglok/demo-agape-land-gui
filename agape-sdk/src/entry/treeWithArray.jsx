import { arrayToTree, treeToArray } from "tree-with-array";

export const toTree = (v) => {
  return arrayToTree(v || [], {
    idKey: "oid",
    pIdKey: "oidParent",
  });
};

export const toArray = (v) => {
  return treeToArray(v || [], {
    childrenKey: "children",
  });
};

export const editTreeOnArray = ({ tree, onArray = () => {} }) => {
  let array = toArray(tree);
  onArray({ array });
  return toTree(array);
};

export const forEachTree = ({ tree, onEach = () => {} }) => {
  let array = toArray(tree);
  array.forEach(onEach);
};
