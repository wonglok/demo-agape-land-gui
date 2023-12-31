import { MeshBVH } from 'three-mesh-bvh'
import { Box3, BoxGeometry, Mesh, SphereGeometry, Vector3, MeshBasicMaterial, Matrix4 } from 'three'

import { mergeBufferGeometries } from 'three147/examples/jsm/utils/BufferGeometryUtils.js'

export async function sceneToCollider({ scene }) {
    //
    let gltfScene = scene

    //
    const geometriesToBeMerged = [
    ]

    gltfScene.updateMatrixWorld(true)
    let m4 = new Matrix4()

    let processList = []
    gltfScene.traverse((c) => {
        if (c.geometry && c.isInstancedMesh) {
            let n = c.count
            for (let i = 0; i < n; i++) {
                let geo = c.geometry.clone()

                for (const key in geo.attributes) {
                    if (key !== 'position') {
                        geo.deleteAttribute(key)
                    }
                }

                let cc = new Mesh(geo, new MeshBasicMaterial({ color: 0xffffff, wireframe: true }))
                cc.position.copy(c.position)
                cc.scale.copy(c.scale)
                cc.rotation.copy(c.rotation)

                c.getMatrixAt(i, m4)
                cc.geometry.applyMatrix4(m4)

                cc.name = c.name + '_' + i

                processList.push(cc)
            }
        }
        if (c.geometry && c.isMesh && !c.isInstancedMesh) {
            processList.push(c)
        }
    })

    let i = 0
    //
    for (let c of processList) {
        if (c.userData.notFloor) {
        } else if (c.userData.skipBVH) {
        } else if (c.userData?.isBox) {
            let cloned = c.geometry

            cloned.computeBoundingBox()
            const box = new Box3()
            box.copy(cloned.boundingBox)

            let center = new Vector3()
            c.updateMatrixWorld()

            box.applyMatrix4(c.matrixWorld)
            let s = new Vector3()
            box.getSize(s)
            box.getCenter(center)

            let geo = new BoxGeometry(s.x, s.y, s.z)
            geo.translate(center.x, center.y, center.z)

            //
            // let mesh = new Mesh(
            //   geo,
            //   new MeshBasicMaterial({
            //     color: 0xff0000,
            //     opacity: 1,
            //     wireframe: true,
            //   })
            // );
            // scene.add(mesh);
            //

            for (const key in geo.attributes) {
                if (key !== 'position') {
                    geo.deleteAttribute(key)
                }
            }
            geometriesToBeMerged.push(geo)
        } else {
            const cloned = c.geometry.toNonIndexed()
            cloned.applyMatrix4(c.matrixWorld)

            for (const key in cloned.attributes) {
                if (key !== 'position') {
                    cloned.deleteAttribute(key)
                }
            }
            geometriesToBeMerged.push(cloned)
        }

        await new Promise((r) => {
            r()
        })
        // console.log("processing glb", ((i / processList.length) * 100).toFixed(2));
        i++
    }

    await new Promise((r) => r())

    // create the merged geometry
    const combined = mergeBufferGeometries(geometriesToBeMerged, false)

    combined.boundsTree = new MeshBVH(combined, {
        // // Which split strategy to use when constructing the BVH.
        // // strategy: CENTER,
        // // The maximum depth to allow the tree to build to.
        // // Setting this to a smaller trades raycast speed for better construction
        // // time and less memory allocation.
        maxDepth: 60,
        // // The number of triangles to aim for in a leaf node. Setting this to a lower
        // // number can improve raycast performance but increase construction time and
        // // memory footprint.
        // maxLeafTris: 15,
        // // If true then the bounding box for the geometry is set once the BVH
        // // has been constructed.
        // setBoundingBox: true,
        // // If true then the MeshBVH will use SharedArrayBuffer rather than ArrayBuffer when
        // // initializing the BVH buffers. Geometry index data will be created as a
        // // SharedArrayBuffer only if it needs to be created. Otherwise it is used as-is.
        // useSharedArrayBuffer: false,
        // // An optional function that takes a "progress" argument in the range [0, 1]
        // // indicating the progress along BVH generation. Useful primarily when generating
        // // the BVH asynchronously with the GenerateMeshBVHWorker class.
        // onProgress: null,
        // // Print out warnings encountered during tree construction.
        // verbose: true,
    })

    let collider = new Mesh(combined, new MeshBasicMaterial({ wireframe: true }))

    return {
        geometry: combined,
        collider,
        bvh: combined.boundsTree,
    }
}
