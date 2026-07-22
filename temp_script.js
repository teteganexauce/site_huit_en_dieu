
import { ref, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-2.jpg'
import client1 from '../assets/img/clients/client-1.png'
import client2 from '../assets/img/clients/client-2.png'
import client3 from '../assets/img/clients/client-3.png'
import client4 from '../assets/img/clients/client-4.png'
import client5 from '../assets/img/clients/client-5.png'
import client6 from '../assets/img/clients/client-6.png'
import client7 from '../assets/img/clients/client-7.png'
import client8 from '../assets/img/clients/client-8.png'

import faqImg from '../assets/faq-9da729de.jpg'

const clientLogos = [client1, client2, client3, client4, client5, client6, client7, client8]

const formationsPopulaires = ref([])
const boutiqueProduits = ref([])
const publicationsRecentes = ref([])
const isLoadingFormations = ref(true)

const temoignages = ref([])
const partenaires = ref([])
const isLoadingTemoignages = ref(true)
const isLoadingPartenaires = ref(true)

// On duplique la liste des partenaires pour garantir assez de slides
// à Swiper afin que le loop soit fluide et ne s'arrête jamais,
// quel que soit le nombre réel de partenaires en base.
const partenairesSlider = computed(() => {
  const list = partenaires.value
  if (!list.length) return []
  const minSlides = 21 // 7 (slidesPerView max) x 3, marge confortable pour un loop fluide
  let result = [...list]
  while (result.length < minSlides) {
    result = result.concat(list)
  }
  return result
})

onMounted(async () => {
  try {
    const fData = await publicService.getFormations({ popular: true });
    formationsPopulaires.value = fData.data || fData;
  } catch (error) {
    console.error('Erreur chargement formations populaires:', error);
  } finally {
    isLoadingFormations.value = false;
  }

  try {
    const tData = await publicService.getTestimonials();
    temoignages.value = tData.data || tData;
  } catch (error) {
    console.error('Erreur chargement temoignages:', error);
  } finally {
    isLoadingTemoignages.value = false;
  }

  try {
    const pData = await publicService.getPartners();
    partenaires.value = pData.data || pData;
  } catch (error) {
    console.error('Erreur chargement partenaires:', error);
  } finally {
    isLoadingPartenaires.value = false;
  }

  try {
    const pData = await publicService.getCatalogue({ sort_by: 'ventes', per_page: 4, has_image: 1 });
    boutiqueProduits.value = pData.data || pData;
  } catch (error) {
    console.error('Erreur chargement boutique:', error);
  }

  try {
    const pubData = await publicService.getPublications({ per_page: 3 });
    publicationsRecentes.value = pubData.data || pubData;
  } catch (error) {
    console.error('Erreur chargement publications:', error);
  }
})

const getImageUrl = (url) => {
    if (!url) return faqImg
    if (url.includes('placeholder')) return faqImg
    return url.startsWith('http') ? url : `http://localhost:8000${url}`
}
