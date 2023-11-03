import { create } from "zustand";
import { useMemo, useEffect } from "react";

export function SceneContent({ ReadyCompos = () => null, initData }) {
  let useStore = useMemo(() => {
    return create((set, get) => {
      return {
        //
      };
    });
  }, []);

  useEffect(() => {
    if (initData && useStore) {
      useStore.setState(initData);
    }
  }, [useStore, initData]);

  return <>{<ReadyCompos useStore={useStore}></ReadyCompos>}</>;
}

//

//
