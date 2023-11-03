import { Html } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCore } from "../../../Runtime/useCore";
import { useThree } from "@react-three/fiber";
import { Color, MeshPhysicalMaterial } from "three";
import { getID } from "../../../Runtime/getID";
//
export function Register({ AgapeNodes }) {
  useEffect(() => {
    let sample = make();
    AgapeNodes.find((r) => r.key === sample.nodeType).makerFactory = make;
  }, []);
  return <></>;
}

let make = () => ({
  oid: getID(),
  nodeType: "applyMaterial",
  nodeCategory: "scene",
  title: "applyMaterial",
  projectID: "",
  oidParent: "",
  socketInputs: [
    {
      oid: getID(),
      io: "input",
      label: "material",
    },
  ],
  socketOutputs: [
    // {
    //   oid: getID(),
    //   io: "output",
    //   label: "object3d",
    // },
  ],
  position: [0, 0, 0],
});

// //
export function NodeGUI({ node, useStore }) {
  node.searchObjectName = node.searchObjectName || "";

  let tt = useRef(0);

  let inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = node.searchObjectName;
    }
  }, [node.searchObjectName]);

  return (
    <group>
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

                    //
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

export function Runtime({ api, node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();

  let scene = useThree((r) => r.scene);

  let cache = useMemo(() => {
    return new Map();
  }, []);
  let provideTexture = useCallback(
    (url) => {
      //
      if (cache.has(url)) {
        //
        let stuff = cache.get(url);
        return stuff.clone();
      }

      cache.set(url, new TextureLoader().load(url));
      let stuff = cache.get(url);
      return stuff.clone();
    },
    [cache]
  );
  let applyMaterial = useCallback(
    (found = [], spec = {}) => {
      found.forEach((it) => {
        if (!it.origMat) {
          let cloned = it.material.clone();
          it.origMat = new MeshPhysicalMaterial({
            color: cloned.color || new Color("#ffffff"),
            map: cloned.map || null,

            normalMap: cloned.normalMap || null,

            emissive: cloned.emissive || new Color("#000000"),
            emissiveMap: cloned.emissiveMap || null,

            metalness: cloned.metalness || 0,
            metalnessMap: cloned.metalnessMap || null,

            roughness: cloned.roughness || 0,
            roughnessMap: cloned.roughnessMap || null,

            transmission: cloned.transmission || 0,
            transmissionMap: cloned.transmissionMap || null,

            thickness: cloned.thickness || 0,
            thicknessMap: cloned.thicknessMap || null,
          });
        }

        if (it.origMat) {
          it.material = it.origMat.clone();
        }

        if (it.material) {
          if (typeof spec.color !== "undefined") {
            it.material.color = new Color(spec.color);
          }

          if (typeof spec.map !== "undefined") {
            it.material.map = provideTexture(spec.map);
          }

          if (typeof spec.normalMap !== "undefined") {
            it.material.normalMap = spec.normalMap;
          }

          if (typeof spec.emissive !== "undefined") {
            it.material.emissive = new Color(spec.emissive);
          }
          if (typeof spec.emissiveMap !== "undefined") {
            it.material.emissiveMap = provideTexture(spec.emissiveMap);
          }

          if (typeof spec.metalness !== "undefined") {
            it.material.metalness = spec.metalness;
          }
          if (typeof spec.metalnessMap !== "undefined") {
            it.material.metalnessMap = provideTexture(spec.metalnessMap);
          }

          if (typeof spec.roughness !== "undefined") {
            it.material.roughness = spec.roughness;
          }
          if (typeof spec.roughnessMap !== "undefined") {
            it.material.roughnessMap = provideTexture(spec.roughnessMap);
          }

          if (typeof spec.transmission !== "undefined") {
            it.material.transmission = spec.transmission;
          }
          if (typeof spec.transmissionMap !== "undefined") {
            it.material.transmissionMap = provideTexture(spec.transmissionMap);
          }

          if (typeof spec.thickness !== "undefined") {
            it.material.thickness = spec.thickness;
          }
          if (typeof spec.thicknessMap !== "undefined") {
            it.material.thicknessMap = provideTexture(spec.thicknessMap);
          }
        }
      });
    },
    [node]
  );

  let [found, setFound] = useState([]);

  let scan = () => {
    setFound([]);
    let tt = setInterval(() => {
      let name = node.searchObjectName;

      if (!name) {
        return;
      }

      let found = [];

      scene?.traverse((it) => {
        if (it.name.indexOf(node.searchObjectName) === 0 && it.material) {
          found.push(it);
        }
      });

      if (found.length > 0) {
        clearInterval(tt);
        setFound([...found]);
      }
    });

    return {
      tt,
    };
  };
  useEffect(() => {
    let { tt } = scan();
    return () => {
      clearInterval(tt);
    };
  }, [scene, node.searchObjectName]);

  let [_, setSpec] = useState(false);
  useEffect(() => {
    return api.in0((data) => {
      console.log(data);
      node.materialSpec = data.spec;
      setSpec(node.materialSpec);
    });
  }, [api, node]);

  // apply material
  useEffect(() => {
    if (found && found.length > 0 && node.materialSpec) {
      applyMaterial(found || [], node.materialSpec || {});
      console.log("found", found);

      return () => {
        found.forEach((it) => {
          if (it.origMat && it.material) {
            it.material = it.origMat.clone();
          }
        });
      };
    }
  }, [found, node.materialSpec]);

  return (
    <group>
      {/* <Box position={[0, 1, 0]} ref={ref}></Box> */}
      {/**/}
    </group>
  );
}

//
