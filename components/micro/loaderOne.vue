<template>
	<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
</template>

<style lang="scss" scoped>
.lds-ring {
  display: inline-block;
  position: relative;
  width: 1rem;
  height: 1rem;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 0.85rem;
  height: 0.85rem;
  margin: 0.1rem;
  border: 0.1rem solid #000000;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000000 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>