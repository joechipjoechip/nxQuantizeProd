<template>
    <div class="mainHub-wrapper" :style="{ opacity: hubOpacity }">

        <h2 class="font-big font01 title">OnYi</h2>

        <p class="font-small sentence">an experience by</p>

        <div class="artist-box">

            <div class="artist-name font-medium artist-item font01">

                <h3>NxQuantize</h3>

                <div class="links-container">
                    <a class="logo-container" href="https://www.spotify.com" target="_blank">
                        <spotify-logo />
                    </a>
                    <a class="logo-container" href="https://www.spotify.com" target="_blank">
                        <instagram-logo />
                    </a>
                    <a class="logo-container" href="https://www.spotify.com" target="_blank">
                        <youtube-logo />
                    </a>
                    
                </div>
            </div>

            <!-- <p class="artist-spacer">&</p> -->

            <div class="artist-name font-medium artist-item font01">

                <h3>Lionel Orsini</h3>

                <div class="links-container">
                    <a class="logo-container" href="https://www.spotify.com" target="_blank">
                        <instagram-logo />
                    </a>
                </div>

            </div>

        </div>

        <p class="font-small sentence">for</p>

        <div class="label-box label-item font-medium">

            <h3 class="font01">Omakase Recordings</h3>

            <div class="links-container">
                <a class="logo-container" href="https://www.spotify.com" target="_blank">
                    <spotify-logo />
                </a>
                <a class="logo-container" href="https://www.spotify.com" target="_blank">
                    <instagram-logo />
                </a>
                <a class="logo-container" href="https://www.spotify.com" target="_blank">
                    <youtube-logo />
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

    export default {
        components: {
            "spotify-logo": SpotifyLogo,
            "instagram-logo": InstagramLogo,
            "youtube-logo": YoutubeLogo,
            "bandcamp-logo": BandcampLogo,
        },
        data(){
            return {
                mousePos: { x:0, y:0 }
            }
        },
        computed: {
            hubOpacity(){
                return 1 - Math.max(Math.abs(this.mousePos.x) + 0.12, Math.abs(this.mousePos.y) + 0.12);
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



    .mainHub-wrapper {
        color: white;
        text-align: center;
        position: relative;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;

        --vertical-spacing: 1rem;

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
    
            // &-label {
            //     font-size: 1.5rem;
            // }
    
            &-medium {
                font-size: 1.35rem;
            }
    
            &-big {
                font-size: 10rem;
                margin-bottom: -1.5rem;
                font-weight: 100;
            }
        }

        h3 {
            margin-bottom: 0.5rem;
        }

        .title {
            // opacity: 0.2;
            color: rgba(255,255,255,0.25);
            text-shadow: 0 0 35px rgba(255,255,255,1);
            text-transform: uppercase;
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

                & > * {
                    width: 46%;
                    margin-right: var(--vertical-spacing);

                    &:last-of-type {
                        margin-right: 0;
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
                width: calc(46% * 2 + var(--vertical-spacing));
            }
        }
    
        .artist,
        .label {
            &-item {
                display: inline-block;
                padding: 1rem 0;
                border-radius: 2rem 0;
                backdrop-filter: blur(12px);
                overflow: hidden;
    
                border: solid 1px rgba(255,255,255,0.05);

                
    
                // &:hover {
                //     box-shadow: 0 -1px 0px rgba(255,255,255,0.15),
                //                 0 2px 2px rgba(0,0,0, 0.25),
                //                 0 -20px 60px #303030;
                // }
                
            }
            &-item, &-item * {
                // font-family: "Times Now" !important;
                // letter-spacing: 0.1rem;
                font-weight: 100;
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

            filter: grayscale(1);
            transition: .25s filter;

            &:hover {
                filter: grayscale(0);
            }
            
        }
        
        .logo-container {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 1rem;

            border-radius: 50%;
            overflow: hidden;
            background-color: rgba(255,255,255,0);
            border: solid 1px rgba(255,255,255,0.05);
            padding: 0.5rem;
            transform: scale(1);
            
            transition: 
                background-color .25s,
                transform .15s;
            
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