<script setup>
import { watch, onMounted } from "vue";
import { useTheme } from "vuetify";
import { storeToRefs } from "pinia";
import { useThemeStore } from "../stores/theme";

const themeStore = useThemeStore();
const vuetifyTheme = useTheme();

const { currentTheme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;

onMounted(() => {
  vuetifyTheme.global.name.value = currentTheme.value;
});

watch(currentTheme, (newTheme) => {
  vuetifyTheme.global.name.value = newTheme;
});
</script>

<template>
  <div class="d-flex justify-center mb-5">
    <v-btn @click="toggleTheme">
      Toggle Theme (Current: {{ themeStore.currentTheme }})
    </v-btn>
  </div>
</template>
