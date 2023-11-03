import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Clock, Spherical, Vector3 } from "three";
import { Object3D } from "three";

export class CoreTJ extends Object3D {
  constructor() {
    super();
    this.core = {
      loops: [],
      cleans: [],
      onLoop: (v) => {
        this.core.loops.push(v);
      },
      work: (st, dt) => {
        this.core.loops.forEach((it) => it(st, dt));
      },
      clean: () => {
        this.core.cleans.forEach((t) => t());
        this.core.cleans = [];
        this.core.loops = [];
      },
      onClean: (cl) => {
        this.core.cleans.push(cl);
      },
    };
  }
}

export function AvaZoom({ mounter, mouse3d }) {
  let camera = useThree((s) => s.camera);
  let controls = useThree((s) => s.controls);

  let { ava } = useMemo(() => {
    let ava = new AvaZoomCore({ mounter, controls, mouse3d, camera });

    return { ava };
  }, [camera, controls, mounter, mouse3d]);

  useEffect(() => {
    return () => {
      ava.core.clean();
    };
  }, [ava]);

  useFrame((st, dt) => {
    ava.core.work(st, dt);
  });

  return null;
}

class AvaZoomCore extends CoreTJ {
  constructor({ mounter, controls, mouse3d, camera }) {
    super();
    if (!controls) {
      return;
    }
    this.mouse3d = mouse3d;
    this.camera = camera;
    this.controls = controls;
    this.keyState = {
      fwdPressed: false,
      bkdPressed: false,
      lftPressed: false,
      rgtPressed: false,

      fwdArrowPressed: false,
      bkdArrowPressed: false,
      lftArrowPressed: false,
      rgtArrowPressed: false,

      joyStickDown: false,
      joyStickAngle: 0,
      joyStickVertical: 0,
      joyStickHorizontal: 0,
    };
    this.keyboard = new KeyboardControls({ core: this.core, parent: this });
    this.tempVector = new Vector3();
    this.upVector = new Vector3(0, 1, 0);

    this.globalCameraPos = new Vector3();
    this.deltaRot = new Vector3();
    //////////

    import("nipplejs")
      .then((s) => {
        return s.default;
      })
      .then(async (nip) => {
        let zone = document.createElement("div");
        zone.id = "avacontrols";

        if (document.querySelector("#guilayer")) {
          document.querySelector("#guilayer").appendChild(zone);
        } else if (mounter.current) {
          document.querySelector("#avacontrols")?.remove();
          mounter.current.appendChild(zone);
        } else {
          document.querySelector("#avacontrols")?.remove();
          document.body.appendChild(zone);
        }

        // zone.style.cssText = `
        //   display: flex;
        //   justify-content: center;
        //   align-items:center;
        //   position: absolute;
        //   z-index: 200;
        //   bottom: calc(100px / 2);
        //   left: calc(50% - 100px / 2);
        //   width: 100px;
        //   height: 100px;
        // `

        zone.style.zIndex = "100";
        zone.style.position = "absolute";
        zone.style.display = "flex";
        zone.style.justifyContent = "center";
        zone.style.alignItems = "center";
        zone.style.overflow = "hidden";

        zone.style.left = "25px";
        zone.style.bottom = "25px";
        // zone.style.left = 'calc(50% - 85px / 2)'
        // zone.style.bottom = 'calc(85px / 2)'
        zone.style.width = "calc(85px)";
        zone.style.height = "calc(85px)";
        zone.style.borderRadius = "calc(85px)";
        zone.style.userSelect = "none";
        // zone.style.backgroundColor = 'rgba(0,0,0,1)'=
        // zone.style.backgroundImage = `url(/hud/rot.svg)`
        zone.style.backgroundColor = `rgba(255,255,255, 0.5)`;
        zone.style.backgroundSize = `cover`;
        zone.style.userSelect = `none`;
        zone.innerHTML = `
          <svg width="335px" height="338px" viewBox="0 0 335 338" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="map" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Extra-Large" transform="translate(-294.000000, -142.000000)" stroke="#000000">
                    <g id="Group-3" transform="translate(294.427720, 142.689000)">
                        <g id="Group" transform="translate(167.072280, 168.311000) rotate(34.000000) translate(-167.072280, -168.311000) translate(48.572280, 45.220510)">
                            <ellipse id="Oval" stroke-width="5" cx="118.5" cy="122.590489" rx="116" ry="74"></ellipse>
                            <path d="M173.145931,31.7105193 C175.810677,31.3639828 178.607622,32.0340127 180.905154,33.802747 C181.623453,34.3557237 182.26712,34.9993903 182.820097,35.7176899 L208.969792,69.6853357 C210.738526,71.9828669 211.408556,74.7798123 211.06202,77.4445584 C210.715483,80.1093046 209.35238,82.6418515 207.054849,84.4105859 C205.218808,85.8240463 202.966788,86.5904894 200.649696,86.5904894 L148.350304,86.5904894 C145.45081,86.5904894 142.82581,85.4152368 140.925683,83.5151106 C139.025557,81.6149843 137.850304,78.9899843 137.850304,76.0904894 C137.850304,73.7733968 138.616748,71.521377 140.030208,69.6853357 L166.179903,35.7176899 C167.948638,33.4201587 170.481185,32.0570558 173.145931,31.7105193 Z" id="Triangle" fill="#000000" transform="translate(174.500000, 55.590489) rotate(107.000000) translate(-174.500000, -55.590489) "></path>
                            <path d="M73.1459309,166.710519 C75.8106771,166.363983 78.6076225,167.034013 80.9051537,168.802747 C81.6234533,169.355724 82.2671199,169.99939 82.8200965,170.71769 L108.969792,204.685336 C110.738526,206.982867 111.408556,209.779812 111.06202,212.444558 C110.715483,215.109305 109.35238,217.641852 107.054849,219.410586 C105.218808,220.824046 102.966788,221.590489 100.649696,221.590489 L48.3503044,221.590489 C45.4508095,221.590489 42.8258095,220.415237 40.9256832,218.515111 C39.025557,216.614984 37.8503044,213.989984 37.8503044,211.090489 C37.8503044,208.773397 38.6167475,206.521377 40.0302079,204.685336 L66.1799035,170.71769 C67.9486378,168.420159 70.4811848,167.057056 73.1459309,166.710519 Z" id="Triangle-Copy" fill="#000000" transform="translate(74.500000, 190.590489) scale(-1, -1) rotate(107.000000) translate(-74.500000, -190.590489) "></path>
                        </g>
                    </g>
                </g>
            </g>
            </svg>
        `;

        this.core.onClean(() => {
          zone.remove();
          zone.innerHTML = "";
        });

        this.dynamic = nip.create({
          color: "white",
          zone: zone,
          mode: "dynamic",
        });

        this.dynamic.on("added", (evt, nipple) => {
          this.dynamic.on("start move end dir plain", (evta, data) => {
            if (evta.type === "start") {
              this.keyState.joyStickDown = true;
            }

            let distance = controls.getDistance();
            let speed = 1;

            if (data?.angle?.radian) {
              this.keyState.joyStickVertical = data.vector.y;
              this.keyState.joyStickHorizontal = -data.vector.x;

              if (this.keyState.joyStickVertical <= -0.4) {
                this.keyState.joyStickVertical = -0.4;
              }
              if (this.keyState.joyStickVertical >= 0.4) {
                this.keyState.joyStickVertical = 0.4;
              }

              if (this.keyState.joyStickHorizontal >= 0.4) {
                this.keyState.joyStickHorizontal = 0.4;
              }
              if (this.keyState.joyStickHorizontal <= -0.4) {
                this.keyState.joyStickHorizontal = -0.4;
              }

              // this.keyState.joyStickAngle = data.angle.radian + Math.PI * 1.5
            }

            if (evta.type === "end") {
              this.keyState.joyStickDown = false;
            }
          });
          nipple.on("removed", () => {
            nipple.off("start move end dir plain");
          });

          this.core.onClean(() => {
            nipple.destroy();
          });
        });
      });

    this.spherical = new Spherical();
    let clock = new Clock();
    this.core.onLoop(() => {
      controls.update();

      let delta = clock.getDelta();

      if (delta >= 0.1) {
        delta = 0.1;
      }
      if (this.keyState.joyStickDown) {
        this.spherical.setFromCartesianCoords(
          this.camera.position.x - this.controls.target.x,
          this.camera.position.y - this.controls.target.y,
          this.camera.position.z - this.controls.target.z
        );

        this.spherical.phi += this.keyState.joyStickVertical * -delta * 0.75;
        this.spherical.theta +=
          this.keyState.joyStickHorizontal * -delta * 0.75;

        //
        // this.spherical.radius +=
        //   this.keyState.joyStickVertical * delta * 10.0

        // if (this.spherical.radius <= 0.5) {
        //   this.spherical.radius = 0.5
        // }
        // if (this.spherical.radius >= 50) {
        //   this.spherical.radius = 50
        // }

        if (this.spherical.phi <= 0.03) {
          this.spherical.phi = 0.03;
        }
        if (this.spherical.phi >= Math.PI * 0.5) {
          this.spherical.phi = Math.PI * 0.5;
        }
        this.camera.position.setFromSpherical(this.spherical);
        this.camera.position.add(this.controls.target);

        // controls.object.getWorldPosition(this.globalCameraPos)
        // this.globalCameraPos.y = controls.target.y
        // let dist = controls.target.distanceTo(this.globalCameraPos)

        // this.deltaRot.setFromCylindricalCoords(
        //   dist,
        //   controls.getAzimuthalAngle() +
        //     delta * this.keyState.joyStickHorizontal
        // )

        // let y = camera.position.y
        // camera.position.sub(controls.target)
        // camera.position.copy(this.deltaRot)
        // camera.position.add(controls.target)
        // camera.position.y = y

        // this.tempVector
        //   .set(0, 0, -1)
        //   .applyAxisAngle(
        //     this.upVector,
        //     angle + this.keyState.joyStickAngle
        //   )

        // this.mouse3d.position.addScaledVector(
        //   this.tempVector,
        //   this.mouse3dSpeed *
        //     delta *
        //     this.keyState.joyStickVertical *
        //     0.75
        // )
      }

      if (this.keyState.fwdArrowPressed) {
        this.spherical.setFromCartesianCoords(
          this.camera.position.x - this.controls.target.x,
          this.camera.position.y - this.controls.target.y,
          this.camera.position.z - this.controls.target.z
        );

        this.spherical.phi += -0.5 * delta * 0.75;
        this.spherical.theta += 0 * delta * 0.75;

        if (this.spherical.phi <= 0.03) {
          this.spherical.phi = 0.03;
        }
        if (this.spherical.phi >= Math.PI * 0.5) {
          this.spherical.phi = Math.PI * 0.5;
        }
        this.camera.position.setFromSpherical(this.spherical);
        this.camera.position.add(this.controls.target);
      }

      if (this.keyState.bkdArrowPressed) {
        this.spherical.setFromCartesianCoords(
          this.camera.position.x - this.controls.target.x,
          this.camera.position.y - this.controls.target.y,
          this.camera.position.z - this.controls.target.z
        );

        this.spherical.phi += 0.5 * delta * 0.75;
        this.spherical.theta += 0 * delta * 0.75;

        if (this.spherical.phi <= 0.03) {
          this.spherical.phi = 0.03;
        }
        if (this.spherical.phi >= Math.PI * 0.5) {
          this.spherical.phi = Math.PI * 0.5;
        }
        this.camera.position.setFromSpherical(this.spherical);
        this.camera.position.add(this.controls.target);
      }

      if (this.keyState.lftArrowPressed) {
        this.spherical.setFromCartesianCoords(
          this.camera.position.x - this.controls.target.x,
          this.camera.position.y - this.controls.target.y,
          this.camera.position.z - this.controls.target.z
        );

        this.spherical.phi += -0 * delta * 0.75;
        this.spherical.theta += -0.5 * delta * 0.75;

        if (this.spherical.phi <= 0.03) {
          this.spherical.phi = 0.03;
        }
        if (this.spherical.phi >= Math.PI * 0.5) {
          this.spherical.phi = Math.PI * 0.5;
        }
        this.camera.position.setFromSpherical(this.spherical);
        this.camera.position.add(this.controls.target);
      }
      if (this.keyState.rgtArrowPressed) {
        this.spherical.setFromCartesianCoords(
          this.camera.position.x - this.controls.target.x,
          this.camera.position.y - this.controls.target.y,
          this.camera.position.z - this.controls.target.z
        );

        this.spherical.phi += -0 * delta * 0.75;
        this.spherical.theta += 0.5 * delta * 0.75;

        if (this.spherical.phi <= 0.03) {
          this.spherical.phi = 0.03;
        }
        if (this.spherical.phi >= Math.PI * 0.5) {
          this.spherical.phi = Math.PI * 0.5;
        }
        this.camera.position.setFromSpherical(this.spherical);
        this.camera.position.add(this.controls.target);
      }
    });
  }
}

class KeyboardControls {
  constructor({ core, parent }) {
    this.core = core;
    this.parent = parent;
    this.keydown = (e) => {
      switch (e.code) {
        case "ArrowUp":
          this.parent.keyState.fwdArrowPressed = true;
          break;
        case "ArrowDown":
          this.parent.keyState.bkdArrowPressed = true;
          break;
        case "ArrowRight":
          this.parent.keyState.rgtArrowPressed = true;
          break;
        case "ArrowLeft":
          this.parent.keyState.lftArrowPressed = true;
          break;

        case "Space":
          // this.parent.playerVelocity.y = 5.0
          break;
      }
    };

    this.keyup = (e) => {
      switch (e.code) {
        case "ArrowUp":
          this.parent.keyState.fwdArrowPressed = false;
          break;
        case "ArrowDown":
          this.parent.keyState.bkdArrowPressed = false;
          break;
        case "ArrowRight":
          this.parent.keyState.rgtArrowPressed = false;
          break;
        case "ArrowLeft":
          this.parent.keyState.lftArrowPressed = false;
          break;
      }
    };
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    this.core.onClean(() => {
      window.removeEventListener("keydown", this.keydown);
      window.removeEventListener("keyup", this.keyup);
    });
  }
}
