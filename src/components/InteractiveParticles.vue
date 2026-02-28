<template>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let ctx = null;
let animationFrameId = null;
let particlesArray = [];

// Mouse interaction state
let mouse = {
  x: null,
  y: null,
  radius: 150
}

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvasRef.value.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvasRef.value.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Check collision detection - mouse position / particle position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < mouse.radius + this.size){
        if (mouse.x < this.x && this.x < canvasRef.value.width - this.size * 10) {
            this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
        }
        if (mouse.y < this.y && this.y < canvasRef.value.height - this.size * 10) {
            this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
        }
    }
    
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvasRef.value.width * canvasRef.value.height) / 9000;
  
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 2) - 1;
    let directionY = (Math.random() * 2) - 1;
    let color = '#fff';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      
      if (distance < (canvasRef.value.width/7) * (canvasRef.value.height/7)) {
        opacityValue = 1 - (distance/20000);
        ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

const handleResize = () => {
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  init();
}

const handleMouseMove = (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
}

const handleMouseOut = () => {
  mouse.x = undefined;
  mouse.y = undefined;
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
    
    init();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseout', handleMouseOut);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10; /* Pastikan di atas background glitch tapi di bawah teks */
  pointer-events: none; /* Penting agar tidak menghalangi klik */
  mix-blend-mode: screen; /* Agar menyatu dengan background */
}
</style>