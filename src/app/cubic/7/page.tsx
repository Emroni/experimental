'use client';
import { ThreePlayer } from '@/components';
import { easeInOutCubic } from '@/helpers';
import { PI_D2, PI_M2 } from '@/setup';
import React from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default class Cubic7 extends React.Component<any, ExperimentControlItems> {

    // TODO: Add experiment controls

    container = new THREE.Group();
    cubes: THREE.Object3D[] = [];
    planeSize = 5000;
    rows = 10;
    size = 1200;
    spacing = 2;
    wide = 200;

    mesh: THREE.InstancedMesh;
    planeLeft: THREE.Mesh;
    planeRight: THREE.Mesh;
    side: string;

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
        // Update camera
        camera.far = 10000;
        camera.position.y = 30;
        camera.position.z = 600;

        // Add composer
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.size, this.size), 0.5, 0, 0.7);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Add inner light
        const lightIn = new THREE.PointLight('#fff', 300000, 2000, 1.95);
        scene.add(lightIn);

        // Add outer light
        const lightOut = new THREE.PointLight('#fff', 50000, 700);
        scene.add(lightOut);
        lightOut.position.y = 200;
        lightOut.position.z = 600;

        // Add container
        scene.add(this.container);

        // Get mesh
        const meshGeometryIndices = new Uint16Array('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,15,123,16,18,124,19,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,36,143,144,145,146,147,36,144,37,148,149,150,151,152,153,154,155,156,157,151,153,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,68,227,66,228,229,230,231,232,233,234,235,236,235,237,236,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,90,274,91,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295'.split(',').map(n => parseInt(n)));
        const meshGeometryPosition = new Float32Array('-0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-0.9,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,-0.9,-1,0.9,0.9,-1,0.9,-0.9,-1,-0.9,0.9,-0.9,0.9,0.9,-0.9,-0.9,0.9,-1,0.9,-0.9,-0.9,-0.9,-0.9,-0.9,0.9,-0.9,-0.9,-0.9,0.9,0.9,-0.9,1,0.9,-0.9,0.9,0.9,0.9,1,-0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.45,1,0.9,0.9,1,0.9,0.9,0.9,-0.9,-0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-0.9,0.9,0.9,0.9,0.9,1,-0.9,0.9,0.9,-0.9,-0.9,0.9,0.9,0.9,1,0.9,0.9,0.9,0.9,-0.9,0.9,-0.9,-0.9,1,0.9,-0.9,0.9,0.9,1,-1,-1,-0.9,-1,-0.9,-1,-1,-1,-1,1,-1,-0.9,1,0.9,-0.9,1,-0.9,1,0.9,0.9,1,0.9,-0.9,1,1,-1,1,-1,1,-0.9,-0.9,1,-1,-1,1,-1,-1,1,-1,0.9,0.9,-1,-0.9,0.9,1,1,-1,0.9,0.9,-1,-1,1,-1,-1,0.9,-0.9,-1,1,1,-1,1,-1,-0.9,0.9,1,0.9,0.9,1,1,1,1,0.9,0.9,0.9,1,0.9,-0.9,1,0.9,0.9,1,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,0.9,1,-0.9,0.9,1,-1,1,1,-1,-1,1,1,1,1,1,-1,0.9,1,0.9,-0.9,-0.9,-0.9,-0.9,-1,0.9,-0.9,-1,-0.9,-0.9,-1,0.9,0.9,-0.9,0.9,0.9,-1,0.9,0.9,-1,-0.45,1,-1,-1,1,-1,1,0.9,-0.9,-1,1,-1,-1,-1,-1,-1,0.9,0.9,0.9,1,0.9,0.9,1,-0.45,0.9,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,0.9,0.9,-0.9,-0.9,0.9,-1,0.9,0.9,-1,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,-0.9,0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-1,-0.45,0.9,0.9,-0.9,1,-0.9,-0.9,1,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,-1,0.9,-0.45,-1,-0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,-0.9,-1,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-1,-0.9,-0.9,-0.9,-0.9,-1,-0.9,-0.9,-1,-0.9,0.9,-0.9,0.9,-0.9,-0.9,0.9,0.9,-1,0.9,0.9,-1,-0.9,0.9,-1,0.9,0.9,-0.9,0.9,0.9,-1,0.9,-0.9,-1,-0.9,-0.9,-0.9,-0.9,-0.9,-0.9,-0.9,1,-0.9,0.9,1,0.9,0.9,0.9,0.9,-0.9,0.9,0.9,0.45,1,0.9,-0.9,0.9,0.9,-0.9,1,0.9,0.45,1,-0.9,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-1,0.9,0.9,0.9,0.9,1,0.9,0.9,1,-0.9,-0.9,0.9,0.9,-0.9,1,0.9,0.9,1,0.9,-0.9,0.9,-0.9,-0.9,1,-0.9,-0.9,1,0.9,0.9,-1,-0.45,0.9,-1,-0.9,-0.9,-1,-0.9,-0.9,-1,0.9,-1,-1,1,-0.9,-1,-0.9,-1,-1,1,-1,-1,-1,0.9,1,-0.9,1,1,-1,-1,1,-1,-1,1,-1,-1,1,1,-0.9,1,0.9,-0.9,1,-0.9,1,-0.9,-0.9,1,-1,-1,1,1,-1,1,1,1,1,-1,1,1,-0.45,0.9,1,1,1,1,-0.45,0.9,1,0.9,0.9,1,0.9,-0.9,1,-0.9,-0.9,1,1,-1,1,1,1,1,0.9,0.9,1,1,-1,1,-1,1,1,1,1,0.9,0.45,1,1,-1,1,0.9,0.45,1,0.9,-0.9,1,-0.9,0.9,1,-1,1,1,-0.9,-0.9,1,-1,1,1,-1,-1,1,-0.9,-0.9,1,1,-1,1,0.9,-0.9,1,-0.9,-0.9,1,-1,-1,1,-1,1,1,-1,0.9,0.9,-1,-0.9,0.9,-1,-0.9,-0.9,-1,-1,1,-1,-0.9,-0.9,-1,-1,-1,-1,-1,1,1,1,-1,1,-1,-1,0.9,-0.45,-1,0.9,0.9,-1,-0.9,0.9,-1,-1,1,-1,1,1,-1,0.9,-0.45,-1,0.9,0.9,-1,-1,1,-1,-1,-1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,-1,0.9,0.9,-1,1,1,-1,1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,1,1,1,-1,1,1,-0.9,0.9,1,0.9,0.9,1,0.9,0.45,1,1,1,1,0.9,0.9,0.9,0.9,0.9,-0.9,1,0.9,-0.9,1,-0.9,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,-0.9,0.9,1,-0.45,0.9,1,-1,1,1,1,-1,0.9,1,-0.9,0.9,1,0.9,0.9,1,0.9,-0.9,1,0.9,1,1,1,-1,1,1,-0.9,-0.9,-0.9,-0.9,-0.9,0.9,-0.9,-1,0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,0.9,-0.9,0.9,1,-1,1,-1,-1,1,0.9,-1,0.9,-1,-1,1,-0.9,-1,0.9,0.9,-1,0.9,0.9,-1,0.9,0.9,-1,-0.45,1,-1,1,-1,-1,-1,-1,1,-1,-0.9,-0.9,-1,-1,1,-1,-0.9,0.9,-1,-0.9,-0.9,-1,0.9,-0.9,-1,0.9,-0.45,-1,1,-1,-1,-1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,-1,1,-0.45,0.9,1,-0.9,0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,0.9,0.9,1,-0.45,0.9,-0.9,-0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,1,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,1,-0.9,0.9,-1,-0.45,0.9,-1,0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,-0.9,-0.9,0.9,-1,-0.45,0.9,0.9,-0.9,0.9,-0.9,-0.9,1,-0.9,-0.9,0.9,-0.45,-1,0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,-0.9,-0.9,0.9,0.9,-0.9,0.9,-0.45,-1,-0.9,-0.9,-1,-0.9,-0.9,-0.9,0.9,-0.9,-0.9'.split(',').map(n => parseFloat(n)));
        const meshGeometryUV = new Float32Array('0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.95,0,1,1,0,0.95,0.95,0.95,0.05,0.95,0.95,0.95,0.05,1,0,0,0,0.05,0.95,0,1,0,0,0.95,0.05,0.05,0.05,0,0,0.05,0.05,0,1,0.95,0.95,1,0,1,1,0.95,0.95,0.95,0.05,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.95,0,1,0,0,0,1,0,0,0.05,0.95,0,0,0,0,0,0,0,0,0,0,0,0,0.275,0.05,0,0,1,0,0.95,0.05,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.275,0.05,0.05,0.05,0.05,0.95,0.95,0.95,1,1,0.05,0.95,1,1,0,1,0.05,0.05,0,0,1,0,1,0,1,1,0.95,0.95,0.95,0.05,0.05,0.05,0,0,1,0,1,1,0,1,0.275,0.95,1,1,0.275,0.95,0.95,0.95,0.95,0.05,0.05,0.05,1,0,1,1,0.95,0.95,1,0,0,0,1,0,0.725,0.05,0,0,0.725,0.05,0.05,0.05,0.95,0.95,1,1,0.05,0.95,1,1,0,1,0.05,0.95,0,0,0.05,0.05,0.05,0.95,0,0,1,0,0.95,0.05,0.05,0.05,0.05,0.95,0,0,0.05,0.95,0,1,0,0,0,0,1,0,0.725,0.05,0.05,0.05,0.05,0.95,0,1,0,0,0.725,0.05,0.05,0.05,1,1,0,1,0.05,0.95,0.95,0.95,0.95,0.05,1,0,1,1,0.05,0.95,0.95,0.95,1,0,1,1,0.95,0.95,0.95,0.05,0.725,0.05,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.05,0.05,0.95,0.275,0.95,0,1,0,0,0.05,0.05,0.05,0.95,0.05,0.95,0.95,0.95,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0.95,0.05,1,1,0.95,0.95,0.95,0.05,0.95,0.05,0.275,0.05,1,0,1,1,0,1,0.95,0.95,0,1,0.05,0.95,0.95,0.95,0.95,0.05,0.725,0.05,1,0,1,1,0.95,0.95,0.95,0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'.split(',').map(n => parseFloat(n)));

        const meshGeometry = new THREE.BufferGeometry();
        meshGeometry.setAttribute('position', new THREE.BufferAttribute(meshGeometryPosition, 3));
        meshGeometry.setAttribute('uv', new THREE.BufferAttribute(meshGeometryUV, 2));
        meshGeometry.setIndex(new THREE.BufferAttribute(meshGeometryIndices, 1));
        meshGeometry.computeVertexNormals();
        meshGeometry.scale(this.wide / 2, this.wide / 2, this.wide / 2);

        const meshMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('/assets/textures/metal-1.png'),
        });

        this.mesh = new THREE.InstancedMesh(meshGeometry, meshMaterial, (this.rows * 2 + 1) * this.rows * this.rows + 1);
        this.container.add(this.mesh);

        // Add large
        const large = new THREE.Object3D();
        large.scale.setScalar(2);
        large.updateMatrix();
        this.mesh.setMatrixAt(0, large.matrix);

        // Add cubes
        for (let x = 0; x <= this.rows * 2; x++) {
            for (let y = 0; y < this.rows; y++) {
                for (let z = 0; z < this.rows; z++) {
                    const cube = new THREE.Object3D();
                    this.cubes.push(cube);

                    cube.position.x = this.wide * this.spacing * (x - this.rows);
                    cube.position.y = this.wide * this.spacing * y;
                    cube.position.z = this.wide * this.spacing * -z;

                    cube.userData.delay = Math.sqrt(cube.position.x * cube.position.x + cube.position.y * cube.position.y + cube.position.z * cube.position.z) / (this.wide * this.spacing * this.rows);

                    cube.updateMatrix();
                    this.mesh.setMatrixAt(this.cubes.length, cube.matrix);
                }
            }
        }

        // Add planes
        const planeGeometry = new THREE.PlaneGeometry(this.planeSize, this.planeSize, 10, 10);

        const planeMaterial = new THREE.MeshBasicMaterial({
            color: '#111',
        });

        const planes = new THREE.Object3D();
        this.container.add(planes);

        this.planeLeft = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(this.planeLeft);
        this.planeLeft.scale.y = 3;

        this.planeRight = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(this.planeRight);
        this.planeRight.scale.y = 3;

        const planeTopLeft = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeTopLeft);
        planeTopLeft.scale.x = this.wide / this.planeSize * 2;
        planeTopLeft.position.x = -this.wide;
        planeTopLeft.position.y = this.planeSize / 2 + this.wide;
        planeTopLeft.rotation.y = -PI_D2;

        const planeTopMiddle = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeTopMiddle);
        planeTopMiddle.scale.x = this.wide / this.planeSize * 2;
        planeTopMiddle.position.y = this.planeSize / 2 + this.wide;
        planeTopMiddle.position.z = this.wide;

        const planeTopRight = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeTopRight);
        planeTopRight.scale.x = this.wide / this.planeSize * 2;
        planeTopRight.position.x = this.wide;
        planeTopRight.position.y = this.planeSize / 2 + this.wide;
        planeTopRight.rotation.y = PI_D2;

        const planeBottomLeft = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeBottomLeft);
        planeBottomLeft.scale.x = this.wide / this.planeSize * 2;
        planeBottomLeft.position.x = -this.wide;
        planeBottomLeft.position.y = -this.planeSize / 2 - this.wide;
        planeBottomLeft.rotation.y = PI_D2;

        const planeBottomMiddle = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeBottomMiddle);
        planeBottomMiddle.scale.x = this.wide / this.planeSize * 2;
        planeBottomMiddle.position.y = -this.planeSize / 2 - this.wide;
        planeBottomMiddle.position.z = -this.wide;

        const planeBottomRight = new THREE.Mesh(planeGeometry, planeMaterial);
        planes.add(planeBottomRight);
        planeBottomRight.scale.x = this.wide / this.planeSize * 2;
        planeBottomRight.position.x = this.wide;
        planeBottomRight.position.y = -this.planeSize / 2 - this.wide;
        planeBottomRight.rotation.y = -PI_D2;

        // Return render function
        return () => composer.render();
    }

    handleTick = (progress: number) => {
        this.container.rotation.x = 0.2 * Math.sin(PI_M2 * progress) - 0.55;
        this.container.rotation.y = -PI_D2 * progress + PI_D2 / 2;

        let s = 'middle';
        if (progress < 0.28) {
            s = 'left';
        } else if (progress > 0.78) {
            s = 'right';
        }

        for (let i = 0; i < this.cubes.length; i++) {
            const cube = this.cubes[i];

            if (this.side !== s) {
                cube.userData.hide = (s === 'left' && cube.position.x < 0) || (s === 'right' && cube.position.x > 0);
                if (cube.userData.hide) {
                    cube.scale.setScalar(0.0001);
                }
            }

            if (!cube.userData.hide) {
                const t = 12 * progress - cube.userData.delay;
                cube.rotation.x = PI_D2 * (easeInOutCubic(t) + easeInOutCubic(t - 6));
                cube.rotation.y = PI_D2 * (easeInOutCubic(t - 2) + easeInOutCubic(t - 8));
                cube.rotation.z = -PI_D2 * (easeInOutCubic(t - 4) + easeInOutCubic(t - 10));

                cube.scale.setScalar(0.2 * Math.sin(PI_M2 * progress) + 1);
            }

            cube.updateMatrix();
            this.mesh.setMatrixAt(i + 1, cube.matrix);
        }

        if (this.side !== s) {
            this.planeLeft.position.x = s === 'left' ? (-this.planeSize / 2 - this.wide) : -this.wide;
            this.planeLeft.position.z = s === 'left' ? -this.wide : (this.planeSize / 2 + this.wide);
            this.planeLeft.rotation.y = s === 'left' ? 0 : PI_D2;

            this.planeRight.position.x = s === 'right' ? (this.planeSize / 2 + this.wide) : this.wide;
            this.planeRight.position.z = s === 'right' ? -this.wide : (this.planeSize / 2 + this.wide);
            this.planeRight.rotation.y = s === 'right' ? 0 : -PI_D2;
        }

        this.side = s;

        this.mesh.instanceMatrix.needsUpdate = true;
    }


    render() {
        return <ThreePlayer
            duration={12}
            size={this.size}
            onInit={this.handleInit}
            onTick={this.handleTick}
        />;
    }

}
