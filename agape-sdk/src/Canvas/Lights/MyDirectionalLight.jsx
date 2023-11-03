import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Color, DirectionalLight } from "three";
export function MyDirectionalLight({ node, children }) {
  let pt = useMemo(() => {
    let pl = new DirectionalLight(new Color(node.color), node.intensity);
    return pl;
  }, [node]);

  //
  useFrame(() => {
    if (pt) {
      if (node) {
        //

        // pt.position.fromArray(node.position);
        // pt.rotation.fromArray(node.rotation, "XYZ");
        // pt.scale.x = node.scale[0];
        // pt.scale.y = node.scale[1];
        // pt.scale.z = node.scale[2];

        pt.color.set(node.color || "#ffffff");

        pt.intensity = node.intensity;

        pt.castShadow = node.castShadow;
      }
    }
  });

  //
  return <primitive object={pt}></primitive>;
}

//
