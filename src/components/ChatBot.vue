<template>
  <div class="chatbot-widget" :class="{ 'chatbot--open': store.isOpen }">
    <button class="chatbot-toggle" @click="store.toggle" :aria-label="store.isOpen ? 'Fermer le chat' : 'Ouvrir le chat'">
      <i v-if="!store.isOpen" class="bi bi-chat-dots-fill"></i>
      <i v-else class="bi bi-x-lg"></i>
    </button>

    <Transition name="chatbot-slide">
      <div v-if="store.isOpen" class="chatbot-panel">
        <div class="chatbot-header">
          <div class="d-flex align-items-center gap-2">
            <div class="chatbot-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div>
              <h6 class="mb-0 text-white">École de l'Éveil Spirituel</h6>
              <small class="text-white-50">En ligne</small>
            </div>
          </div>
          <button class="btn-close btn-close-white" @click="store.close" aria-label="Fermer"></button>
        </div>

        <div class="chatbot-messages" ref="messagesContainer">
          <div
            v-for="msg in store.messages"
            :key="msg.id"
            class="chatbot-msg"
            :class="msg.role === 'user' ? 'chatbot-msg--user' : 'chatbot-msg--bot'"
          >
            <div class="chatbot-bubble">
              <!-- On applique la fonction de nettoyage ici -->
              <p class="mb-0">{{ cleanContent(msg.content) }}</p>
              <small class="chatbot-time">{{ formatTime(msg.timestamp) }}</small>
            </div>
          </div>

          <div v-if="store.isTyping" class="chatbot-msg chatbot-msg--bot">
            <div class="chatbot-bubble chatbot-typing">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <form class="chatbot-input" @submit.prevent="sendMessage">
          <input
            v-model="inputText"
            type="text"
            placeholder="Écrivez votre message..."
            class="form-control"
            :disabled="store.isTyping"
            ref="inputRef"
          />
          <button
            type="submit"
            class="btn btn-send"
            :disabled="!inputText.trim() || store.isTyping"
          >
            <i class="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useChatbotStore } from '../stores/chatbot'
import { useSiteStore } from '../stores/site'

const store = useChatbotStore()
const siteStore = useSiteStore()
const inputText = ref('')
const messagesContainer = ref(null)
const inputRef = ref(null)

// FONCTION DE NETTOYAGE ANTI-BUG (C'est ce qui va résoudre votre problème)
function cleanContent(content) {
  if (!content) return "";
  
  // Détecte si le message est un code JS (le bug de votre capture d'écran)
  if (typeof content === 'string' && 
      (content.includes('function()') || content.includes('const _actionId') || content.includes('runningActionId'))) {
    return "Bonjour ! Je suis votre assistant virtuel pour l'Institut Nubudo. Comment puis-je vous aider aujourd'hui ? (Formations, événements, boutique, etc.)";
  }
  
  return content;
}

function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

async function sendMessage() {
  if (!inputText.value.trim() || store.isTyping) return
  const text = inputText.value
  inputText.value = ''
  await store.sendMessage(text)
}

watch(() => store.messages.length, async () => {
  await nextTick()
  scrollToBottom()
})

watch(() => store.isTyping, async () => {
  await nextTick()
  scrollToBottom()
})

watch(() => store.isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
    scrollToBottom()
  }
})

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chatbot-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--ps-primary, #1a92a7), #0e6b7a);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(26, 146, 167, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(26, 146, 167, 0.6);
}

.chatbot-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 560px;
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--ps-primary, #1a92a7), #0e6b7a);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.chatbot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chatbot-msg {
  display: flex;
  max-width: 85%;
}

.chatbot-msg--bot {
  align-self: flex-start;
}

.chatbot-msg--user {
  align-self: flex-end;
}

.chatbot-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  word-break: break-word; /* Sécurité supplémentaire contre les gros pavés de texte */
}

.chatbot-msg--bot .chatbot-bubble {
  background: white;
  border: 1px solid #e9ecef;
  border-bottom-left-radius: 4px;
  color: #212529;
}

.chatbot-msg--user .chatbot-bubble {
  background: linear-gradient(135deg, var(--ps-primary, #1a92a7), #0e6b7a);
  color: white;
  border-bottom-right-radius: 4px;
}

.chatbot-time {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.6;
}

.chatbot-typing {
  display: flex;
  gap: 4px;
  padding: 14px 18px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ps-primary, #1a92a7);
  animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.chatbot-input {
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 8px;
  background: white;
  flex-shrink: 0;
}

.chatbot-input .form-control {
  border-radius: 24px;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  font-size: 0.9rem;
}

.chatbot-input .form-control:focus {
  box-shadow: 0 0 0 2px rgba(26, 146, 167, 0.25);
  border-color: var(--ps-primary, #1a92a7);
}

.btn-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ps-primary, #1a92a7), #0e6b7a);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(26, 146, 167, 0.4);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chatbot-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chatbot-slide-leave-active {
  transition: all 0.2s ease-in;
}

.chatbot-slide-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.chatbot-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

@media (max-width: 480px) {
  .chatbot-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 0;
    bottom: 0;
  }

  .chatbot-toggle {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }
}
</style>