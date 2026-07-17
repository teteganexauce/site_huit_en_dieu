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
import PageView from "../views/PageView.vue";
import RubriquesCulture from "../views/RubriquesCulture.vue";
import Partenaires from "../views/Partenaires.vue";

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';
import ResetPasswordView from '../views/auth/ResetPasswordView.vue';

import CatalogueView from '../views/shop/CatalogueView.vue';
import ProductDetailView from '../views/shop/ProductDetailView.vue';
import CartView from '../views/shop/CartView.vue';
import OrderSuccess from '../views/shop/OrderSuccess.vue';
import BookReaderView from '../views/shop/BookReaderView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: accueil },
    { path: "/e-book", name: "ebook", component: ebook },
    { path: "/e-book/detail", name: "ebook-detail", component: ebookDetail },
    { path: "/services", name: "services", component: services },
    { path: "/formations", name: "formations", component: formations },
    { path: "/formations/:id", name: "formationDetail", component: formationDetail },
    { path: "/publications", name: "publications", component: publications },
    { path: "/publications/:key", name: "publications-category", component: publications },
    { path: "/publications/detail", name: "pub-detail", component: pubDetail },
    { path: "/contact", name: "contact", component: contact },
    { path: "/objets", name: "objets", component: objets },
    { path: "/equipe-animation", name: "equipe", component: teamAnimation },
    { path: "/temoignages", name: "temoignage", component: temoignage },
    { path: "/galerie", name: "galerie", component: galerie },
    { path: "/page/:slug", name: "page", component: PageView },
    { path: "/rubriques-culture", name: "rubriquesCulture", component: RubriquesCulture },
    { path: "/partenaires", name: "partenaires", component: Partenaires },
    { path: "/profile-inscrit", name: "profileInscrit", component: profileInscrit, meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
    { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
    { path: "/forgot-password", name: "forgotPassword", component: ForgotPasswordView, meta: { guestOnly: true } },
    { path: "/password-reset/:token", name: "resetPassword", component: ResetPasswordView, meta: { guestOnly: true } },
    { path: "/boutique", name: "catalogue", component: CatalogueView },
    { path: "/boutique/:id", name: "product-detail", component: ProductDetailView },
    { path: "/panier", name: "cart", component: CartView },
    { path: "/commande/succes", name: "orderSuccess", component: OrderSuccess, meta: { requiresAuth: true } },
    { path: "/mes-livres/:livreId/lire", name: "bookReader", component: BookReaderView, meta: { requiresAuth: true } },
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
