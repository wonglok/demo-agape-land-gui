import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  Vector2,
  Vector3,
  FrontSide,
  Color,
  BoxGeometry,
  PlaneGeometry,
  CircleGeometry,
  TextureLoader,
  RepeatWrapping,
} from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

export function MyWaterSurface({ node }) {
  let [primmi, setPrimi] = useState(null);

  let geo = useMemo(() => {
    node.radius = node.radius || 1000;
    node.segment = node.segment || 128;
    const waterGeometry = new CircleGeometry(node.radius, node.segment);

    return waterGeometry;
  }, [node.radius, node.radius, node.segment]);

  let waterNormals = useMemo(() => {
    return new TextureLoader().load(`/agape-sdk/tex/waternormals.jpg`, (t) => {
      t.wrapS = t.wrapT = RepeatWrapping;
    });
  }, []);

  useEffect(() => {
    node.flowDirection = node.flowDirection || [10, 10];
    node.sunDirection = node.sunDirection || [0.70707, 0.70707, 0.0];
    let water = new Water(geo, {
      color: new Color("#ffffff"),
      scale: 1,
      flowDirection: new Vector2(10, 10).fromArray(node.flowDirection),
      textureWidth: 1024,
      textureHeight: 1024,
      clipBias: 0.0,
      alpha: 1.0,
      time: 1,
      waterNormals: waterNormals,
      sunDirection: new Vector3(0.70707, 0.70707, 0.0).fromArray(
        node.sunDirection
      ),
      sunColor: new Color(node.sunColor),
      distortionScale: node.distortionScale || 0,
      side: FrontSide,
    });

    console.log(node);
    water.rotation.x = Math.PI * -0.5;

    setPrimi({ obj: water, compos: <primitive object={water}></primitive> });
  }, [
    geo,
    waterNormals,
    node,
    node.color,
    node.sunColor,
    node.sunDirection,
    node.flowDirection,
    node.distortionScale,
  ]);

  useFrame((st, dt) => {
    if (primmi?.obj?.material?.uniforms?.time?.value) {
      primmi.obj.material.uniforms.time.value = performance.now() / 1000;
    }
  });
  return (
    <group>
      {/*  */}

      {primmi && primmi.compos}

      {/*  */}
    </group>
  );
}
