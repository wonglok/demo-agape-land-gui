import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useCore } from "../../Runtime/useCore";
import { useThree } from "@react-three/fiber";

//
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
    nodeCategory: "scene",
    nodeType: "searchScene",
    title: "searchScene",

    oid: getID(),

    projectID: projectID,
    oidParent: oidParent,
    position: position,

    socketInputs: [
      {
        oid: getID(),
        io: "input",
        label: "objectName",
      },
    ],
    socketOutputs: [
      {
        oid: getID(),
        io: "output",
        label: "object3d",
      },
    ],
  };
};

//

export function NodeGUI({ node, useStore }) {
  node.searchObjectName = node.searchObjectName || "#ffffff";

  let tt = useRef(0);

  let inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = node.searchObjectName;
    }
  }, [node.searchObjectName]);

  return (
    <group>
      {/*  */}

      <Html center>
        <div>
          <input
            type={"text"}
            ref={inputRef}
            defaultValue={node.searchObjectName}
            placeholder="Object Name in Scene"
            className="bg-white p-1 w-28"
            onKeyDownCapture={(event) => {
              event.stopPropagation();
              event.nativeEvent.stopImmediatePropagation();
            }}
            onKeyUpCapture={(event) => {
              event.stopPropagation();
              event.nativeEvent.stopImmediatePropagation();

              node.searchObjectName = event.target.value;

              setTimeout(() => {
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
              });
              clearTimeout(tt.current);
              tt.current = setTimeout(() => {
                useStore.getState().graphCmd.updateAgapeNode({ node });
              }, 150);
            }}
          ></input>
        </div>
      </Html>
    </group>
  );
}

export function Runtime({ api, node }) {
  let { onLoop, onClean, useCoreStore } = useCore();
  let scene = useThree((r) => r.scene);

  useEffect(() => {
    let tt = setInterval(() => {
      let name = node.searchObjectName;

      if (!name) {
        return;
      }
      let found = scene?.getObjectByName(name);
      if (found) {
        clearInterval(tt);
        api.out0(found);
        console.log("found", found);
      }
    });

    return () => {};
  }, [scene, node.searchObjectName]);

  //

  return (
    <group>
      {/* <Box position={[0, 1, 0]} ref={ref}></Box> */}
      {/**/}
    </group>
  );
}

//
