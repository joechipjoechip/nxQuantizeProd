<template>
    <div class="mainHub-wrapper">

        <h2 class="font-big font01 title" :style="{ opacity: hubOpacity }">OnYi</h2>

        <p class="font-small sentence">an experience by</p>

        <div class="artist-box">

            <div class="artist-name font-medium artist-item font01" 
                :style="{ opacity: hubOpacity }"
                @mouseenter="itemsActive = true"
                @mouseleave="itemsActive = false"
            >

                <p class="caption font-small">An album by</p>

                <h3>NxQuantize</h3>

                <div class="links-container">
                    <a class="logo-container" href="https://open.spotify.com/intl-fr/artist/2aqx9dXY9qmkoyFYwB6zjW?si=Zd_XfzN7SW-n9N6DZiB29A" target="_blank">
                        <spotify-logo />
                    </a>
                    <a class="logo-container" href="https://www.instagram.com/nx_quantize/" target="_blank">
                        <instagram-logo />
                    </a>
                </div>
            </div>

            <!-- <p class="artist-spacer">&</p> -->

            <div class="artist-name font-medium artist-item font01" 
                :style="{ opacity: hubOpacity }"
                @mouseenter="itemsActive = true"
                @mouseleave="itemsActive = false"
            >

                <p class="caption font-small">An interactive experience by</p>

                <h3>Lionelu.js</h3>

                <div class="links-container">
                    <a class="logo-container" href="http://www.lionelu.fr" target="_blank">
                        <website-logo />
                    </a>
                    <a class="logo-container" href="https://www.instagram.com/lionelu.js/" target="_blank">
                        <instagram-logo />
                    </a>
                </div>

            </div>

        </div>

        <p class="font-small sentence">for</p>

        <div class="label-box label-item font-medium" 
            :style="{ opacity: hubOpacity }"
            @mouseenter="itemsActive = true"
            @mouseleave="itemsActive = false"
        >

            <p class="caption font-small">Presented by</p>

            <h3 class="font01">Omakase Recordings</h3>

            <div class="links-container">
                <a class="logo-container" href="https://www.instagram.com/omakase_recordings/" target="_blank">
                    <instagram-logo />
                </a>
                <a class="logo-container" href="https://linktr.ee/omakase" target="_blank">
                    <linktree-logo />
                </a>
                <a class="logo-container" href="https://omakaserecordings.bandcamp.com/" target="_blank">
                    <bandcamp-logo />
                </a>
                
            </div>

        </div>
        
    </div>
</template>

<script>
    import SpotifyLogo from "@/components/icons/spotify.vue"
    import InstagramLogo from "@/components/icons/instagram.vue"
    import YoutubeLogo from "@/components/icons/youtube.vue"
    import BandcampLogo from "@/components/icons/bandcamp.vue"
    import Linktree from "@/components/icons/linktree.vue"
    import WebsiteLogo from "@/components/icons/website.vue"

    export default {
        components: {
            "spotify-logo": SpotifyLogo,
            "instagram-logo": InstagramLogo,
            "youtube-logo": YoutubeLogo,
            "bandcamp-logo": BandcampLogo,
            "linktree-logo": Linktree,
            "website-logo": WebsiteLogo
        },
        data(){
            return {
                mousePos: { x:0, y:0 },
                itemsActive: false
            }
        },
        computed: {
            hubOpacity(){
                if( this.$store.state.isMobile ){
                    return 1;
                } else {
                    return this.itemsActive ? 1 : 1 - Math.max(Math.abs(this.mousePos.x) * 1.2, Math.abs(this.mousePos.y) * 1.2);
                }
            }
        },
        mounted(){
            this.$nuxt.$on("view-update-by-stick", this.handleMousePosition);
        },
        beforeDestroy(){
            this.$nuxt.$off("view-update-by-stick", this.handleMousePosition);
        },
        methods: {
            handleMousePosition( event ){
                this.mousePos = event;
            }
        }
    }
</script>

<style lang="scss" scoped>

    @import "./assets/style/variables.scss";


    .mainHub-wrapper {
        color: white;
        text-align: center;
        position: relative;
        width: 100vw;
        max-width: 750px;
        margin: 0 auto;

        --vertical-spacing: 1rem;
        --mobile-slot-size-portrait: 45vw;
        --mobile-slot-size-landscape: 30vw;

        .font {
    
            &-small,
            &-label,
            &-medium,
            &-big {
                margin: 0;
            }
    
            &-small {
                font-size: 1rem;
            }
    
            &-medium {
                font-size: 1.35rem;
            }
    
            &-big {
                font-size: 10rem;
                margin-bottom: -1.5rem;
                font-weight: 100;

                @media #{$mobile} {
                    font-size: 4rem;
                    margin-bottom: -0.5rem;
                    
                    @media (orientation: portrait) {
                        font-size: 7rem;
                    }

                    @media (orientation: landscape) {
                        display: none;
                    }
                }
            }
        }

        h3, .caption {
            margin-bottom: 0.15rem;
        }

        .title {
            // opacity: 0.2;
            color: rgba(255,255,255,1);
            text-shadow: 0 0 25px rgba(255,255,255,1);
            text-transform: uppercase;
            font-family: "Times Now" !important;
        }
        
        .caption {
            font-family: "Times Now" !important;
            opacity: 0.7;
        }

        .artist {
    
            &-box {
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                width: 100%;
                // max-width: 700px;
                margin: 0 auto;

                @media #{$mobile} {
                    // flex-flow: column nowrap;   
                }

                & > * {
                    width: 46%;
                    margin-right: var(--vertical-spacing);

                    &:last-of-type {
                        margin-right: 0;
                    }

                    @media #{$mobile} {
                        width: var(--mobile-slot-size-portrait);
                        // margin: 0 0 1rem 0;
                        
                        // &:last-of-type {
                            //     margin: 0;
                            // }
                        @media (orientation: landscape) {
                                width: var(--mobile-slot-size-landscape);
                                
                        }

                    }
                }
            }
    
        
            &-spacer {
                width: 3.5rem;
            }
        }
    
        .label {
            &-box {
                margin-top: var(--vertical-spacing);
            }
            &-item {
                // width: calc(46% * 2 + var(--vertical-spacing));
                width: 70%;

                @media #{$mobile} {
                    width: var(--mobile-slot-size-portrait);   
                }
            }
        }
    
        .artist,
        .label {
            &-item {
                display: inline-block;
                padding: 1rem 0 0.5rem 0;
                background-color: rgba(255,255,255,0.01);
                border: solid 1px rgba(255,255,255,0.4);

                -webkit-backdrop-filter: blur(12px);
                backdrop-filter: blur(12px);
                overflow: hidden;
    

                transition: opacity .2s;

                &:nth-child(1){
                    border-radius: 0 5rem 0 7rem;
                }

                &:nth-child(2){
                    border-radius: 5rem 0 7rem 0;
                }

                @media #{$mobile} {
                    border-radius: 1rem;
                    -webkit-backdrop-filter: blur(5px);
                    backdrop-filter: blur(5px);
                }
                
            }
            &-item, &-item * {
                // font-family: "Times Now" !important;
                // letter-spacing: 0.1rem;
                font-weight: 100;
            }
        }

        .label-item {
            border-radius: 0 0 12rem 12rem;

            @media #{$mobile} {
                width: 65vw;
                // border-radius: 0 5rem 0 7rem;
                @media (orientation: landscape) {
                    width: 40vw;
                    
                }
            }
        }
    
        .sentence {
            margin-bottom: var(--vertical-spacing);
            display: none;
        }

        .font01 {
            font-family: 'Neue Haas Grotesk Text';
        }

        .links-container {
            width: 100%;
            height: 100%;
            // border: solid 1px green;

            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;

        }
        
        .logo-container {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 1rem;

            border-radius: 50%;
            overflow: hidden;
            background-color: rgba(255,255,255,0);
            border: solid 1px rgba(255,255,255,0.15);
            padding: 0.5rem;
            transform: scale(1);
            
            transition: 
                background-color .25s,
                transform .2s;
            
            &:last-of-type {
                margin-right: 0;
            }
            
            &:hover {
                background-color: rgba(255,255,255,1);
                transform: scale(1.1);
            }

            svg {
                margin: 0.5rem;
                position: absolute;
                top: 0;
                left: 0;
                width: calc(100% - 1rem);
                height: calc(100% - 1rem);
            }

        }
    }

</style>