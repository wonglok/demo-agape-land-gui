import { useEffect, useMemo } from "react";
import { AgapeNodes } from "./AgapeNodes";
import { LokChannel } from "./LokChannel";

export function OneRuntimeNode({ readyStatus, seed, node, useStore }) {
  let api = useMemo(() => {
    return new Proxy(
      {},
      {
        get: (obj, key) => {
          if (key.indexOf("out") === 0 && typeof Number(key[3]) === "number") {
            let ak = `${seed}-${node.oid}-${key}`;

            let bc = new LokChannel(ak);

            return (data) => {
              let ttt = setInterval(() => {
                if (readyStatus.current === readyStatus.total) {
                  clearInterval(ttt);
                  bc.postMessage(data);

                  setTimeout(() => {
                    bc.close();
                  });
                }
              });
            };
          }

          if (key.indexOf("in__") === 0 && typeof key[4] === "string") {
            let name = key.replace("in__", "");

            let idx = node.socketInputs.findIndex((r) => r.label === name);
            let ak = `${seed}-${node.oid}-in${idx}`;

            let bc = new LokChannel(ak);
            return (fnc) => {
              bc.onMessage((data) => {
                fnc(data);
              });

              return () => {
                bc.close();
              };
            };
          }

          if (key.indexOf("in") === 0 && typeof Number(key[2]) === "number") {
            let ak = `${seed}-${node.oid}-${key}`;

            let bc = new LokChannel(ak);
            return (fnc) => {
              bc.onMessage((data) => {
                fnc(data);
              });

              return () => {
                bc.close();
              };
            };
          }
        },
      }
    );
  }, [node.oid, seed, readyStatus]);

  let agape = AgapeNodes.find((r) => r.name === node.nodeType);

  useEffect(() => {
    if (!readyStatus) {
      return;
    }
    setTimeout(() => {
      readyStatus.registry.set(node.oid, true);
      if (readyStatus.current === readyStatus.total) {
      }
    }, 25);
  }, [readyStatus, node.oid]);

  return (
    <>
      {agape && api && node && agape.Runtime && useStore && (
        <agape.Runtime
          api={api}
          node={node}
          useStore={useStore}
        ></agape.Runtime>
      )}
    </>
  );
}
