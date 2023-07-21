import { createRouter, createWebHistory } from 'vue-router'
import accueil from '../views/accueil.vue'
import ebook from "../views/e-books.vue";
import ebookDetail from "../views/e-book-detail.vue";
import services from "../views/services.vue";
import formations from "../views/formations.vue";
import publications from "../views/publications.vue";
import contact from "../views/contact.vue";
import objets from "../views/objets.vue";
import pubDetail from "../views/pub-detail.vue";
import teamAnimation from "../views/teamAnimation.vue";
import temoignage from "../views/temoignage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: accueil,
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
    {
      path: "/objets",
      name: "objets",
      component: objets,
    },
    {
      path: "/equipe-animation",
      name: "equipe",
      component: teamAnimation,
    },
    {
      path: "/temoignages",
      name: "temoignage",
      component: temoignage,
    },
  ],
});

export default router
