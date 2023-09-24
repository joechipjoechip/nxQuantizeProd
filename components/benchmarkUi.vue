<template>
    <div>
        <div>
            <p v-if="isStarted">
                is benchmarking ...
            </p>
            <p v-if="isDone">
                benchmark is done
            </p>
        </div>

    </div>
</template>

<script>

export default {
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
            this.isDone = true;
            this.handleMissingFramesCountability();
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
</style>