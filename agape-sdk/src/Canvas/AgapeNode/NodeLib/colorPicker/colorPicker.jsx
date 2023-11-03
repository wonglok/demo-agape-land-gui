import { Box, Html, Sphere } from "@react-three/drei";
import { useCore } from "../../Runtime/useCore";
import { useEffect, useRef } from "react";

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
    nodeType: "colorPicker",
    nodeCategory: "input",
    title: "colorPicker",
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
        label: "color",
      },
    ],
    position: position,
  };
};

export function NodeGUI({ node, useStore }) {
  node.color = node.color || "#ffffff";

  let tt = useRef(0);

  let inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = node.color;
    }
  }, [node.color]);

  return (
    <group>
      <Html center>
        <div>
          <div className="bg-white">
            <input
              useRef={inputRef}
              type={"color"}
              defaultValue={node.color}
              placeholder="Color Picker"
              onChange={(event) => {
                event.stopPropagation();
                event.nativeEvent.stopImmediatePropagation();

                node.color = event.target.value;

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
      </Html>
      <Sphere scale={0.5}>
        <meshStandardMaterial
          metalness={0.5}
          roughness={0.5}
          color={node.color}
        ></meshStandardMaterial>
      </Sphere>
    </group>
  );
}

export function Runtime({ api, node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();

  useEffect(() => {
    if (node.color) {
      api.out0(node.color);
    }
    return () => {};
  }, [node.color]);

  return (
    <group>
      {/*  */}

      {/*  */}
    </group>
  );
}

//
export { makerFactory };
