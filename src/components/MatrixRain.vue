<template>
  <canvas ref="matrixCanvas" class="matrix-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const matrixCanvas = ref(null);
let ctx = null;
let animationInterval = null;

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()";
const charArray = characters.split("");

let fontSize = 14;
let columns = 0;
let drops = [];

const draw = () => {
  // Semi-transparent black to create trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, matrixCanvas.value.width, matrixCanvas.value.height);

  ctx.fillStyle = "#0F0"; // Green text
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = charArray[Math.floor(Math.random() * charArray.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reset drop to top randomly or if it's off screen
    if (drops[i] * fontSize > matrixCanvas.value.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
};

const handleResize = () => {
  if (matrixCanvas.value) {
    matrixCanvas.value.width = window.innerWidth;
    matrixCanvas.value.height = window.innerHeight;
    
    columns = matrixCanvas.value.width / fontSize;
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
  }
};

onMounted(() => {
  if (matrixCanvas.value) {
    ctx = matrixCanvas.value.getContext("2d");
    handleResize();
    
    // Run animation loop
    animationInterval = setInterval(draw, 33); // ~30fps
    
    window.addEventListener("resize", handleResize);
  }
});

onUnmounted(() => {
  clearInterval(animationInterval);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.matrix-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1; /* Behind content but visible */
  pointer-events: none;
  opacity: 0.3; /* Subtle effect */
  mix-blend-mode: screen;
}
</style>