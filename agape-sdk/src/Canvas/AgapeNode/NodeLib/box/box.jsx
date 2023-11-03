import { Box, Html, Sphere } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useCore } from "../../Runtime/useCore";
import { Color } from "three";

export function Register({ AgapeNodes }) {
  useEffect(() => {
    let sample = makerFactory({});
    AgapeNodes.find((r) => r.key === sample.nodeType).makerFactory =
      makerFactory;
  }, []);
  return <></>;
}

const getID = () => {
  return "_" + Math.random().toString(36).slice(2, 9);
};

const makerFactory = ({
  projectID = "",
  oidParent = "",
  position = [0, 0, 0],
}) => {
  return {
    oid: getID(),
    nodeType: "box",
    nodeCategory: "object",
    title: "box",
    projectID: projectID,
    oidParent: oidParent,
    socketInputs: [
      {
        oid: getID(),
        io: "input",
        label: "color",
      },
    ],
    socketOutputs: [
      // {
      //   oid: getID(),
      //   io: "output",
      //   label: "color",
      // },
    ],
    position: position,
  };
};

export function NodeGUI({ node, useStore }) {
  return <group>{/*  */}</group>;
}

export function Runtime({ api, node, useStore }) {
  let { onLoop, onClean, useCoreStore } = useCore();
  let ref = useRef();

  useEffect(() => {
    return api.in0((data) => {
      console.log("in0", data);

      ref.current.material.color = new Color(data);
    });
  }, []);

  useEffect(() => {
    onLoop((dt, et) => {
      if (ref.current) {
        ref.current.rotation.y += dt;
      }
    });
  }, []);

  return (
    <group>
      <Sphere position={[0, 1, 0]} ref={ref}></Sphere>
      {/**/}
    </group>
  );
}
