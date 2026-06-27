<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F4F6FA] px-4 py-12 relative overflow-hidden select-none">
    <!-- Decorative background elements -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#081342]/5 blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1e3a8a]/5 blur-3xl"></div>

    <div class="w-full max-w-md z-10">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#081342] text-white shadow-lg mb-4">
          <svg
            class="w-9 h-9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M18.5 4h-13a2.5 2.5 0 0 0-2.5 2.5v9a2.5 2.5 0 0 0 2.5 2.5h2.5L10 21l3.5-3h5a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 18.5 4z"
            />
            <path d="M7 9h6" />
            <circle cx="15" cy="11" r="1" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-[#081342] font-outfit tracking-tight">RefFinance</h1>
        <p class="text-slate-500 mt-2 text-sm">Ingresa a tu cuenta de gestión financiera</p>
      </div>

      <!-- Card -->
      <div class="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-xl bg-white/95">
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Alert Message -->
          <Transition name="fade">
            <div v-if="errorMessage" class="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2.5">
              <AlertCircle class="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- WhatsApp Input -->
          <div>
            <label for="whatsapp" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">WhatsApp</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MessageSquare class="w-5 h-5" />
              </div>
              <input
                id="whatsapp"
                v-model="whatsapp"
                type="text"
                required
                placeholder="Ej. +54911223344"
                class="block w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#081342] focus:bg-white focus:ring-2 focus:ring-[#081342]/5 transition-all duration-200"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="contrasenia" class="block text-xs font-bold uppercase tracking-wider text-slate-500">Contraseña</label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock class="w-5 h-5" />
              </div>
              <input
                id="contrasenia"
                v-model="contrasenia"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="block w-full pl-11 pr-11 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#081342] focus:bg-white focus:ring-2 focus:ring-[#081342]/5 transition-all duration-200"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Eye v-if="showPassword" class="w-4.5 h-4.5" />
                <EyeOff v-else class="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#081342] hover:bg-[#000b33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#081342] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
            <span v-else class="flex items-center gap-1.5">
              <span>Ingresar al Portal</span>
              <ArrowRight class="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </form>
      </div>

      <!-- Footer Info -->
      <p class="text-center text-slate-400 text-xs mt-6 flex items-center justify-center gap-1">
        <ShieldCheck class="w-4 h-4 text-emerald-500" />
        <span>Conexión segura SSL. Todos los datos cifrados.</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Lock, MessageSquare, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-vue-next";
import api from "../services/api.js";

const router = useRouter();
const whatsapp = ref("");
const contrasenia = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const res = await api.loginUser(whatsapp.value, contrasenia.value);
    if (res && res.status) {
      router.push({ name: "tablero" });
    } else {
      errorMessage.value = res.message || "Credenciales inválidas. Por favor verifique sus datos.";
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Error al conectar con el servidor. Intente nuevamente.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
