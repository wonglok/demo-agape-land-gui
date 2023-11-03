const AgapeNodes = []

// AgapeNodes.push({
//   key: "searchScene",
//   name: "searchScene",
//   ...require("../NodeLib/searchScene/searchScene.jsx"),
// });

AgapeNodes.push({
  key: 'colorPicker',
  name: 'colorPicker',
  ...require('../NodeLib/colorPicker/colorPicker.jsx'),
})

AgapeNodes.push({
  key: 'numberPicker',
  name: 'numberPicker',
  ...require('../NodeLib/numberPicker/numberPicker.jsx'),
})

AgapeNodes.push({
  key: 'box',
  name: 'box',
  ...require('../NodeLib/box/box.jsx'),
})

AgapeNodes.push({
  key: 'inheritancePhysicalMaterial',
  name: 'inheritancePhysicalMaterial',
  ...require('../NodeLib/material/inheritancePhysicalMaterial/inheritancePhysicalMaterial.jsx'),
})

AgapeNodes.push({
  key: 'applyMaterial',
  name: 'applyMaterial',
  ...require('../NodeLib/material/applyMaterial/applyMaterial.jsx'),
})

export { AgapeNodes }
