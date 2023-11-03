const getID = () => {
  return "_" + Math.random().toString(36).slice(2, 9);
};

export const factory = ({
  projectID,
  oidParent,
  outputNodeID,
  inputNodeID,
  outputSocketIDX,
  inputSocketIDX,
}) => {
  return {
    oid: getID(),
    edgeType: "defaultEdge",

    projectID: projectID,
    oidParent: oidParent,
    outputNodeID: outputNodeID,
    inputNodeID: inputNodeID,

    outputSocketIDX: outputSocketIDX,
    inputSocketIDX: inputSocketIDX,
  };
};
