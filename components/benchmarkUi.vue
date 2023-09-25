<template>
    <div>

        <transition name="benchmark-transition">
            <div v-if="isStarted" class="benchmark-started">
                is benchmarking ...
            </div>
        </transition>

        <transition name="benchmark-transition">
            <div v-if="isDone" class="benchmark-done">
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
            failCount: 0
        }
    },
    mounted(){
        this.$nuxt.$on("benchmark-is-started", this.handleBenchmarkStarted);
        this.$nuxt.$on("benchmark-is-done", this.handleBenchmarkDone);
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

            if( this.failCount >= 65 ){

                this.$store.commit("setVeryBadComputer", true);


            } else if ( this.failCount > 20 ){

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

.benchmark {
    
    &-started,
    &-done {
        position: absolute;
        bottom: 2vh;
        left: 2vh;
        width: 30vw;
        opacity: 1;

        border-radius: 8px;
        background-color: rgba(255,255,255,0.05);
        border: solid 1px rgba(255,255,255,0.05);

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        transform: translateY(0px);
    }

    &-transition {

        &-enter-active,
        &-leave-active {
            transition: all 15s ease;
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
            transform: translateY(30px);
        }

    }
}
</style>