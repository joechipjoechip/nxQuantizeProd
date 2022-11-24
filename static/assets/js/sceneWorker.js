import * as THREE from 'three';

let scene;
let landscape;
let capsule;

onmessage = function( message ) {

	console.log('Message reçu dans le worker');

	var workerResult = 'Résultat ---> ' + (message.data);

	console.log('Envoi du message deuis le worker');
	const instruction = message.data[0];
	const content = message.data[1];

	dispatchInstruction(instruction, content);

}

const dispatchInstruction = (instruction, data) => {

	switch( instruction ){

		case "initScene":
			goInitScene(data);
			break;

		case "computeCameraPosition":
			// postMessage(landscape);
			computeCameraPosition(data);
			break;

	}

}

const goInitScene = ( sceneData ) => {

	console.log("ok goInitScene, avec : ", sceneData);

	scene = new THREE.Scene();

	createLandscape(sceneData);

	createCapsule();

	scene.add(landscape);

	scene.add(capsule);

}

const createLandscape = (landscapeData) => {

	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute( 'position', new THREE.BufferAttribute( landscapeData.attributes.position.array, 3 ));

	const material = new THREE.MeshBasicMaterial();

	landscape = new THREE.Mesh(geometry, material);

}

const createCapsule = () => {

	const geometry = new THREE.CapsuleGeometry(0.5, 1, 1, 3);

	const material = new THREE.MeshBasicMaterial();

	capsule = new THREE.Mesh(geometry, material);

	capsule.position = new THREE.Vector3(0,0,0);

}

const computeCameraPosition = (position) => {

	console.log("position thirdcamera : ", position);

}
