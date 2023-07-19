import { createRouter, createWebHistory } from 'vue-router'
import accueil from '../views/accueil.vue'
import centreFormation from "../views/centre-formation.vue";
import ebook from "../views/e-books.vue";
import ebookDetail from "../views/e-book-detail.vue";
import services from "../views/services.vue";
import formations from "../views/formations.vue";
import publications from "../views/publications.vue";
import contact from "../views/contact.vue";
import pubDetail from "../views/pub-detail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: accueil,
    },
    {
      path: "/centre-de-formation",
      name: "about",
      component: centreFormation,
    },
    {
      path: "/e-book",
      name: "ebook",
      component: ebook,
    },
    {
      path: "/e-book/detail",
      name: "ebook-detail",
      component: ebookDetail,
    },
    {
      path: "/services",
      name: "services",
      component: services,
    },
    {
      path: "/formations",
      name: "formations",
      component: formations,
    },
    {
      path: "/publications",
      name: "publications",
      component: publications,
    },
    {
      path: "/publications/detail",
      name: "pub-detail",
      component: pubDetail,
    },
    {
      path: "/contact",
      name: "contactl",
      component: contact,
    },
  ],
});

export default router
