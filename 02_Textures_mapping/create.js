const randomColor = {
	0: "green",
	1: "yellow",
	2: "gray",
	3: "black",
	4: "red",
	5: "white",
	6: "blue",
	7: "lightblue",
	8: "brown",
	9: "cyan",
};
function randNum() {
	return Math.floor(Math.random() * Object.keys(randomColor).length);
}
export function createBox() {
	const box = new THREE.Mesh(
		new THREE.BoxGeometry(),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,
		})
	);
	box.position.set(0, 10, 0);
	box.scale.setScalar(3);
	box.castShadow = true;
	box.receiveShadow = true;
	return box;
}
export function createSphere(THREE) {
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(),
		new THREE.MeshStandardMaterial({
			color: randomColor[randNum()],
		})
	);
	return sphere;
}
