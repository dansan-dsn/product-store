<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/products";

const productStore = useProductStore();
const route = useRoute();
const sku = Number(route.params.sku);

watch(
  () => sku,
  (newSKU) => {
    if (!isNaN(newSKU)) {
      productStore.fetchProductBySku(newSKU);
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- Loading Indicator -->
        <v-progress-linear
          v-if="productStore.isLoading"
          indeterminate
          color="primary"
          height="4"
        />

        <!-- Error Alert -->
        <v-alert
          v-else-if="productStore.error"
          type="error"
          :text="productStore.error"
          class="mb-4"
        />

        <!-- Product Display -->
        <template v-else-if="productStore.currentProduct">
          <v-card class="pa-4" elevation="2">
            <v-row>
              <!-- Product Image Holder -->
              <v-col cols="12" md="6">
                <v-sheet
                  class="d-flex align-center justify-center pa-2"
                  elevation="1"
                  rounded
                  color="grey-lighten-4"
                >
                  <img
                    :src="
                      productStore.currentProduct.image ||
                      'http://img.bbystatic.com/BestBuy_US/images/products/3465/346575_rc.jpg'
                    "
                    :alt="productStore.currentProduct.name || 'Product image'"
                    style="max-height: 400px; width: 100%; object-fit: contain"
                    class="rounded"
                  />
                </v-sheet>
              </v-col>

              <!-- Product Info Holder -->
              <v-col cols="12" md="6">
                <v-sheet class="pa-4" rounded elevation="0">
                  <h1 class="text-h5 font-weight-bold mb-2">
                    {{ productStore.currentProduct.name }}
                  </h1>
                  <div class="text-subtitle-1 mb-2">
                    <strong>SKU:</strong> {{ sku }}
                  </div>
                  <div class="text-h6 text-primary mb-4">
                    ${{ productStore.currentProduct.price }}
                  </div>
                  <p class="text-body-1">
                    {{ productStore.currentProduct.description }}
                  </p>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </template>

        <!-- No Data Fallback -->
        <v-alert
          v-else
          type="info"
          text="No product data available"
          class="mt-4"
        />
      </v-container>
    </v-main>
  </v-app>
</template>
