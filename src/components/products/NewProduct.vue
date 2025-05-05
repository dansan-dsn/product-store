<script setup>
import { ref, shallowRef, computed } from "vue";
import { useProductStore } from "../../stores/products";

const productStore = useProductStore();
const dialog = shallowRef(false);
const success = ref("");
const errors = ref({});
const showSnackbar = ref(false);

const newProduct = ref({
  name: "",
  sku: null,
  price: null,
  image: "",
  type: "",
  description: "",
  deleted: 0,
});

const generateSku = computed(() => {
  return Math.floor(Math.random() * 9000000 + 1000000);
});

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!newProduct.value.name.trim()) {
    errors.value.name = "Product name is required";
    isValid = false;
  }

  if (newProduct.value.price <= 0) {
    errors.value.price = "Price must be greater than 0";
    isValid = false;
  }

  if (!newProduct.value.type) {
    errors.value.type = "Product type is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (newProduct.value.image && newProduct.value.image.length > 0) {
      const file = newProduct.value.image[0];
      newProduct.value.image = await convertToBase64(file);
    } else {
      newProduct.value.image = "";
    }

    newProduct.value.sku = generateSku.value;

    await productStore.addProduct(newProduct.value);

    // Close dialog first
    dialog.value = false;

    // Then show success message
    success.value = "Product Added Successfully";
    showSnackbar.value = true;

    // Reset form after dialog is closed
    resetForm();
  } catch (error) {
    errors.value.form = "Failed to add product. Please try again.";
    console.error("Error adding product:", error);
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

const resetForm = () => {
  newProduct.value = {
    name: "",
    sku: null,
    price: 0,
    image: "",
    type: "",
    description: "",
    deleted: 0,
  };
  errors.value = {};
};
</script>

<template>
  <v-snackbar
    v-model="showSnackbar"
    color="success"
    timeout="3000"
    location="top"
  >
    {{ success }}
  </v-snackbar>

  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-plus-circle"
          text="New Product"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card prepend-icon="" title="New Product">
        <v-card-text>
          <v-alert v-if="errors.form" type="error" class="mb-4">
            {{ errors.form }}
          </v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Name*"
                v-model="newProduct.name"
                :error-messages="errors.name"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                label="Price*"
                v-model="newProduct.price"
                type="number"
                :error-messages="errors.price"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-file-input
                hint="Only .png, .jpg, .jpeg, .bmp files are accepted"
                label="Image"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon=""
                persistent-hint
                v-model="newProduct.image"
              ></v-file-input>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                :items="['HardGood', 'Soft', 'MediumHard']"
                label="Type*"
                v-model="newProduct.type"
                :error-messages="errors.type"
                required
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12">
              <v-textarea
                label="Description"
                v-model="newProduct.description"
              ></v-textarea>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false" />

          <v-btn
            color="primary"
            text="Save"
            type="submit"
            variant="tonal"
            @click="handleSubmit"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
