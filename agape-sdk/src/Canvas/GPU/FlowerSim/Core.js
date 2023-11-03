import { Object3D } from "three";
import { TJCore } from "./TJCore";

export const Core = new TJCore({ name: "thank you jesus" });

Core.now.goToPlace = new Object3D();
Core.now.goToPlace.visible = false;
Core.now.avatarAct = "standing";

export class O3D extends Object3D {
  constructor({ name = "o3d", ...props }) {
    super({ name, ...props });
    let { sub, dispose } = Core.makeDisposableNode({ name });
    this.core = sub;
    this.dispose = () => {
      dispose();
    };
  }
}

export class Core3D extends Object3D {
  constructor(name = "Core3D") {
    super();

    //
  }
}
