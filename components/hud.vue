<template>
    <div class="hud-wrapper" v-if="!$store.state.finishBegan">

        <div v-if="!$store.state.choiceHaveBeenMade"
            class="hud-arrows" :class="{ 'enabled': arrowsAreEnabled }">
            <arrow-left />
            <div class="hud-arrows-spacer"></div>
            <arrow-right />
        </div>

        <!-- <div -->
        <div v-if="timerIsEnabled && $store.state.choiceIsDisplayed && !$store.state.choiceHaveBeenMade"
            class="hud-timer-wrapper" :class="{ 'enabled': timerIsEnabled }">
            <div class="hud-timer-inner">
                <div class="hud-timer-progress" :style="{ 'width': timerProgressValue }"></div>
            </div>
        </div>

        <div class="hud-bottom">
            <camera class="hud-bottom-camera" :class="{ 'enabled': cameraIsEnabled }" />
            <move class="hud-bottom-move" :class="{ 'enabled': moveIsEnabled }" />
            <zoom class="hud-bottom-zoom" :class="{ 'enabled': zoomIsEnabled }" />
        </div>

    </div>
</template>

<script>
import ArrowLeft from "@/components/icons/arrow-left.vue";
import ArrowRight from "@/components/icons/arrow-right.vue";
import Move from "@/components/icons/move.vue";
import Zoom from "@/components/icons/zoom.vue";
import Camera from "@/components/icons/camera.vue";

export default {
    components: {
        "arrow-left": ArrowLeft,
        "arrow-right": ArrowRight,
        "move": Move,
        "zoom": Zoom,
        "camera": Camera,
    },
    data(){
        return {
            arrowsTimingIsFine: false,
            sequencesWithMove: [],
            timerIsEnabled: false,
            timerProgressValue: "0%",
            maths: {
                x1: 18,
                y1: 0,
                x2: 0,
                y2: 100,
            }
        }
    },
    computed: {
        arrowsAreEnabled(){
            return this.$store.state.choiceIsDisplayed && this.arrowsTimingIsFine && this.$store.state.choiceChangedCounter <= 2;
        },
        cameraIsEnabled(){
            return !this.$store.state.currentSequenceInfos?.hasOwnProperty("cameraFixed");
        },
        moveIsEnabled(){
            return (
                        ( 
                            this.$store.state.currentSequenceInfos.bobImposedMoves?.hasOwnProperty("left") 
                            && this.$store.state.currentSequenceInfos.bobImposedMoves?.left 
                        ) 
                        || !this.$store.state.currentSequenceInfos.bobImposedMoves?.hasOwnProperty("left")
                        // right is always equal to left, then : no need to compare it
                    )
                    || this.$store.state.choiceIsDisplayed
        },
        zoomIsEnabled(){
            return this.$store.state.currentSequenceInfos?.type === "third-person" 
                && 
                ( 
                    !this.$store.state.currentSequenceInfos?.noZoom 
                    || (this.$store.state.isMobile && !this.$store.state.currentSequenceInfos?.noZoomMobile)
                )
        }

    },
    watch: {
        "$store.state.choiceIsDisplayed"( newVal ){
            if( newVal ){
                setTimeout(() => { this.arrowsTimingIsFine = true }, 3500);
                setTimeout(() => { this.timerIsEnabled = true }, 10000);
            }
        },
        "$store.state.choiceHaveBeenMade"( newVal ){
            if( newVal ){
                this.timerIsEnabled = false;
            }
        },
        timerIsEnabled( newVal ){
            if( newVal ){
                this.$store.state.audioCurrent.addEventListener("timeupdate", this.handleTimeUpdate);
            } else {
                this.$store.state.audioCurrent.removeEventListener("timeupdate", this.handleTimeUpdate);
            }
        }
    },
    mounted(){

        this.maths.m = (this.maths.y2 - this.maths.y1) / (this.maths.x2 - this.maths.x1);
        this.maths.b = this.maths.y1 - this.maths.m * this.maths.x1;

    },
    methods: {

        handleTimeUpdate(){

            const progress = this.$store.state.choiceHaveBeenMadeTimeCode - this.$store.state.audioCurrent?.currentTime;
            this.timerProgressValue = `${this.convertToPercent(progress)}%`;

        },

        convertToPercent(progress) {
            return this.maths.m * progress + this.maths.b;;
        }

    }
}
</script>

<style lang="scss">
@import "./assets/style/variables.scss";

.hud {
    &-wrapper {
        position: absolute;
        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;
        background-color: transparent;

        display: flex;
        flex-flow: row nowrap;

        align-items: center;
        justify-content: center;

        pointer-events: none;
    }

    &-arrows {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        padding-bottom: 40vh;
        opacity: 0;

        * {
            width: 5rem;
            height: 5rem;
        }

        &.enabled {
            opacity: 0.7;

            > * {
                animation: arrowAnim 3s infinite;
            }

            .hud-arrows-spacer {
                animation: arrowSpacerAnim 3s infinite;
            }
        }
        
        &-spacer {
            width: 5vw;
        }
    }

    &-bottom {
        position: absolute;
        bottom: 2rem;
        width: 8rem;
        left: calc(50vw - 4rem);
        text-align: center;

        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        
        @media #{$mobile} {
            left: 2vw;
            bottom: unset;
            top: calc(50vh - 4rem);
            width: 8vw;
            height: 8rem;
            flex-flow: column nowrap;
            justify-content: space-between;
        }

        &-move,
        &-zoom,
        &-camera {
            width: 1.5rem;
            height: 1.5rem;

            opacity: 0.1;
            transition: opacity 0.7s;
            filter: drop-shadow(0px 0px 10px rgba(0,0,0,0.15));

            @media #{$mobile} {
                width: 2rem;
                height: 2rem;
            }
            
            &.enabled {
                opacity: 0.7;
            }

        }
    }

    &-timer {

        &-wrapper {
            position: absolute;
            top: 65vh;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            border-radius: 999px;
            overflow: hidden;

            align-items: center;
        
        }


        &-inner {
            z-index: 4;
            position: relative;
            width : 20vw;
            height: 0.25rem;
            background-color: rgba(255,255,255,0.1);
            
            @media #{$mobile} {
                width : 40vw;

            }
        }
        
        &-progress {
            z-index: 5;
            position: absolute;
            top: 0;
            left: 0;
            height: inherit;
            width: 0%;
            background-color: rgba(255,255,255,0.4);

            transition: width 0.45s;
        }

    }
}

@keyframes arrowAnim {
    0%, 75%, 100% {
        opacity: 0;
    }

    55% {
        opacity: 1;
    }
}

@keyframes arrowSpacerAnim {
    0%, 90%, 100% {
        width: 20vw;
    }

    75% {
        width: 50vw;
    }
}
</style>