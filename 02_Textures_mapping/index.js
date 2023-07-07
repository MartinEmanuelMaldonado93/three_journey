import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FRAGMENT_S, VERTEX_S } from "./shaders.js";
import { createBox, createSphere } from "./create.js";

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
	format: THREE.RGBFormat,
	generateMipmaps: true,
	minFilter: THREE.LinearMipmapLinearFilter,
	encoding: THREE.colorSpace,
});

class BasicWorldDemo {
	constructor() {
		this._Initialize();
		this._updatables = [];
		this._sphere = null;
	}

	_Initialize() {
		this._threejs = new THREE.WebGLRenderer({
			antialias: true,
		});
		this._threejs.shadowMap.enabled = true;
		this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
		this._threejs.setPixelRatio(window.devicePixelRatio);
		this._threejs.setSize(window.innerWidth, window.innerHeight);
		
		document.body.appendChild(this._threejs.domElement);

		this._uniformData = null;
		this._clock = null;

		window.addEventListener(
			"resize",
			() => {
				this._OnWindowResize();
			},
			false
		);

		const fov = 60;
		const aspect = window.innerWidth / window.innerHeight;
		const near = 1.0;
		const far = 500.0;
		this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this._camera.position.set(0, 8, 40);
		//this._camera.lookAt(0);

		this._scene = new THREE.Scene();

		let light = new THREE.DirectionalLight("white", 1.0);
		light.position.set(50, 40, 10);
		light.target.position.set(0, 0, 0);
		light.castShadow = true;
		light.shadow.bias = -0.001;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 0.1;
		light.shadow.camera.far = 500.0;
		light.shadow.camera.near = 0.5;
		light.shadow.camera.far = 500.0;
		light.shadow.camera.left = 100;
		light.shadow.camera.right = -100;
		light.shadow.camera.top = 100;
		light.shadow.camera.bottom = -100;
		this._scene.add(light);

		light = new THREE.AmbientLight(0x101010);
		this._scene.add(light);

		const controls = new OrbitControls(this._camera, this._threejs.domElement);
		controls.target.set(0, 10, 0);
		controls.autorotate = true;
		controls.update();

		const geometryPlane = new THREE.PlaneGeometry(50, 50);
		geometryPlane.computeVertexNormals();
		const plane = new THREE.Mesh(
			geometryPlane,
			new THREE.MeshPhysicalMaterial({
				color: "blue",
			})
		);
		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.x = -Math.PI / 2;
		// this._scene.add(plane);
	
		const loader = new THREE.TextureLoader();
		const AO = loader.load(
			"./assets/Wood_Herringbone_Tiles_004_SD/Substance_Graph_AmbientOcclusion.jpg"
		);
		const baseColor = loader.load(
			"./assets/Wood_Herringbone_Tiles_004_SD/Substance_Graph_BaseColor.jpg"
		);
		const heightMap = loader.load(
			"./assets/Wood_Herringbone_Tiles_004_SD/Substance_Graph_Height.jpg"
		);
		const normalMap = loader.load(
			"./assets/Wood_Herringbone_Tiles_004_SD/Substance_Graph_Normal.jpg"
		);
		const roughnessMap = loader.load(
			"./assets/Wood_Herringbone_Tiles_004_SD/Substance_Graph_Roughness.jpg"
		);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(undefined, undefined, 612),
			new THREE.MeshStandardMaterial({
				map: baseColor,
				aoMap: AO,
				aoMapIntensity: 1.2,
				normalMap: normalMap,
				roughnessMap: roughnessMap,
				roughness: 0.3,
				metalness: 0.1,
				displacementMap: heightMap,
				displacementScale: 0.2,
				envMap: cubeRenderTarget.texture,
			})
		);
		sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
		sphere.position.y = 1;
		sphere.scale.setScalar(2);
		// this._updatables.push(sphere);
		this._sphere = sphere;
		this._scene.add(sphere);

		this._clock = new THREE.Clock();
		this._uniformData = {
			u_time: {
				type: "f",
				value: this._clock.getElapsedTime(),
			},
		};
		const boxGeometry = new THREE.BoxGeometry(16, 16, 16, 16, 16, 16);
		const boxMaterial = new THREE.ShaderMaterial({
			wireframe: true,
			// uniforms: this._uniformData,
			// vertexShader: VERTEX_S,
			// fragmentShader: FRAGMENT_S,
		});
		const cubeShader = new THREE.Mesh(boxGeometry, boxMaterial);
		cubeShader.position.y = 20;
		// this._scene.add(cubeShader);
	}

	async _OnLoadTexture() {
		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
			"./resources/posx.jpg",
			"./resources/negx.jpg",
			"./resources/posy.jpg",
			"./resources/negy.jpg",
			"./resources/posz.jpg",
			"./resources/negz.jpg",
		]);
		this._scene.background = texture;
		// return texture;
	}

	_OnWindowResize() {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._threejs.setSize(window.innerWidth, window.innerHeight);
	}

	_RAF() {
		requestAnimationFrame(() => {
			const time = this._clock.getElapsedTime();
			// this._uniformData.u_time.value = time;
			this._updatables.forEach(item=>item.tick());
			this._threejs.render(this._scene, this._camera);
			this._RAF();
		});
	}
	_STOP() {
		cancelAnimationFrame();
	}
}

async function App() {
	try {
		const worldDemo = new BasicWorldDemo();
		worldDemo._RAF();
	} catch (e) {
		console.log(e);
		worldDemo._STOP();
	}
}
App();
