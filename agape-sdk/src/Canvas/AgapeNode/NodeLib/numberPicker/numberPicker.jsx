import { Box, Html, Sphere } from "@react-three/drei";
import { useCore } from "../../Runtime/useCore";
import { useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import { useThree } from "@react-three/fiber";

export function Register({ AgapeNodes }) {
  useEffect(() => {
    let sample = makerFactory({});
    AgapeNodes.find((r) => r.key === sample.nodeType).makerFactory =
      makerFactory;
  }, []);
  return <></>;
}

const getID = () => {
  return "_" + Math.random().toString(36).slice(2, 9);
};

const makerFactory = ({
  projectID = "",
  oidParent = "",
  position = [0, 0, 0],
}) => {
  return {
    oid: getID(),
    nodeType: "numberPicker",
    nodeCategory: "input",
    title: "numberPicker",
    projectID: projectID,
    oidParent: oidParent,
    socketInputs: [
      // {
      //   oid: getID(),
      //   io: "input",
      //   label: "objectName",
      // },
    ],
    socketOutputs: [
      {
        oid: getID(),
        io: "output",
        label: "number",
      },
    ],
    position: position,
  };
};

export function NodeGUI({ node, useStore }) {
  if (typeof node.numberValue === "undefined") {
    node.numberValue = 0;
  }
  if (typeof node.minValue === "undefined") {
    node.minValue = 0;
  }
  if (typeof node.maxValue === "undefined") {
    node.maxValue = 1;
  }

  let tt = useRef(0);

  let inputRef = useRef();
  let rangeRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = node.numberValue;
    }
    if (rangeRef.current) {
      rangeRef.current.value = node.numberValue;
    }
  }, [node.numberValue]);

  let controls = useThree((r) => r.controls);
  // let currentNode = useStore((r) => r.currentNode);
  // let isCurrentNode = currentNode?.oid === node.oid && currentNode;

  return (
    <group>
      <Html position={[0, -1, 0]} center transform sprite scale={0.6}>
        <div
          className="bg-white p-2 rounded-2xl border border-gray-800"
          onPointerDown={() => {
            //

            if (controls) {
              controls.enabled = false;
            }
          }}
          onPointerUp={() => {
            //

            if (controls) {
              controls.enabled = true;
            }
          }}
        >
          <div className="">
            <div className="w-44 bg-transparent flex justify-between items-center">
              <input
                useRef={rangeRef}
                type={"range"}
                step={0.001}
                min={node.minValue}
                max={node.maxValue}
                value={node.numberValue}
                placeholder="Number bg-transparent"
                className="w-24 p-2 "
                onChange={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();

                  node.numberValue = event.target.value;

                  useStore.setState({
                    nodesList: useStore.getState().nodesList.map((n) => {
                      let nn = { ...n };
                      if (nn.oid === node.oid) {
                        nn = { ...node };
                      }
                      delete nn.children;
                      return nn;
                    }),
                  });
                  clearTimeout(tt.current);
                  tt.current = setTimeout(() => {
                    useStore.getState().graphCmd.updateAgapeNode({ node });
                  }, 150);
                }}
              ></input>

              <input
                useRef={inputRef}
                type={"number"}
                step={0.001}
                value={node.numberValue}
                placeholder="Number"
                className="w-24 p-2 bg-transparent"
                onChange={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();

                  node.numberValue = event.target.value;

                  if (inputRef.current) {
                    inputRef.current.value = node.numberValue;
                  }

                  useStore.setState({
                    nodesList: useStore.getState().nodesList.map((n) => {
                      let nn = { ...n };
                      if (nn.oid === node.oid) {
                        nn = { ...node };
                      }
                      delete nn.children;
                      return nn;
                    }),
                  });
                  clearTimeout(tt.current);
                  tt.current = setTimeout(() => {
                    useStore.getState().graphCmd.updateAgapeNode({ node });
                  }, 150);
                }}
              ></input>
            </div>
            <div className="w-44 bg-transparent flex justify-between items-center text-xs ">
              <span className=" inline-flex">Min Value:</span>
              <input
                type={"number"}
                step={0.001}
                value={node.minValue}
                placeholder="Number"
                className="p-2 w-24"
                onChange={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();

                  node.minValue = event.target.value;

                  useStore.setState({
                    nodesList: useStore.getState().nodesList.map((n) => {
                      let nn = { ...n };
                      if (nn.oid === node.oid) {
                        nn = { ...node };
                      }
                      delete nn.children;
                      return nn;
                    }),
                  });
                  clearTimeout(tt.current);
                  tt.current = setTimeout(() => {
                    useStore.getState().graphCmd.updateAgapeNode({ node });
                  }, 150);
                }}
              ></input>
            </div>

            <div className="w-44 bg-transparent flex justify-between items-center text-xs ">
              <span className=" inline-flex">Max Value:</span>
              <input
                type={"number"}
                step={0.001}
                value={node.maxValue}
                placeholder="Number"
                className="p-2 w-24"
                onChange={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();

                  node.maxValue = event.target.value;

                  useStore.setState({
                    nodesList: useStore.getState().nodesList.map((n) => {
                      let nn = { ...n };
                      if (nn.oid === node.oid) {
                        nn = { ...node };
                      }
                      delete nn.children;
                      return nn;
                    }),
                  });
                  clearTimeout(tt.current);
                  tt.current = setTimeout(() => {
                    useStore.getState().graphCmd.updateAgapeNode({ node });
                  }, 150);
                }}
              ></input>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export function Runtime({ api, node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();

  useEffect(() => {
    if (node.numberValue) {
      api.out0(node.numberValue);
    }
    return () => {};
  }, [node.numberValue]);

  return (
    <group>
      {/*  */}

      {/*  */}
    </group>
  );
}

//
