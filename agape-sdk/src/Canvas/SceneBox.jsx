import { Box, PivotControls, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Matrix4, Vector3, Quaternion } from "three";
export function SceneBox({ scene = [] }) {
  return (
    <>
      {scene.map((r) => {
        return <Recursive key={r.oid} node={r}></Recursive>;
      })}
    </>
  );
}

function Recursive({ node }) {
  let kid = () => {
    return (
      <>
        {node.children &&
          node.children.map((ch) => {
            return <Recursive key={ch.oid} node={ch}></Recursive>;
          })}
      </>
    );
  };

  let refGP = useRef();
  useFrame(({ scene }) => {
    if (refGP.current) {
      refGP.current.position.fromArray(node.position);
      refGP.current.rotation.fromArray(node.rotation);
      refGP.current.scale.fromArray(node.scale);

      // let found = scene.getObjectByName(`_inside_${node.oid}`);
      // if (found && found.geometry) {
      //   if (!found.geometry.boundingSphere) {
      //     found.geometry.computeBoundingSphere();
      //   }
      //   found.scale.multiplyScalar(found.geometry.boundingSphere.radius);
      // }
    }
  });

  return (
    <>
      <group name={`_virtual_gp_${node.oid}`} userData={{ node }} ref={refGP}>
        <group userData={{ node }}>
          <Sphere
            args={[1, 4, 1]}
            scale={[2, 2, 2]}
            node={node}
            userData={{ node }}
          >
            <meshBasicMaterial
              color={"#ff0000"}
              wireframe={true}
              transparent={true}
            ></meshBasicMaterial>
          </Sphere>
        </group>

        {kid()}
      </group>
    </>
  );
}
