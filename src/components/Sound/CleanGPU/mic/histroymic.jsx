import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
// import { DynamicSonagramTexture, OnlineState } from '../OnlineState'
import { create } from "zustand";
// import { WebMidi } from "webmidi";

export const useMic = create(() => {
  return {
    gl: false,
    MicTexture: false,
    low: 0,
    mid: 0,
    high: 0,
    avg: 0,
  };
});

export const InjectDeps = () => {
  let gl = useThree((r) => r.gl);
  useEffect(() => {
    useMic.setState({ gl });
  }, [gl]);
  return null;
};

export const useMicTexture = ({ gl }) => {
  mp3Setup({ gl });
};

export const authoriseMic = ({}) => {
  let mic = setup();
  let yyy = setInterval(() => {
    let { texture } = mic.update();
    if (texture) {
      clearInterval(yyy);
      texture.format = THREE.RedFormat;

      useMic.setState({ MicTexture: texture });
    }
  });

  let tt = 0;
  clearInterval(tt);
  tt = setInterval(() => {
    mic.update(({ low, mid, high }) => {
      // console.log(low, mid, high);
      useMic.setState({ low: low / 255, mid: mid / 255, high: high / 255 });
    });
  });

  // let tt2 = 0;
  // WebMidi.enable()
  //   .then(() => {
  //     console.log(WebMidi.inputs);
  //     // console.log(WebMidi.outputs)

  //     WebMidi.inputs.forEach((eachInput) => {
  //       eachInput.channels.forEach((eachChannel) => {
  //         eachChannel.addListener("noteon", (e) => {
  //           if (e?.note?.name) {
  //             clearTimeout(tt2);
  //             tt2 = setTimeout(() => {
  //               window.dispatchEvent(
  //                 new CustomEvent("playNote", {
  //                   detail: { name: e?.note?.name || "C" },
  //                 })
  //               );
  //             }, 10);
  //           }
  //         });
  //       });
  //     });
  //   })
  //   .catch((r) => {
  //     console.log(r);
  //   });
};

export const authoriseMP3 = ({ gl }) => {
  let promise = new Promise((resolve) => {
    const fftSize = 128;

    //

    let inp = document.createElement("input");

    inp.type = "file";
    inp.onchange = (e) => {
      let first = e.target.files[0];
      if (first) {
        const listener = new THREE.AudioListener();

        const audio = new THREE.Audio(listener);
        const file = URL.createObjectURL(first);

        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
          const loader = new THREE.AudioLoader();
          loader.load(file, function (buffer) {
            audio.setBuffer(buffer);
            audio.play();

            useMic.setState({ MicTexture: mp3Texture });
          });
        } else {
          const mediaElement = new Audio(file);
          mediaElement.play();

          audio.setMediaElementSource(mediaElement);

          setTimeout(() => {
            useMic.setState({ MicTexture: mp3Texture });
          });
        }

        let analyser = new THREE.AudioAnalyser(audio, fftSize);
        const format = gl.capabilities.isWebGL2
          ? THREE.RedFormat
          : THREE.LuminanceFormat;

        let mp3Texture = new THREE.DataTexture(
          analyser.data,
          fftSize / 2,
          1,
          format
        );
        mp3Texture.needsUpdate = true;

        resolve(mp3Texture);

        setInterval(() => {
          analyser.getFrequencyData();
          mp3Texture.needsUpdate = true;
        }, 16);
      }
    };

    inp.click();
  });

  return {
    mp3TexturePromise: promise,
  };
};

export const setup = () => {
  let api = {};
  let fftSize = 512; // up to 2048 with pow2
  let listener = new THREE.AudioListener();

  let analyser = null;
  let texture = null;
  let sound = null;
  let dataPerScan = fftSize / 2.0;
  let maxHistory = 5;
  let savedBits = new Uint8Array(new Array(dataPerScan * maxHistory));
  // var bitsArr = new Array(dataPerScan * maxHistory * 3)
  let historyArr = [];

  for (let i = 0; i < maxHistory; i++) {
    historyArr.push(new Uint8Array(new Array(dataPerScan)));
  }

  texture = new THREE.DataTexture(
    savedBits,
    dataPerScan,
    maxHistory,
    THREE.RedFormat
  );

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      sound = new THREE.Audio(listener);
      let context = listener.context;
      listener.setMasterVolume(0.0);
      let source = context.createMediaStreamSource(stream);
      sound.setNodeSource(source);

      analyser = new THREE.AudioAnalyser(sound, fftSize);
    });

  api.pause = () => {
    sound.pause();
  };

  api.update = (onBeat = () => {}) => {
    if (analyser) {
      analyser.getFrequencyData();
      let avg = analyser.getAverageFrequency();

      historyArr.pop();
      let array = analyser.data.slice();
      onBeat({
        avg: avg,
        low: array[0],
        high: array[array.length - 1],
        mid: array[Math.floor(array.length / 2)],
        texture: texture,
      });
      historyArr.unshift(array);

      // savedBits = new Uint8Array(dataPerScan * maxHistory)

      for (let ai = 0; ai < historyArr.length; ai++) {
        let currnetAI = historyArr[ai];
        for (let bi = 0; bi < currnetAI.length; bi++) {
          let v = currnetAI[bi];
          let idx = ai * dataPerScan + bi;
          savedBits[idx] = v;
          // bitsArr[idx + 0] = v2
          // bitsArr[idx + 1] = v2
          // bitsArr[idx + 2] = v2
        }
      }

      // console.log(savedBits.length + ' bits updated')
      // analyser.getAverageFrequency()
    }
    if (texture) {
      // texture = new THREE.DataTexture(savedBits, dataPerScan, 1.0 * maxHistory, THREE.LuminanceFormat)
      texture.needsUpdate = true;
    }

    return {
      dimension: {
        x: dataPerScan,
        y: maxHistory,
      },
      // bits: bitsArr,
      texture,
    };
  };
  return api;
};
