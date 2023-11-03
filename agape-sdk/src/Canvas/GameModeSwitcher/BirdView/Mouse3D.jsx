import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MeshBVH } from "three-mesh-bvh";
// import { NoodleEmitter } from '../NoodleEmitter/NoodleEmitter'
// import { Noodle } from './Noodle'
export function Mouse3D({ collider, mouse3d }) {
  let mouser = useRef({ isDown: false });

  useFrame(({ raycaster, mouse, camera, controls }, dt) => {
    //
    if (collider.geometry) {
      // if ('ontouchstart' in window) {
      //   mouse.x = 0
      //   mouse.y = 0
      // }
      raycaster.setFromCamera(mouse, camera);

      /** @type {MeshBVH} */
      let bvh = collider.geometry.boundsTree;
      let res = bvh.raycastFirst(raycaster.ray);

      if (res) {
        if (mouse3d && mouser.current.isDown) {
          mouse3d.position.copy(res.point);
          mouse3d.position.addScaledVector(res.face.normal, 1.0);
        }
      }
    }

    //
  });

  // let get = useThree((s) => s.get)
  let gl = useThree((s) => s.gl);

  let camera = useThree((s) => s.camera);
  let mouse = useThree((s) => s.mouse);
  let raycaster = useThree((s) => s.raycaster);
  useEffect(() => {
    let h = () => {
      mouser.current.isDown = true;
    };
    let h2 = () => {
      mouser.current.isDown = false;
    };

    let tt = setInterval(() => {
      if (mouser.current.isDown) {
        window.dispatchEvent(
          new CustomEvent("shockwave", {
            detail: { positionArray: mouse3d.position.toArray() },
          })
        );
      }
    }, 2000);

    let h3 = () => {
      // let { raycaster, mouse, camera } = get()
      if (collider.geometry) {
        // if ('ontouchstart' in window) {
        //   mouse.x = 0
        //   mouse.y = 0
        // }
        raycaster.setFromCamera(mouse, camera);

        /** @type {MeshBVH} */
        let bvh = collider.geometry.boundsTree;
        let res = bvh.raycastFirst(raycaster.ray);

        if (res) {
          mouse3d.position.copy(res.point);
          mouse3d.position.addScaledVector(res.face.normal, 1.0);

          mouse3d.position.lerp(mouse3d.position, 1);

          window.dispatchEvent(
            new CustomEvent("shockwave", {
              detail: { positionArray: mouse3d.position.toArray() },
            })
          );
          console.log(mouse3d.position.toArray());
        }
      }
    };
    gl.domElement.addEventListener("click", h3);
    gl.domElement.addEventListener("mousedown", h);
    gl.domElement.addEventListener("mouseup", h2);
    gl.domElement.addEventListener("touchstart", h);
    gl.domElement.addEventListener("touchend", h2);

    return () => {
      clearInterval(tt);
      gl.domElement.removeEventListener("click", h3);
      gl.domElement.removeEventListener("mousedown", h);
      gl.domElement.removeEventListener("mouseup", h2);
      gl.domElement.removeEventListener("touchstart", h);
      gl.domElement.removeEventListener("touchend", h2);
    };
  }, [camera, collider.geometry, gl, mouse, mouse3d.position, raycaster]);

  return <group></group>;
}
