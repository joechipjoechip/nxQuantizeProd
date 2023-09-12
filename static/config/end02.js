const end02config = {
    name: "world_055",

    main: {
        // spaceColor: "#090016",
        spaceColor: "#FF0000",
        spaceColorDarker: "#FF0000",
        spaceColorWithBloom: "#FF0000",

        ambient: {
            sunColor: "#8a4300",
            // intensity: 0.17,
            intensity: 0.3,
            groundColor: "#1B00FF"
        },

        fog: {
            enabled: false,
            color: 0xff9500,
            intensity: .15
        },

        meshInfos: {

            glbPath: "/assets/3d/worlds/end02/end02.glb",
            imagePath: {
                landscape: "/assets/3d/worlds/end02/end02Bake"
            }
        },

        meshCustomShaderOptions: {
            enabled: true,
            shaderTimeRatio: 1.85,
            shaderName: "plastic",
            shaderScale: 12,
            shaderAxe: "zy"
        },

        particles: [
            {
                type: "fireflies",
                count: 2500,
                particleSize: 70,
                additive: true,
                timeRatio: 500.0,
                blockSize: {
                    x: 4,
                    y: 8,
                    z: 18
                }
            }
        ],

    },

    sequences: [
        {
            id: "7.16",
            baseFov: 28,
            fovTransition: false,
            sequenceBobName: "linkShaderFlying",
            bobRestoreSize: 0.0014,
            isEndSequence: true,

            type: "third-person",
            cameraTriggerTimeDecay: 8,
            cameraType: "movingFlyEnd",

            until: 37.9,
            // until: 4,
            nextInstruction: "switch-sequence",

            cameraInvert: {
                x: false,
                y: true
            },

            bobCustomShader: {
                shaderTimeRatio: 0.025,
                shaderTimeDecay: 0,
                sin: true,
                sinAmplitude: 30
            },

            animatedMesh: false,

            helpers: {
                orbit: false,
                tubes: false,
                timelines: false
            },

            fog: {
                enabled: false,
                color: "#ffffff",
                intensity: .14
            },

            bobImposedMoves: {
                fly: true,
                forward: false,
                backward: false,
                left: false,
                right: false,
            },

            // bobCustomShader: {
            // 	shaderTimeRatio: 0.038,
            // 	shaderTimeDecay: 0,
            // 	sin: true,
            // 	sinAmplitude: 32
            // },

            alice: {
                handleGround: false,
                name: "marie",
                move: {
                    fly: true,
                    forward: false,
                    backward: false,
                },
                offset: {
                    x: 0,
                    y: 0.35,
                    z: 0.25
                },
                scale: 0.057,
                slowmo: 1
            },

            slowmo: 1,

            postproc: [
                {
                    type: "bloom",
                    value: {
                        strength: 0.45,
                        threshold: 0.0035,
                        radius: 0.1
                    }
                }
            ]

        }
    ]

}

export { end02config }