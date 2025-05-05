<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <v-app>
    <v-container max-width="1200px">
      <Navbar />
      <router-view />
    </v-container>
  </v-app>
</template>
