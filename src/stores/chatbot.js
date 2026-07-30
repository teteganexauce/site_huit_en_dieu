import { defineStore } from 'pinia'
import api from '../services/api'
import { useSiteStore } from './site'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    messages: [],
    isOpen: false,
    isTyping: false,
    sessionId: null,
  }),

  getters: {
    hasMessages: (state) => state.messages.length > 0,
  },

  actions: {
    toggle() {
      this.isOpen = !this.isOpen
      if (this.isOpen && this.messages.length === 0) {
        this.addWelcomeMessage()
      }
    },

    open() {
      this.isOpen = true
      if (this.messages.length === 0) {
        this.addWelcomeMessage()
      }
    },

    close() {
      this.isOpen = false
    },

    get siteName() {
      const siteStore = useSiteStore()
      return siteStore.siteName
    },

    addWelcomeMessage() {
      this.messages.push({
        id: Date.now(),
        role: 'assistant',
        content: `👋 Bonjour ! Je suis l'assistant de **${this.siteName}**. Posez-moi toutes vos questions sur nos services, formations, boutique, publications, événements, ou le site en général. Je suis là pour vous guider !`,
        timestamp: new Date(),
      })
    },

    async sendMessage(text) {
      if (!text.trim()) return

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      }
      this.messages.push(userMessage)
      this.isTyping = true

      try {
        const response = await api.post('/chatbot/message', {
          message: text.trim(),
          session_id: this.sessionId,
          context: {
            currentPage: window.location.pathname,
          },
        })

        this.sessionId = response.data.session_id

        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.reply,
          timestamp: new Date(),
        })
      } catch {
        const history = this.messages
          .slice(-6)
          .map(m => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
          .join('\n')

        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: fallbackReply(text, history, this.siteName),
          timestamp: new Date(),
        })
      } finally {
        this.isTyping = false
      }
    },
  },
})

function fallbackReply(text, _history, siteName) {
  const t = text.toLowerCase()

  if (t.includes('objet') && (t.includes('art') || t.includes('artisanat') || t.includes('sacré') || t.includes('traditionnel')) && (t.includes('prix') || t.includes('payer') || t.includes('coûte') || t.includes('tarif') || t.includes('combien') || t.includes('achat') || t.includes('acheter') || t.includes('commander'))) {
    return 'Nos objets d\'art et articles spirituels sont disponibles dans la **boutique** (/boutique). Les prix varient selon l\'objet. Vous pouvez voir tous les produits avec leurs prix sur la page. Le paiement se fait par **carte bancaire**, **Orange Money** ou **MTN MoMo** via KkiaPay, ou en espèces. Souhaitez-vous que je vous donne plus de détails sur un type d\'objet en particulier ?'
  }

  if (t.includes('paiement') || t.includes('payer') || t.includes('mobile money') || t.includes('orange') || t.includes('momo') || t.includes('kkipay') || t.includes('mode de paiement') || t.includes('moyen de paiement')) {
    return 'Nous acceptons plusieurs moyens de paiement :\n\n💳 **Carte bancaire** (Visa, Mastercard)\n📱 **Orange Money**\n📱 **MTN Mobile Money**\n💵 **Espèces** (selon arrangement)\n\nLes paiements en ligne sont sécurisés via **KkiaPay**. Il vous suffit de sélectionner le produit/service, d\'ajouter au panier, et de choisir votre moyen de paiement au moment de valider la commande.'
  }

  if (t.includes('formation') || t.includes('cours') || t.includes('module') || t.includes('apprendre')) {
    return 'Nous proposons plusieurs **formations spirituelles et culturelles**. Vous pouvez les découvrir sur la page /formations. Les inscriptions se font en ligne. Chaque formation a son programme détaillé, sa durée et son tarif affichés. Souhaitez-vous des informations sur une formation spécifique ?'
  }

  if (t.includes('livre') || t.includes('ebook') || t.includes('publication') || t.includes('article')) {
    return 'Consultez notre bibliothèque numérique dans la section **E-books** (/e-book) et nos **publications** (/publications). Vous y trouverez des ouvrages spirituels, culturels et des articles de recherche.'
  }

  if (t.includes('événement') || t.includes('evenement') || t.includes('activité') || t.includes('rencontre') || t.includes('conférence')) {
    return 'Retrouvez tous nos **événements à venir** et notre **galerie photos** sur /galerie. Nous organisons régulièrement des conférences, ateliers et rencontres spirituelles.'
  }

  if (t.includes('contact') || t.includes('joindre') || t.includes('téléphone') || t.includes('email') || t.includes('adresse')) {
    return 'Vous pouvez nous contacter via la page /contact. Nous vous répondrons dans les plus brefs délais.'
  }

  if (t.includes('don') || t.includes('faire un don') || t.includes('soutien') || t.includes('offrande')) {
    return 'Merci pour votre générosité 🙏 Vous pouvez faire un don sécurisé sur notre page /dons. Tout soutien est précieux pour notre mission de vulgarisation spirituelle et culturelle.'
  }

  if (t.includes('inscription') || t.includes('compte') || t.includes('créer compte') || t.includes('inscrire')) {
    return 'Pour créer un compte, cliquez sur **"S\'inscrire"** dans le menu. Cela vous permettra d\'accéder à vos formations, commandes, et de suivre votre progression personnelle.'
  }

  if (t.includes('service') || t.includes('accompagnement')) {
    return 'Découvrez nos **services d\'accompagnement spirituel** dans la section /services. Nous proposons des consultations personnalisées et un suivi adapté à vos besoins.'
  }

  if (t.includes('prix') || t.includes('tarif') || t.includes('coûte')) {
    return 'Les prix varient selon les produits et services. Je vous invite à consulter la page spécifique de ce qui vous intéresse (/formations, /boutique, /services) pour voir les tarifs exacts affichés.'
  }

  if (t.includes('bonjour') || t.includes('salut') || t.includes('hello') || t.includes('bonsoir')) {
    return 'Bonjour ! Ravi de vous accueillir 😊 Comment puis-je vous aider aujourd\'hui ? Vous pouvez me poser des questions sur :\n📚 Nos formations\n🛍️ La boutique\n📖 Les publications\n📅 Les événements\n💳 Les paiements\n📞 Les contacts'
  }

  return `Je suis l'assistant de **${siteName}**. Je peux vous renseigner sur :\n\n📚 **Formations** → /formations\n🛍️ **Boutique** (objets, livres) → /boutique\n📖 **Publications** → /publications\n📅 **Événements** → /galerie\n💳 **Dons** → /dons\n📞 **Contact** → /contact\n\nQue souhaitez-vous savoir ?`
}
