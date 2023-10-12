<template>
    <div class="blob"></div>
</template>

<script>
</script>

<style lang="scss" scoped>
.blob {
   width: 85px;
   height: 25px;
   display: grid;
   background: #000;
   filter: blur(8.8px) contrast(10);
   padding: 17.6px;
//    mix-blend-mode: darken;
}

.blob:before,
.blob:after {
   content: "";
   grid-area: 1/1;
   width: 35px;
   height: 35px;
   background: #FFF;
   animation: blob-rhf26m 2s infinite;
}

.blob:after {
   animation-delay: -1s;
}

@keyframes blob-rhf26m {
   0% {
      transform: translate(0, 0);
   }

   25% {
      transform: translate(100%, 0);
   }

   50% {
      transform: translate(100%, 100%);
   }

   75% {
      transform: translate(0, 100%);
   }

   100% {
      transform: translate(0, 0);
   }
}
</style>