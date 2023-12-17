import { arrayToTree, treeToArray } from 'tree-with-array'

export const toTree = (v) => {
  return arrayToTree(v || [], {
    idKey: 'oid',
    pIdKey: 'oidParent',
  })
}

export const toArray = (v) => {
  return treeToArray(v || [], {
    childrenKey: 'children',
  })
}

export const getTreeItemByOID = (tree, id) => {
  return toArray(tree).find((item) => item.oid === id)
}

export const getArrayItemByOID = (array, id) => {
  return array.find((item) => item.oid === id)
}
