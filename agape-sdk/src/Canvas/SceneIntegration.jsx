import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Sphere } from "@react-three/drei";

import { MyPointLight } from "./Lights/MyPointLight.jsx";
import { MyDirectionalLight } from "./Lights/MyDirectionalLight.jsx";
import { MyWaterSurface } from "./Lights/MyWaterSurface.jsx";
import { MyGLBLoader } from "./Lights/MyGLBLoader.jsx";
import { ParticleEmitter } from "./GPU/ParticleEmitter/ParticleEmitter.jsx";

export function SceneIntegration({ useStore, scene = [] }) {
  let get = useThree((r) => r.get);
  useEffect(() => {
    useStore.setState({ three: get() });
  }, [get]);

  return (
    <>
      {/* {<Weather></Weather>} */}
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
    }
  });

  return (
    <>
      <group
        onClick={(ev) => {
          console.log(ev.object);
        }}
        name={`_gp_${node.oid}`}
        userData={{ node }}
        ref={refGP}
      >
        <group userData={{ node }}>
          {/*  */}

          {node.nodeType === "particleEmitter" && (
            <>
              <ParticleEmitter node={node}></ParticleEmitter>
            </>
          )}

          {node.nodeType === "glb" && (
            <>
              <MyGLBLoader node={node}></MyGLBLoader>
            </>
          )}

          {node.nodeType === "waterSurface" && (
            <>
              <MyWaterSurface node={node}></MyWaterSurface>
            </>
          )}

          {node.nodeType === "pointLight" && (
            <>
              <MyPointLight node={node}></MyPointLight>
            </>
          )}
          {/*
           */}
          {node.nodeType === "dirLight" && (
            <>
              <MyDirectionalLight node={node}></MyDirectionalLight>
            </>
          )}
          {node.nodeType === "demoSphere" && (
            <>
              <Sphere
                name={`_inside_${node.oid}`}
                userData={{ node }}
                args={[0.5, 25, 25]}
              >
                <meshStandardMaterial
                  metalness={1}
                  roughness={0.2}
                ></meshStandardMaterial>
              </Sphere>
            </>
          )}
        </group>

        {kid()}
        {/*  */}
      </group>
    </>
  );
}
