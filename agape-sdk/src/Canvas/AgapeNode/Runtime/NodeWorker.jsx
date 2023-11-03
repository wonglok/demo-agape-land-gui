import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Clock } from "three";
export function NodeWorker({ node, useStore }) {
  let core = useMemo(() => {
    let core = {
      works: [],
      cleans: [],
      onLoop: (v) => {
        core.works.push(v);
      },
      onClean: (v) => {
        core.cleans.push(v);
      },
      rafID: 0,
      dispose: () => {},
    };

    return core;
  }, []);

  useFrame((st, dt) => {
    core.works.forEach((w) => {
      w(st, dt);
    });
  });
  useEffect(() => {
    return () => {
      core.cleans.forEach((r) => r());
    };
  }, [core]);

  let [worker, setWorker] = useState(null);
  useEffect(() => {
    if (!core) {
      return;
    }

    //

    let url = new Blob(
      [
        /* jsx */ `
          let loops = []
          let onLoop = (v) => {
            loops.push(v)
          }

          let onReady = () => {
            self.postMessage({ callType:"workerReady", rpcFunc: '', rpcArgs: {} })
          }

          ${node.codeDetail}

          onLoop((data, dt) => {
            //


          })
          self.onmessage = (e) => {
            let callType = e?.data?.callType
            if (callType === 'toWorkerFrame') {
              loops.forEach((l) => {l(e.data, e.data.dt)})
            }
          }
        `,
      ],
      { type: "text/javascript" }
    );

    let worker = new Worker(URL.createObjectURL(url), { type: "classic" });

    core.onLoop((st, dt) => {
      worker.postMessage({ callType: "toWorkerFrame", dt: dt });
    });

    let clock = new Clock();
    let rpc = {
      //
    };
    worker.onmessage = (e) => {
      if (e.data.callType === "toMainFrame") {
        //
        let fnc = rpc[e.data.rpcFunc];
        if (typeof fnc === "function") {
          fnc({ ...(e?.data?.rpcArgs || {}), dt: clock.getDelta() });
        }
      }
      if (e.data.callType === "workerReady") {
        //
        let fnc = rpc[e.data.rpcFunc];
        if (typeof fnc === "function") {
          fnc({ ...(e?.data?.rpcArgs || {}), dt: clock.getDelta() });
        }
      }
    };

    setWorker(worker);

    return () => {
      console.log("terminate worker", node);
      worker.terminate();
      setWorker(null);
    };
  }, [core, node.codeDetail]);

  //
  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
  );
}
