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

        <div  class="stick_inner-circle-surface">

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

    import { TimelineLite } from 'gsap';

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
                mousePos: { x:0, y:0 },
                lastKnownStickPos: { x:0, y:0 },
                transformString: "",
                inputs: {},
                inputTrigger: 0.5,
                timeoutID: {
                    mouse: null,
                    stick: null
                },
            }
        },

        watch: {
            stickPos( newVal ){

                let currentRole;

                // update all we need to
                this.mousePos = newVal;

                this.lastKnownStickPos = newVal;

                this.updateTransformString(newVal);

                // define which stick is used
                if( this.role === "bob" ){
                    // stick left
                    this.bobInputKeysHandler(newVal);

                    currentRole = "stick"

                } else {
                    // sitck right
                    this.$nuxt.$emit("mouse-pos-update", newVal);

                    currentRole = "mouse"
                    
                }


                 // cancel previous timers
                if( this.timeoutID[currentRole] ){
                    clearTimeout(this.timeoutID[currentRole]);
                }

                // create a new timer
                this.timeoutID[currentRole] = setTimeout(
                    this.stickRecenter,
                    this.core[currentRole].moveTimeout * 1000
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
                
                this.updateStickPos(this.lastKnownStickPos);
                
            },

            computePos( input ){

                const { width, left, height, top } = event.target.getBoundingClientRect();

                if( input.touches?.[0] ){

                    const goodTouch = Array.from(input.touches).find(touch => touch.target.dataset.role === this.role);

                    return {
                        x: Math.min(1,
                            Math.max(
                                -1,
                                (((goodTouch.clientX - left) / width) - 0.5) * 2
                            )
                        ),
                        y: Math.min(1,
                            Math.max(
                                -1,
                                (((goodTouch.clientY - top) / height) - 0.5) * -2
                            )
                        )
                    }

                }

            },
            
            touchMoveHandler( event ){
                event.preventDefault();

                // get normalized position for the stick
                const computedPos = this.computePos(event);

                this.updateStickPos(computedPos);

            },

            updateStickPos( event ){

                this.stickPos = event;

            },
            
            updateTransformString( position ){

                this.transformString = `translate(
                    ${position.x * 15}%,
                    ${position.y * -15}%
                )`;

            },

            bobInputKeysHandler( stickPos ){

                const inputs = {
                    shift: stickPos.y > 0.9,
                    forward: stickPos.y > this.inputTrigger,
                    backward: stickPos.y < this.inputTrigger * -1,
                    right: stickPos.x > this.inputTrigger,
                    left: stickPos.x < this.inputTrigger * -1
                };

                this.$nuxt.$emit("bob-inputs-update", inputs);

            },

            stickRecenter(){

                if( this.mouseDown ){ return; }

                console.log("recentering the mousePos (stick component)");

                const animatedObject = {
                    x: this.stickPos.x,
                    y: this.stickPos.y
                };

                const tlRecenter = new TimelineLite();

                tlRecenter.to(animatedObject, this.core.mouse.recenterDuration, {
                    x: 0,
                    y: 0,
                    onUpdate( that ){

                        that.updateStickPos(animatedObject);

                    },
                    onUpdateParams: [this]
                });

            },

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
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      width: 20vw;
      height: 20vw;
      // border: 3px solid rgba(255,255,255,0.08);
      // margin: 2vw;
      box-shadow: inset 0 0 4vw rgba(255,255,255,.1S);
      // box-sizing: border-box;
      border-radius: 50%;
    }
  }

  &_inner {
    &-circle {
      &-surface {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        width: 75%;
        height: 75%;
        // background-color: rgba(255,255,255,0.15);
        box-shadow: inset 0 0 4vw rgba(255,255,255,.2S);
        border-radius: 50%;
        pointer-events: none;
      }

      &-deep {
        width: 72%;
        height: 72%;
        background-color: rgba(255,255,255,.1);
        box-shadow: 0 5px 12px rgba(255,255,255,.3);
        border-radius: 50%;
        transform: scale(1);
        transition: all .25s;

        &.active {
          background-color: rgba(255,255,255,.3);
          // box-shadow: 0 0 0 transparent;
          box-shadow: 0 0 22px rgba(255,255,255,.4);
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>