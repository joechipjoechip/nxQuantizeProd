<template>
    <div class="benchmark-wrapper">

        <transition name="benchmark-transition" mode="out-in">

            <div v-if="isStarted && !isDone" class="benchmark-started">
                Testing your device performances ..
            </div>

            <div v-if="!isStarted && isDone && showScore" class="benchmark-done">
                <benchmark-score />       
            </div>

        </transition>

    </div>
</template>

<script>

import BenchmarkScore from "@/components/benchmarkScore.vue"

export default {
    components: {
        "benchmark-score": BenchmarkScore
    },
    data(){
        return {
            isStarted: false,
            isDone: false,
            failCount: 0,
            showScore: true
        }
    },
    watch: {
        isDone( newVal ){
            if( newVal && !this.$store.state.badComputer && !this.$store.state.veryBadComputer ){
                setTimeout(() => {
                    this.showScore = false;
                }, 3000);
            }
        }
    },
    mounted(){
        this.$nuxt.$on("benchmark-is-started", this.handleBenchmarkStarted);
        this.$nuxt.$on("benchmark-is-done", this.handleBenchmarkDone);

        setTimeout(() => {
            this.$nuxt.$emit("please-start-benchmark", {});
        }, 3000);

    },
    beforeDestroy(){
        this.$nuxt.$off("benchmark-is-started", this.handleBenchmarkStarted);
        this.$nuxt.$off("benchmark-is-done", this.handleBenchmarkDone);
    },
    methods: {

        handleBenchmarkStarted(){
            console.log("depuis benchmarkUI : started");
            this.isStarted = true;
        },

        handleBenchmarkDone( missingFramesCountTransmitted ){
            console.log("depuis benchmarkUI : done");
            this.failCount = missingFramesCountTransmitted;
            this.isStarted = false;
            this.handleMissingFramesCountability();
            setTimeout(() => this.isDone = true, 1500);
        },

        handleMissingFramesCountability(){

            console.log("final fail count : ", this.failCount);

            if( this.failCount >= 50 ){

                this.$store.commit("setVeryBadComputer", true);


            } else if ( this.failCount > 25 ){

                this.$store.commit("setBadComputer", true);

            }

            this.detectDevice();

        },

        detectDevice(){

            console.log("user agent : ", navigator.userAgent)

            if( !navigator.userAgent.includes("Windows") ){
                this.$store.commit("setAppleUser", true)
            }

        }

    }
}
</script>

<style lang="scss" scoped>

@import "./assets/style/variables.scss";

.benchmark {

    &-started,
    &-done {
    // &-wrapper {
        position: absolute;
        top: 2vh;
        left: 2vh;
        // width: 20vw;
        padding:  0.5rem 1.25rem;
        // opacity: 1;

        border-radius: 0 4rem;
        background-color: rgba(255,255,255,0.1);
        border: solid 1px rgba(255,255,255,0.4);

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        transform: translateY(0px);

        will-change: opacity, transform;

        @media #{$mobile} {
            bottom: unset;
            top: 2vh;
        }
    }

    &-transition {

        &-enter-active {
            transition: all 0.7s ease;
        }

        &-leave-active {
            transition: all 0.3s ease;
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
            transform: translateY(-30px);
        }

        &-enter,
        &-leave{
            opacity: 0 !important;
            transform: translateY(-30px) !important;
        }

    }
}
</style>