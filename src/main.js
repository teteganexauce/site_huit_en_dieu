import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
import "/src/assets/img/favicon.png";
import "/src/assets/img/apple-touch-icon.png";
import "/src/assets/vendor/bootstrap/css/bootstrap.min.css";
import "/src/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "/src/assets/vendor/glightbox/css/glightbox.min.css";
import "/src/assets/vendor/swiper/swiper-bundle.min.css";
import "/src/assets/css/variables.css";
import "/src/assets/css/main.css";

import $ from "jquery/dist/jquery.min";
window.$ = $;

import "/src/assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "/src/assets/vendor/glightbox/js/glightbox.min.js";
import "/src/assets/vendor/swiper/swiper-bundle.min.js";
// import "/src/assets/vendor/isotope-layout/isotope.pkgd.min.js";
import "/src/assets/vendor/php-email-form/validate.js";
import "./assets/js/main";

const app = createApp(App);

app.use(router);

app.mount("#app");
