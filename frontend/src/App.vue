<template>
   <main>
      <h1>Speak Darija</h1>

      <textarea
         v-model="frenchText"
         placeholder="1Entrez une phrase en français…"
         rows="4"
         :disabled="loading"
      />

      <button @click="speak" :disabled="loading || !frenchText.trim()">
         {{ loading ? 'En cours…' : 'Traduire & Parler' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <section v-if="darijaFrench">
         <h2>Darija</h2>
         <p class="darija-french">{{ darijaFrench }}</p>
         <p v-if="darijaArabic" class="darija-arabic" dir="rtl">{{ darijaArabic }}</p>
         <audio :src="audioUrl" controls autoplay />
      </section>
   </main>

   <VersionUpdater></VersionUpdater>

</template>

<script setup>
import { ref } from 'vue';

import VersionUpdater from "/src/components/VersionUpdater.vue";


const frenchText = ref('');
const darijaFrench = ref('');
const darijaArabic = ref('');
const audioUrl = ref('');
const loading = ref(false);
const error = ref('');

async function speak() {
   loading.value = true;
   error.value = '';
   darijaFrench.value = '';
   darijaArabic.value = '';
   if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
   audioUrl.value = '';

   try {
      const res = await fetch('/speak', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ text: frenchText.value }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      darijaFrench.value = decodeURIComponent(res.headers.get('X-Darija-French') ?? '');
      darijaArabic.value = decodeURIComponent(res.headers.get('X-Darija-Arabic') ?? '');
      audioUrl.value = URL.createObjectURL(await res.blob());
   } catch (err) {
      error.value = err.message;
   } finally {
      loading.value = false;
   }
}
</script>

<style>
* { box-sizing: border-box; }

body {
   font-family: system-ui, sans-serif;
   max-width: 600px;
   margin: 4rem auto;
   padding: 0 1rem;
}

h1 { margin-bottom: 1.5rem; }

textarea {
   width: 100%;
   padding: 0.75rem;
   font-size: 1rem;
   border: 1px solid #ccc;
   border-radius: 6px;
   resize: vertical;
}

button {
   margin-top: 0.75rem;
   padding: 0.6rem 1.4rem;
   font-size: 1rem;
   background: #2563eb;
   color: #fff;
   border: none;
   border-radius: 6px;
   cursor: pointer;
}

button:disabled { opacity: 0.5; cursor: not-allowed; }

section { margin-top: 2rem; }

.darija-french { font-size: 1.1rem; }

.darija-arabic {
   font-size: 1.3rem;
   font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
   color: #555;
   margin-top: 0.25rem;
}

audio { display: block; margin-top: 0.75rem; width: 100%; }

.error { color: #dc2626; }
</style>
