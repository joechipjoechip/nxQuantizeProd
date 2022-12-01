<template>
    <div 
        :class="`stick_hitbox-${side}`"
        :data-role="role"

        @touchstart="touchStartHandler"
        @mousedown="touchStartHandler"
        @touchmove="touchMoveHandler"

        @touchend="touchEndHandler"
        @mouseup="touchEndHandler"
    >

        <div 
            class="stick_inner-circle-surface"
        >

            <div 
                class="stick_inner-circle-deep"
                :class="{ active: mouseDown }"
                :style="{'transform': transformString }"
            >
            </div>

        </div>

    </div>
</template>

<script>

    import { core } from '@/static/config/core.js';

    export default {
        props: {

            side: {
                type: String,
                required: true
            },

            role: {
                type: String,
                required: true
            }
        },

        data(){
            return {
                core,
                mouseDown: false,
                mouseUp: true,
                circleActive: false,
                stickPos: { x:0, y:0 },
                transformString: "",
                inputs: {},
                inputTrigger: 0.5,
                individualTimeout: null
            }
        },

        watch: {
            stickPos( newVal ){

                this.updateTransformString(newVal);

                this.updateParents();

                if( this.individualTimeout ){
					clearTimeout(this.individualTimeout);
				}

				this.individualTimeout = setTimeout(
					this.$parent.mouseRecenter,
					this.core.stick.moveTimeout * 1000
				);

            }
        },

        methods: {

            touchStartHandler( event ){
                event.preventDefault();

                // console.log("mouse DOWN : ", event);
                this.mouseDown = true;
                this.mouseUp = false;

            },

            touchEndHandler( event ){
                event.preventDefault();
                
                // console.log("mouse UP : ", event);
                this.mouseUp = true;
                this.mouseDown = false;
                
            },
            
            touchMoveHandler( event ){
                event.preventDefault();

                const { width, left, height, top } = event.target.getBoundingClientRect();

                // get normalized position for the stick
                const stickPos = {
                    x: Math.min(1,
                            Math.max(
                                -1,
                                (((event.touches[0].clientX - left) / width) - 0.5) * 2
                            )
                    ),
                    y: Math.min(1,
                            Math.max(
                                -1,
                                (((event.touches[0].clientY - top) / height) - 0.5) * -2
                            )
                    )
                }

                this.updateStickPos(stickPos);

                if( event.target.dataset.role === "bob" ){

                    this.bobInputKeysHandler(stickPos);

                }

                // console.log("mouse MOVE : ", this.stickPos);
            },

            updateStickPos( event ){

                const { x, y } = event;

                this.stickPos = { x, y };

            },
            
            updateTransformString( position ){

                this.transformString = `translate(
                    ${position.x * 15}%,
                    ${position.y * -15}%
                )`;

            },

            updateParents(){

                this.$nuxt.$emit("stick-pos-update", this.stickPos);

            },

            bobInputKeysHandler( stickPos ){

                const inputs = {
                    forward: stickPos.y > this.inputTrigger,
                    backward: stickPos.y < this.inputTrigger * -1,
                    right: stickPos.x > this.inputTrigger,
                    left: stickPos.x < this.inputTrigger * -1
                };

                this.$nuxt.$emit("bob-inputs-update", inputs);

            }

        }
    }
</script>

<style lang="scss" scoped>

    .stick {

        &_hitbox {
        
            // &-left {
            //     background-color: rgba(0,0,255,0.2);
            // }
        
            // &-right {
            //     background-color: rgba(0,255,0,0.2);
            // }
            
            &-left,
            &-right {
                // box-sizing: border-box;
                border-radius: 50%;
                // border: 3px solid rgba(255,255,255,0.08);
                // margin: 2vw;
                box-shadow: inset 0 0 4vw rgba(255,255,255,0.1S);

                width: 20vw;
                height: 20vw;

                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
            }
        
        }

        &_inner {

            &-circle {

                &-surface {

                    pointer-events: none;
                   
                    border-radius: 50%;
                    width: 75%;
                    height: 75%;
    
                    // background-color: rgba(255,255,255,0.15);
                    box-shadow: inset 0 0 4vw rgba(255,255,255,0.2S);

                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: center;
                    align-items: center;
                    
                }
    
                &-deep {
                   
                    border-radius: 50%;
                    width: 72%;
                    height: 72%;
    
                    background-color: rgba(255,255,255,0.1);
                    box-shadow: 0 5px 12px rgba(255,255,255,0.3);
                    transform: scale(1);
                    
                    transition: all .25s;
                    
                    &.active {
                        transform: scale(1.2);
                        background-color: rgba(255,255,255,0.3);
                        // box-shadow: 0 0 0 transparent;
                        box-shadow: 0px 0px 22px rgba(255,255,255,0.4);
                    }
    
                }
            }
            
        }
    }

</style>