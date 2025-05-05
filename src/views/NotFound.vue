<style setup lang="ts"></style>

<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-center flex-column align-center border">
        <div>
          <v-text class="font-weight-bold">Navigate back to </v-text>
          <router-link :to="{ name: 'Home' }">
            <v-text size="small" color="primary">Home</v-text>
          </router-link>
        </div>
        <v-text>Page Not Found</v-text>
      </v-col>
    </v-row>
  </v-container>
</template>
