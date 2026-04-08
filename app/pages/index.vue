<template>
  <v-container fluid class="bg-black fill-height pa-4 pa-md-8">
    <v-form
      ref="formRef"
      @submit.prevent="submitForm"
      validate-on="submit"
      class="w-100"
    >
      <v-card
        theme="dark"
        color="grey-darken-4"
        rounded="xl"
        elevation="12"
        class="pa-4 pa-md-8 mx-auto"
        max-width="1100"
      >
        <v-card-title
          class="text-h4 font-weight-bold mb-8 text-white text-center"
        >
          Configuration du Business
        </v-card-title>
        <p>{{ formData }}</p>

        <v-card-text>
          <BusinessInfoFields v-model="formData" :rules="rules" />

          <BusinessAddressFields v-model="formData" :rules="rules" />

          <v-row>
            <BusinessOpeningHours v-model="formData" />

            <BusinessFeatureField v-model="formData" />
          </v-row>

          <BusinessContactFields v-model="formData" />

          <BusinessCategoryFields v-model="formData" :rules="rules" />

          <v-row>
            <BusinessReservationToggle v-model="formData" />
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4 pb-4 mt-6">
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="elevated"
            size="x-large"
            rounded="pill"
            type="submit"
            class="text-black font-weight-bold px-12"
            :loading="isSubmitting"
          >
            Enregistrer le Business
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { BusinessFormData, DaySchedule } from "~/types/business";

// Référence pour le contrôle du formulaire
const formRef = ref<any>(null);
const isSubmitting = ref(false);

// Structure de données conforme à vos besoins Directus
const formData = reactive<BusinessFormData>({
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price_range: 1,
  calendar_link: "",
  phone: "",
  whatsapp: "",
  website: "",
  hours: {} as DaySchedule,
  featuredslot: [],
  categories: [],
  sub_categories: [],
  reservation_available: false,
  menu_url: "",
  addresses: [""],
});

// Règles de validation
const rules = {
  required: (v: string) => !!v || "Requis",
  requiredArray: (v: string[]) =>
    (v && v.length > 0) || "Sélectionnez au moins un élément",
  subCategoryRequired: (v: string[]) => {
    if (formData.categories.length === 0) return true;
    return (v && v.length > 0) || "Sous-catégorie obligatoire";
  },
};

// Soumission vers Directus
const { createBusiness } = useCreateBusiness();

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    isSubmitting.value = true;

    try {
      // Créer le business dans Directus
      await createBusiness(formData);
    } catch (error) {
      // Error handled silently
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>
