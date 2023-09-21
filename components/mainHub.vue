<template>
    <div class="mainHub-wrapper">

        <h2 class="font-big">OnYi</h2>

        <p class="font-small sentence">an experience by</p>

        <div class="artist-box">

            <h3 class="artist-name font-medium artist-item">NxQuantize</h3>

            <p class="artist-spacer">&</p>

            <h3 class="artist-name font-medium artist-item">Lionelu.js</h3>

        </div>

        <div class="label-box">

            <p class="font-small sentence">for</p>

            <h4 class="font-label label-item">Omakase Recordings</h4>

        </div>
        
    </div>
</template>

<script>
    export default {
        data(){
            return {}
        }
    }
</script>

<style lang="scss" scoped>

    @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;700&display=swap');

    .mainHub-wrapper {
        
        color: white;
        // border: solid 2px green;
        text-align: center;
        position: relative;

        font-family: 'Comfortaa', arial;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

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
    
            &-label {
                font-size: 1.5rem;
            }
    
            &-medium {
                font-size: 2.5rem;
            }
    
            &-big {
                font-size: 7rem;
            }
        }
    
        .artist {
    
            &-box {
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                width: 100%;
                max-width: 900px;
                margin: 0 auto;
            }
    
        
            &-spacer {
                width: 2rem;
            }
        }
    
        .label {
            &-box {
                margin-top: 2rem;
            }
        }
    
        .artist,
        .label {
            &-item {
    
                display: inline-block;
                padding: 0.75rem 1.25rem;
                border-radius: 20px;
                backdrop-filter: blur(8px);
    
                box-shadow: 0 -1px 1px rgba(255, 255, 255, 0.15),
                            0 1px 1px rgba(0,0,0, 0.15),
                            1px -1px 1px transparent;
    
                // &:hover {
                //     box-shadow: 0 -1px 0px rgba(255,255,255,0.15),
                //                 0 2px 2px rgba(0,0,0, 0.25),
                //                 0 -20px 60px #303030;
                // }
    
            }
        }
    
        .sentence {
            margin-bottom: 0.5rem;
        }
    }

</style>