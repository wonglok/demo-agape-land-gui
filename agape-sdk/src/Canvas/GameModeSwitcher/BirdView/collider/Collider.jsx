import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { sceneToCollider } from "./sceneToCollider";
import { ColliderCache } from "./ColliderCache";

export function Collider({ scene, YoReady = () => null }) {
  let colldierProm = useMemo(() => {
    if (ColliderCache.has(scene.uuid)) {
      return ColliderCache.get(scene.uuid);
    }

    if (!ColliderCache.has(scene.uuid)) {
      ColliderCache.set(scene.uuid, sceneToCollider({ scene }));
    }

    return ColliderCache.get(scene.uuid);
  }, [scene]);

  let [st, setST] = useState(null);
  useEffect(() => {
    colldierProm.then((v) => {
      setST(v);
    });
  }, [colldierProm, YoReady]);

  return (
    <group>
      {/*  */}

      {st && <YoReady collider={st} />}

      {/*  */}
    </group>
  );
}

//
