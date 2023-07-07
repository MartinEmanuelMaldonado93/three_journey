import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const { sin, cos } = Math;

(function sine_cos_slime_wave_plane() {
	// SCENE
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xa8def0);

	// CAMERA
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 5;

	// RENDERER
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;

	// CONTROLS
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(0, 0, -40);
	controls.update();

	// AMBIENT LIGHT
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	// DIRECTIONAL LIGHT
	const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
	dirLight.position.x += 20;
	dirLight.position.y += 20;
	dirLight.position.z += 20;
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;
	const d = 25;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;
	dirLight.position.z = -30;

	let target = new THREE.Object3D();
	target.position.z = -20;
	dirLight.target = target;
	dirLight.target.updateMatrixWorld();

	dirLight.shadow.camera.lookAt(0, 0, -30);
	scene.add(dirLight);
	// scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

	const textureLoader = new THREE.TextureLoader();

	const slimeBaseColor = textureLoader.load(
		"./textures/slime/alien-slime1-albedo.png"
	);
	const slimeNormalMap = textureLoader.load(
		"./textures/slime/alien-slime1-normal-ogl.png"
	);
	const slimeHeightMap = textureLoader.load(
		"./textures/slime/alien-slime1-height.png"
	);
	const slimeRoughness = textureLoader.load(
		"./textures/slime/alien-slime1-roughness.png"
	);
	const slimeAmbientOcclusion = textureLoader.load(
		"./textures/slime/alien-slime1-ao.png"
	);

	const bufferGeometry = new THREE.PlaneGeometry(30, 30, 200, 200);
	const plane = new THREE.Mesh(
		bufferGeometry,
		new THREE.MeshStandardMaterial({
			map: slimeBaseColor,
			normalMap: slimeNormalMap,
			aoMap: slimeAmbientOcclusion,
			roughnessMap: slimeRoughness,
			displacementMap: slimeHeightMap,
		})
	);
	plane.receiveShadow = true;
	plane.castShadow = true;
	plane.rotation.x = -Math.PI / 2;
	plane.position.z = -30;
	scene.add(plane);

	const count = bufferGeometry.attributes.position.count;
	const damping = 0.45;

	// ANIMATE
	function animate() {
		// SINE WAVE
		const delta = performance.now() / 500;

		for (let i = 0; i < count; i++) {
			const x = bufferGeometry.attributes.position.getX(i);
			const y = bufferGeometry.attributes.position.getY(i);

			const xangle = x + delta;
			const xsin = sin(xangle) * damping;
			const yangle = y + delta;
			const ycos = cos(yangle) * damping;

			bufferGeometry.attributes.position.setZ(i, xsin + ycos); // mapple eggs
			// bufferGeometry.attributes.position.setZ(i, xsin); // plane waves
			// bufferGeometry.attributes.position.setZ(i, cos(x + delta)); // plane waves
		}
		bufferGeometry.computeVertexNormals();
		bufferGeometry.attributes.position.needsUpdate = true;

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	document.body.appendChild(renderer.domElement);
	animate();

	// RESIZE HANDLER
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener("resize", onWindowResize);
})();
