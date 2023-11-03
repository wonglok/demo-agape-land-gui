import { useEffect } from "react";
import { LokChannel } from "./LokChannel";

export function OneRuntimeEdge({ seed, useStore, edge }) {
  useEffect(() => {
    let inbound = new LokChannel(
      `${seed}-${edge.inputNodeID}-in${edge.inputSocketIDX}`
    );
    let outbound = new LokChannel(
      `${seed}-${edge.outputNodeID}-out${edge.outputSocketIDX}`
    );

    outbound.onMessage((data) => {
      inbound.postMessage(data);
    });
    return () => {
      //
      outbound.close();
      inbound.close();
    };
  }, [seed, edge]);

  return (
    <>
      {/*  */}

      {/*  */}
    </>
  );
}
