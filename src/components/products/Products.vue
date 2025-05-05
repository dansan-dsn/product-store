<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProductStore } from "../../stores/products";
import { useRouter } from "vue-router";
import NewProduct from "./NewProduct.vue";
import type { Product } from "@/types/product";

const router = useRouter();
const productStore = useProductStore();

onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
});

const goToProduct = (sku: number) => {
  router.push(`/products/${sku}`);
};
</script>

<template>
  <v-container>
    <!-- Error State -->
    <v-alert
      v-if="productStore.error"
      :text="productStore.error"
      type="error"
      elevation="2"
      border="start"
      border-color="red"
    />

    <!-- Loading State -->
    <v-progress-linear
      v-if="productStore.isLoading"
      indeterminate
      color="primary"
      height="4"
    />

    <div v-else>
      <!-- Add Product Button -->
      <NewProduct />

      <!-- Product Grid -->
      <v-row>
        <v-col
          v-for="product in productStore.activeProducts"
          :key="product.sku"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex justify-center"
        >
          <v-card
            height="500"
            max-width="344"
            class="d-flex flex-column justify-space-between"
            @click="goToProduct(product.sku)"
          >
            <v-img
              min-width="400px"
              height="200px"
              :src="
                product.image ||
                'http://img.bbystatic.com/BestBuy_US/images/products/3465/346575_rc.jpg'
              "
              cover
            />
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle class="bg-red p-5 font-weight-bold elevation-3">
              {{ product.type }}
            </v-card-subtitle>
            <v-divider />
            <v-card-text>
              {{ product.description }}
            </v-card-text>
            <v-card-actions class="d-flex justify-space-between align-end">
              <span class="bg-success elevation-3 rounded-pill px-3">
                ${{ product.price }}
              </span>
              <v-btn
                color="error"
                size="small"
                elevation="8"
                text="Delete"
                @click.stop="productStore.deleteProduct(product.sku)"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
