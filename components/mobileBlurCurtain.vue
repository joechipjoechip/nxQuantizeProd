<template>
    <div class="mobile-blur-curtain-wrapper"
        :class="{ 'enabled': $store.state.mobileBlurCurtainIsDisplayed }"
    >
        <div @click="handlePlayClick" class="play-button-wrapper">
            <play-button class="play-button-clickable" />
        </div>
    </div>
</template>

<script>
import PlayButton from "@/components/icons/play.vue"

export default {
    components: {
        "play-button": PlayButton
    },
    data(){
        return {}
    },
    methods: {
        handlePlayClick(){
            this.$store.commit("setMobileBlurCurtainIsDisplayed", false);
            const customEvent = new CustomEvent("focus");
            window.dispatchEvent(customEvent);
        }
    }
}
</script>

<style lang="scss" scoped>

.mobile-blur-curtain {
    &-wrapper {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        background-color: rgba(0,0,0,0.7);
        opacity: 0;
        
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        
        &.enabled {
            pointer-events: all;
            opacity: 1;
        }

    }
}

.play-button {

    &-wrapper {
        opacity: 0.6;
        pointer-events: all;

        *{
            pointer-events: none;
        }

    }

    &-clickable {
        width: 10rem;
        height: 10rem;
    }
}
</style>