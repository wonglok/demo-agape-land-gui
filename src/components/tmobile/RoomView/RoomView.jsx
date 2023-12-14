import { useEffect } from "react";
// import { LoaderGLB } from "../../../main.jsx";
// import { MetaverseGLB } from "../../../main.jsx";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMeta } from "./useMeta.js";

export function RoomView({ useStore }) {
  let colliderGLBURL = useStore((r) => r.colliderGLBURL);
  let gl = useThree((s) => s.gl);
  return (
    <group>
      {colliderGLBURL && (
        <LoaderGLB
          url={`${colliderGLBURL}`}
          decorate={({ glb }) => {
            glb.scene.traverse((it) => {
              if (it.isLight) {
                it.visible = false;
              }
            });
          }}
          animate={true}
          WhenDone={function Done({ glb }) {
            return (
              <>
                <OrbitControls
                  makeDefault
                  domElement={gl.domElement}
                  zoomSpeed={1}
                ></OrbitControls>
                <MetaverseGLB
                  glb={glb}
                  offsetY={1}
                  WhenReady={function Yo() {
                    glb.scene.traverse((it) => {
                      it.castShadow = true;
                      it.receiveShadow = true;
                    });

                    useEffect(() => {
                      useStore.setState({
                        colliderGLBObjectSrc: colliderGLBURL,
                      });

                      setTimeout(() => {
                        if (useMeta.getState()?.game) {
                          useMeta.getState()?.game.reset();
                        }
                      }, 100);
                    }, [glb]);

                    return (
                      <>
                        <primitive object={glb.scene}></primitive>
                      </>
                    );
                  }}
                  resetAt={[0, 1.5, 0]}
                ></MetaverseGLB>
              </>
            );
          }}
        ></LoaderGLB>
      )}
    </group>
  );
}
