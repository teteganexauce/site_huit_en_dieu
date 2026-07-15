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
import galerie from "../views/galerie.vue";
import formationDetail from '../views/formationDetail.vue';
import profileInscrit from "../views/profileInscrit.vue";

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';
import ResetPasswordView from '../views/auth/ResetPasswordView.vue';

import CatalogueView from '../views/shop/CatalogueView.vue';
import ProductDetailView from '../views/shop/ProductDetailView.vue';
import CartView from '../views/shop/CartView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: accueil,
    },
    {
      path: "/boutique",
      name: "catalogue",
      component: CatalogueView,
    },
    {
      path: "/boutique/:id",
      name: "product-detail",
      component: ProductDetailView,
    },
    {
      path: "/panier",
      name: "cart",
      component: CartView,
    },
    {
      path: "/e-book",
      name: "ebook",
      component: ebook,
    },
    {
      path: "/e-book/:id",
      name: "ebook-detail",
      component: ProductDetailView,
    },
    {
      path: "/services",
      name: "services",
      component: services,
    },
    {
      path: "/formations/:id",
      name: "formationDetail",
      component: formationDetail,
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
      path: "/publications/:key",
      name: "publications-category",
      component: publications,
    },
    {
      path: "/publications/detail/:id",
      name: "pub-detail",
      component: pubDetail,
    },
    {
      path: "/contact",
      name: "contact",
      component: contact,
    },
    {
      path: "/objets",
      name: "objets",
      component: objets,
    },
    {
      path: "/objets/:id",
      name: "objet-detail",
      component: ProductDetailView,
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
    {
      path: "/galerie",
      name: "galerie",
      component: galerie,
    },
    {
      path: "/profile-inscrit",
      name: "profileInscrit",
      component: profileInscrit,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: ForgotPasswordView,
      meta: { guestOnly: true }
    },
    {
      path: "/password-reset/:token",
      name: "resetPassword",
      component: ResetPasswordView,
      meta: { guestOnly: true }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'profileInscrit' });
  } else {
    next();
  }
});

export default router
