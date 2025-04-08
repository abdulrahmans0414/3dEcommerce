import React from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import SwatchWrapper from './swatchWrapper';
import gsap from 'gsap';

class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.InitialSetup();
    }

    InitialSetup = () => {
        const { handleLoading } = this.props;
        this.container = document.getElementById('container');
        const item = document.getElementById('container').getBoundingClientRect();

        this.sizes = {
            width: item.width,
            height: item.height,
        };

        this.canvas = document.querySelector('canvas.webgl');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            10,
            5000
        );
        this.camera.position.set(150, 20, 100);
        this.scene.add(this.camera);

        // Loading 
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const ProgressVal = (itemsLoaded / itemsTotal) * 100;
            if (ProgressVal === 100) {
                handleLoading();
            }
        }

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
        };

        // this.controls.addEventListener('change', () => {});
        // this.controls.maxDistance = 150;
        // this.controls.minDistance = 100;
        this.controls.enableDamping = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        //  this.controls.minPolarAngle = -Math.PI / 2;
        this.controls.maxPolarAngle = Math.PI / 1.9;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;

    }
    render() {
        const { activeData, swatchData, handleSwatchClick, condition } = this.props;
        return (
            <div
                id="container"
                className="w-full h-3/5 relative z-10 lg:w-1/2 lg:h-full "
            >
                <canvas className="webgl w-full h-full relative z-10"></canvas>

                <SwatchWrapper
                    activeData={activeData}
                    swatchData={swatchData}
                    handleSwatchClick={handleSwatchClick}
                    condition={condition}
                />
                <div className="highlight w-2/5 h-1/2 bg-[#D7B172] absolute inset-x-40 top-0 -z-10 rounded-br-full rounded-bl-full md:inset-x-60  lg:inset-x-40"></div>
            </div>
        );
    }
}

export default Canvas;
