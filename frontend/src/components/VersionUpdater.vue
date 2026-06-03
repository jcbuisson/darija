<script setup lang="ts">
/// <reference types="vite-plugin-pwa/vue" />
import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref, watch } from "vue";

// check new version every 10s
const { needRefresh, updateServiceWorker } = useRegisterSW({
   onRegistered(r) {
      r && setInterval(() => r.update(), 10000);
   },
});

const updating = ref(false);

watch(needRefresh, (value) => {
   if (value && !updating.value) {
      updating.value = true;
      // updateServiceWorker() immediately resets needRefresh to false,
      // so we use our own `updating` ref to keep the banner visible
      updateServiceWorker(true);
      // Fallback: force reload if the SW controllerchange never fires
      setTimeout(() => window.location.reload(), 4000);
   }
});
</script>

<template>
   <div v-if="updating" class="pwatoast">
      Mise à jour en cours...
   </div>
</template>

<style>
.pwatoast {
   position: fixed;
   bottom: 0px;
   right: 0px;
   margin: 3rem /* 16px */;
   padding: 1rem /* 16px */;
   color: rgba(0, 0, 0, 0.662);
   background-color: #dcfce7;
   border-style: solid;
   border-radius: 0.25rem /* 4px */;
   border-color: #dcfce7;
   z-index: 50;
}
.pwatoast-text {
   color: #60a5fa;
   margin-left: 0.5rem /* 8px */;
}
.pwatoast-text:hover {
   text-decoration-line: underline;
}
</style>
