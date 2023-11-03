import { Html, Sphere, Box } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCore } from "../../../Runtime/useCore";
import { useThree } from "@react-three/fiber";
import { Pane } from "tweakpane";
import { DoubleSide } from "three";

const getID = () => {
  return "_" + Math.random().toString(36).slice(2, 9);
};

export function Register({ AgapeNodes }) {
  useEffect(() => {
    let sample = makerFactory({});
    AgapeNodes.find((r) => r.key === sample.nodeType).makerFactory =
      makerFactory;
  }, []);
  return <></>;
}
//

//
const makerFactory = ({
  projectID = "",
  oidParent = "",
  position = [0, 0, 0],
}) => {
  return {
    oid: getID(),
    nodeType: "inheritancePhysicalMaterial",
    nodeCategory: "scene",
    title: "inheritancePhysicalMaterial",
    projectID: projectID,
    oidParent: oidParent,
    socketInputs: [
      {
        oid: getID(),
        io: "input",
        label: "material",
      },

      {
        oid: getID(),
        io: "input",
        label: "color",
      },
      {
        oid: getID(),
        io: "input",
        label: "map",
      },
      {
        oid: getID(),
        io: "input",
        label: "emissive",
      },
      {
        oid: getID(),
        io: "input",
        label: "emissiveMap",
      },
      {
        oid: getID(),
        io: "input",
        label: "roughness",
      },
      {
        oid: getID(),
        io: "input",
        label: "roughnessMap",
      },
      {
        oid: getID(),
        io: "input",
        label: "metalness",
      },
      {
        oid: getID(),
        io: "input",
        label: "metalnessMap",
      },
      {
        oid: getID(),
        io: "input",
        label: "transmission",
      },
      {
        oid: getID(),
        io: "input",
        label: "transmissionMap",
      },
      {
        oid: getID(),
        io: "input",
        label: "thickness",
      },
      {
        oid: getID(),
        io: "input",
        label: "thicknessMap",
      },
      {
        oid: getID(),
        io: "input",
        label: "ior",
      },
      {
        oid: getID(),
        io: "input",
        label: "reflectivity",
      },
      {
        oid: getID(),
        io: "input",
        label: "lightMap",
      },
    ],
    socketOutputs: [
      {
        oid: getID(),
        io: "output",
        label: "material",
      },
    ],
    position: position,
  };
};

export function PanelGUI({ node, save, refresh, useStore }) {
  //
  // let mounter = useRef();

  // useEffect(() => {
  //   const pane = new Pane({
  //     container: mounter.current,
  //     title: "Inheritance Physical Material",
  //   });
  //   pane.containerElem_.style.userSelect = "none";
  //   pane.containerElem_.style.width = "100%";

  //   pane.on("change", (ev) => {
  //     const { presetKey } = ev;
  //     node[presetKey] = ev.value;
  //     save({ node });
  //   });

  //   node.color = node.color || "#ffffff";
  //   pane.addInput(node, "color", {
  //     view: "color",
  //   });

  //   node.emissive = node.emissive || "#000000";
  //   pane.addInput(node, "emissive", {});

  //   node.roughness = node.roughness || 0;
  //   pane.addInput(node, "roughness", {
  //     min: 0,
  //     max: 1,
  //   });

  //   node.metalness = node.metalness || 0;
  //   pane.addInput(node, "metalness", {
  //     min: 0,
  //     max: 1,
  //   });

  //   node.transmission = node.transmission || 0;
  //   pane.addInput(node, "transmission", {
  //     min: 0,
  //     max: 1,
  //   });

  //   node.thickness = node.thickness || 0;
  //   pane.addInput(node, "thickness", {
  //     min: 0,
  //     max: 30,
  //   });

  //   return () => {
  //     pane.dispose();
  //   };
  // }, [node]);

  return (
    <div>
      <div className="p-3">{/* <div ref={mounter}></div> */}</div>
    </div>
  );
}

export function NodeGUI({ node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();

  let tt = useRef(0);
  useEffect(() => {
    clearTimeout(tt.current);
    tt.current = setTimeout(() => {
      useStore.getState().graphCmd.updateAgapeNode({ node });
    }, 150);

    return () => {
      clearTimeout(tt.current);
    };
  }, [node]);

  return (
    <group>
      {/*  */}
      <group>
        <Sphere scale={1} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color={node.color || "#ffffff"}
            emissive={node.emissive || "#000000"}
            roughness={node.roughness || 0}
            metalness={node.metalness || 0}
            transmission={node.transmission || 0}
            thickness={node.thickness || 0}
          ></meshPhysicalMaterial>
        </Sphere>
      </group>
    </group>
  );
}

export function Runtime({ api, node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();
  let scene = useThree((r) => r.scene);

  useEffect(() => {
    return api.in__material((data) => {
      // console.log(data);
    });
  }, [api]);

  let send = () => {
    api.out0({
      spec: {
        color: node.color,
        emissive: node.emissive,
        roughness: node.roughness,
        metalness: node.metalness,
        transmission: node.transmission,
        thickness: node.thickness,
      },
    });
  };

  let refreshByNode = ({ node }) => {
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
    send();
  };

  useEffect(() => {
    send();
  }, [node]);

  useEffect(() => {
    return api.in__color((data) => {
      node.color = data;
      refreshByNode({ node });
    });
  }, [api]);

  useEffect(() => {
    return api.in__emissive((data) => {
      node.emissive = data;
      refreshByNode({ node });
    });
  }, [api]);
  useEffect(() => {
    return api.in__roughness((data) => {
      node.roughness = data;
      refreshByNode({ node });
    });
  }, [api]);

  useEffect(() => {
    return api.in__metalness((data) => {
      node.metalness = data;
      refreshByNode({ node });
    });
  }, [api]);

  useEffect(() => {
    return api.in__transmission((data) => {
      node.transmission = data;
      refreshByNode({ node });
    });
  }, [api]);

  useEffect(() => {
    return api.in__thickness((data) => {
      node.thickness = data;
      refreshByNode({ node });
    });
  }, [api]);

  return (
    <group>
      {/*  */}

      {/*  */}

      {/*  */}
    </group>
  );
}

//
