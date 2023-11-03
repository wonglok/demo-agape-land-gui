import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Color, PointLight } from "three";
export function MyPointLight({ node, children }) {
  let pt = useMemo(() => {
    let pl = new PointLight(
      new Color(node.color),
      node.intensity,
      node.distance,
      node.decay
    );
    return pl;
  }, [node]);

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

        pt.power = node.power;
        pt.intensity = node.intensity;
        pt.decay = node.decay;
        pt.distance = node.distance;

        pt.castShadow = node.castShadow;
        if (node.castShadow) {
          //Set up shadow properties for the light
          pt.shadow.mapSize.width = 512; // default
          pt.shadow.mapSize.height = 512; // default
          pt.shadow.camera.near = 0.5; // default
          pt.shadow.camera.far = 500; // default
          pt.shadow.bias = -0.01;
          pt.shadow.blurSamples = 4;
        }
      }
    }

    //
    // console.log(thisOne);
  });

  //
  return <primitive object={pt}></primitive>;
}
