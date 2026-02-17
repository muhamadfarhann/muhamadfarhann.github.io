import { createApp } from "vue";
import App from "./App.vue";
import imagesLoaded from "imagesloaded";

// Global CSS
import "../css/base.css";
import "../css/style.css";

// Make imagesLoaded available globally as expected by style.js
window.imagesLoaded = imagesLoaded;

createApp(App).mount("#vue-root");
