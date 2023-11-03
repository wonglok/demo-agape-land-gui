// import { toTree } from "../../../entry/treeWithArray";
import { useEffect, useMemo } from "react";
import { OneRuntimeEdge } from "./OneRuntimeEdge.jsx";
import { OneRuntimeNode } from "./OneRuntimeNode.jsx";
import { useCore } from "./useCore.jsx";

export function AgapeNodeRuntime({ useStore }) {
  let seed = useMemo(() => {
    return "_" + Math.random().toString(36).slice(2, 9);
  }, []);

  // let nodesList = useStore((r) => r.nodesList) || [];
  // let edgesList = useStore((r) => r.edgesList) || [];
  // let nodesIDList = nodesList.map((r) => r.oid).join("_");
  // let edgesIDList = edgesList.map((r) => r.oid).join("_");

  return (
    <group>
      <Edges useStore={useStore} seed={seed}></Edges>
      <Nodes useStore={useStore} seed={seed}></Nodes>
    </group>
  );
}

function Nodes({ seed, useStore }) {
  let nodesList = useStore((r) => r.nodesList) || [];

  let readyStatus = useMemo(() => {
    return {
      total: nodesList.length,
      registry: new Map(),
      get current() {
        return this.registry.size;
      },
    };
  }, [nodesList.length]);

  return (
    <group>
      {nodesList.map((t, i) => {
        return (
          <OneRuntimeNode
            readyStatus={readyStatus}
            nodesList={nodesList}
            seed={seed}
            useStore={useStore}
            key={t.oid}
            node={t}
          ></OneRuntimeNode>
        );
      })}
    </group>
  );
}

function Edges({ seed, useStore }) {
  let edgesList = useStore((r) => r.edgesList) || [];

  return (
    <group>
      {edgesList.map((r, i) => {
        return (
          <group key={r.oid}>
            <OneRuntimeEdge
              seed={seed}
              edge={r}
              useStore={useStore}
            ></OneRuntimeEdge>
          </group>
        );
      })}
    </group>
  );
}
