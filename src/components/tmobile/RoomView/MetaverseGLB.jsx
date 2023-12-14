import { useEffect } from "react";
import { YoMeta, useMeta } from "./useMeta.js";
import { useFrame, useThree } from "@react-three/fiber";
import { WalkerCam } from "./WalkerCam.jsx";
// import { Scene } from "three";

export function MetaverseGLB({ glb, initY, offsetY = 1.5, WhenReady }) {
  let camera = useThree((r) => r.camera);
  let gl = useThree((r) => r.gl);
  let game = useMeta((r) => r.game);
  let controls = useThree((r) => r.controls);

  useEffect(() => {
    if (!controls) {
      return;
    }
    if (!glb) {
      return;
    }

    //
    // game.parseScene({ scene: glb.scene }).then(() => {
    //   game.reset()
    // })
    //

    useMeta.setState({
      game: game,
    });

    return () => {
      if (useMeta.getState()?.game) {
        useMeta.getState()?.game.clean();
      }
    };
  }, [camera, offsetY, initY, glb.scene, glb, controls, gl]);

  // useEffect(() => {
  //   if (!game) {
  //     return;
  //   }
  //   if (!glb) {
  //     return;
  //   }
  //   game.parseScene({ scene: glb.scene }).then(() => {
  //     game.reset();
  //   });
  // }, [game, glb.scene]);

  useFrame(() => {
    if (game && game.updatePlayer && typeof game.updatePlayer === "function") {
      game.updatePlayer();
    }
  });

  //
  return (
    <group
    // onClick={(ev) => {
    //   console.log(ev.object.name);
    // }}
    >
      {/* <group>{game && <primitive object={game.player}></primitive>}</group> */}
      {game && (
        <>
          <WalkerCam></WalkerCam>
        </>
      )}

      {typeof WhenReady === "function" && <WhenReady glb={glb}></WhenReady>}
    </group>
  );
}
