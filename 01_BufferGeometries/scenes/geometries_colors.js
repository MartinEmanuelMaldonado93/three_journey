import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const { sin, cos, abs } = Math;

(function sine_cos_wave_plane() {
	// SCENE
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color(0xa8def0);

	// CAMERA
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 8;
	camera.position.z = 8;

	// RENDERER
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;

	// CONTROLS
	const controls = new OrbitControls(camera, renderer.domElement);
	// controls.target = new THREE.Vector3(0, 0, 0);
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
	dirLight.shadow.camera.lookAt(0, 0, -30);
	scene.add(dirLight);
	// scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

	const bufferGeometry = new THREE.PlaneGeometry(5, 5, 20, 20);
	const plane = new THREE.Mesh(
		bufferGeometry,
		new THREE.MeshPhongMaterial({ color: 0xf2a23a })
	);
	plane.receiveShadow = true;
	plane.castShadow = true;
	plane.rotation.x = -Math.PI / 2;
	// plane.position.z = -30;
	scene.add(plane);

	const clock = new THREE.Clock();
	const deg = THREE.MathUtils.degToRad(15);
	// ANIMATE
	function animate(t) {
		// SINE WAVE
		// const delta = performance.now() / 300;
		const delta = clock.getDelta();
		plane.rotateZ(deg * delta);

		const val = sin(1);
		const prev = plane.material.color.r;

		const zet = plane.rotation.z;
		plane.material.color.set(sin(abs(zet)) / 2, 0, cos(abs(zet)) / 3);

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
