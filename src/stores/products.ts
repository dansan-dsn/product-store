import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";
import type { Product } from "../types/product";

const baseUrl: string = "http://localhost:3000/products";

export const useProductStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${baseUrl}`);
      if (!response.data) throw new Error("Failed to fetch products");
      products.value = await response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "UnKnow error occured";
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductBySku = async (sku: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${baseUrl}?sku=${sku}`);

      if (!response.data) throw new Error(`HTTP ${response.status}`);

      const products = await response.data;

      currentProduct.value = products[0];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Fetch failed";
    } finally {
      isLoading.value = false;
    }
  };

  const addProduct = async (product: Product) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${baseUrl}`, product);

      if (!response.data) throw new Error("Failed to add product");
      products.value.push(response.data);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "UnKnow error occured";
    } finally {
      isLoading.value = false;
    }
  };

  const activeProducts = computed(() =>
    products.value.filter((p) => p.deleted !== 1)
  );

  const deleteProduct = (sku: number) => {
    const product = products.value.find((p) => p.sku === sku);
    if (product) product.deleted = 1;
  };

  return {
    products,
    currentProduct,
    error,
    isLoading,
    fetchProducts,
    fetchProductBySku,
    addProduct,
    deleteProduct,
    activeProducts,
  };
});
