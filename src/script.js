import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'


/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const scene1 = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry

let mouse = new THREE.Vector2(0, 0)
let prevMouse = new THREE.Vector2(0, 0)
let currentWave = 0;

const geometry = new THREE.PlaneBufferGeometry(64, 64, 32, 32)
const geometryFull = new THREE.PlaneBufferGeometry(sizes.width, sizes.height, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uDisplacement: { value: null },
        uTexture: { value: new THREE.TextureLoader().load('/ocean.jpg') },

    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide
})

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX) - sizes.width / 2
    mouse.y = sizes.height / 2 - (e.clientY)
})

// //add another mat
// const material1 = new THREE.MeshBasicMaterial({
//     transparent: true,
//     map: new THREE.TextureLoader().load('/brush.png')
// })

let max = 50;
let meshes = []
for (let i = 0; i < max; i++) {
    let m = new THREE.MeshBasicMaterial({
        transparent: true,
        map: new THREE.TextureLoader().load('/brush.png'),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false

    })
    let mesh = new THREE.Mesh(geometry, m)
    mesh.visible = false
    mesh.rotation.z = 2 * Math.PI * Math.random()
    scene.add(mesh)
    meshes.push(mesh)
}

function setNewWave(x, y, index) {
    let mesh = meshes[index]
    mesh.visible = true
    mesh.position.x = x
    mesh.position.y = y
    mesh.material.opacity = 0.5
    mesh.scale.x = mesh.scale.y = 0.2
}

function trackMousePos() {
    if (Math.abs(mouse.x - prevMouse.x) < 4 && Math.abs(mouse.y - prevMouse.y) < 4) {
    } else {
        setNewWave(mouse.x, mouse.y, currentWave)
        currentWave = (currentWave + 1) % max
        // console.log(currentWave);
    }
    prevMouse.x = mouse.x
    prevMouse.y = mouse.y
}

const meshFull = new THREE.Mesh(geometryFull, material)
scene1.add(meshFull)



window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


let baseTexture = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
}
)

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
let frustumSize = sizes.height
let aspect = sizes.width / sizes.height
let camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, -1000, 1000)

camera.position.set(0.0, - 0.0, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0xff0000, 1)

/**
 * Animate
 */
const tick = () => {

    trackMousePos()
    // Update controls
    controls.update()
    meshes.forEach(m => {
        if (m.visible) {
            // m.position.x = mouse.x
            // m.position.y = mouse.y
            m.rotation.z += 0.02
            m.material.opacity *= 0.96
            m.scale.x = 0.982 * m.scale.x + 0.107
            m.scale.y = m.scale.x
            if (m.material.opacity < 0.002) {
                m.visible = false
            }


        }
    })
    // Render
    renderer.setRenderTarget(baseTexture)
    renderer.render(scene, camera)
    material.uniforms.uDisplacement.value = baseTexture.texture
    renderer.setRenderTarget(null)
    renderer.clear()
    renderer.render(scene1, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()