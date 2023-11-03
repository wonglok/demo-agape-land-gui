import { LoaderGLB } from "../GameModeSwitcher/BirdView/LoaderGLB";

export function MyGLBLoader({ node, children }) {
  return (
    <>
      <group>
        {node.glbURL && (
          <LoaderGLB
            url={`${node.glbURL}`}
            decorate={({ glb }) => {
              glb.scene.traverse((it) => {
                if (it.isLight) {
                  it.visible = false;
                }
              });

              if (node.shadow) {
                glb.scene.traverse((it) => {
                  it.castShadow = true;
                  it.receiveShadow = true;
                });
              }
            }}
            animate={node.animate}
            WhenDone={({ glb }) => {
              return (
                <>
                  <primitive object={glb.scene}></primitive>
                </>
              );
            }}
          ></LoaderGLB>
        )}
      </group>
    </>
  );
}
