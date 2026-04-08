<template>
  <v-container fluid class="bg-black fill-height pa-4 pa-md-8">
    <v-form
      ref="formRef"
      @submit.prevent="submitForm"
      validate-on="submit"
      class="w-100"
      v-if="formData && businessData"
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
          class="text-h4 font-weight-bold mb-2 text-white text-center"
        >
          Modifier le Business
        </v-card-title>
        <v-card-subtitle class="text-center mb-6 text-grey-lighten-1">
          {{ formData.name || "Chargement..." }}
        </v-card-subtitle>

        <v-card-text>
          <div v-if="pending" class="text-center py-8">
            <v-progress-circular
              indeterminate
              color="white"
              size="48"
            ></v-progress-circular>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <v-alert type="error" variant="tonal" rounded="lg">
              Erreur lors du chargement du business
            </v-alert>
          </div>

          <template v-else>
            <!-- Section Info avec preview des données -->
            <BusinessInfoCard
              :dateCreated="businessData.date_created"
              :businessId="businessData.id"
            ></BusinessInfoCard>

            <BusinessInfoFields v-model="formData" :rules="rules" />

            <BusinessAddressFields v-model="formData" :rules="rules" />

            <!-- Preview des catégories sélectionnées avec noms -->
            <BusinessPreview
              :name="selectedCategoryNames"
              title="Catégories"
            ></BusinessPreview>

            <!-- Preview des sous-catégories -->
            <BusinessPreview
              :name="selectedSubCategoryNames"
              title="Sous-catégories"
            ></BusinessPreview>

            <!-- Preview des featured slots -->
            <BusinessPreview
              :name="selectedFeatureNames"
              title="Fonctionnalités"
            ></BusinessPreview>

            <v-row>
              <BusinessOpeningHours v-model="formData" />

              <BusinessFeatureField v-model="formData" />
            </v-row>

            <BusinessContactFields v-model="formData" />

            <BusinessCategoryFields v-model="formData" :rules="rules" />

            <ClientOnly>
              <!-- Gestion des métadonnées (inclut les médias) -->
              <BusinessMetaManager :business-id="businessId" class="mt-6" />
            </ClientOnly>

            <v-row>
              <BusinessReservationToggle v-model="formData" />
            </v-row>
          </template>
        </v-card-text>

        <v-card-actions class="px-4 pb-4 mt-6">
          <v-btn
            color="grey-lighten-1"
            variant="text"
            size="large"
            rounded="pill"
            to="/businesses"
          >
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="elevated"
            size="x-large"
            rounded="pill"
            type="submit"
            class="text-black font-weight-bold px-12"
            :loading="isSubmitting"
            :disabled="pending || !!error"
          >
            Mettre à jour
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import type { BusinessFormData } from "~/types/business";
import type { FeaturedSlot, SubCategory } from "~/types/biz";

const route = useRoute();
const businessId = route.params.id as string;

// Récupération du business avec toutes ses relations
const {
  business: businessData,
  pending,
  error,
} = useFetchSingleBusiness(businessId);
console.log("ANOTHER SINGLE ", businessData.value);

const formRef = ref<any>(null);
const isSubmitting = ref(false);

// Computed pour afficher les noms des relations sélectionnées
const selectedCategoryNames = computed(() => {
  if (!businessData.value?.categories) return [];
  // Les catégories sont déjà les objets complets avec name
  return businessData.value.categories
    .map((c: any) => c.name || c)
    .filter(Boolean);
});

const selectedSubCategoryNames = computed(() => {
  if (!businessData.value?.subcategories) return [];
  return businessData.value.subcategories
    .map((s: SubCategory) => s.name)
    .filter(Boolean);
});

const selectedFeatureNames = computed(() => {
  if (!businessData.value?.featured_slots) return [];
  return businessData.value.featured_slots
    .map((f: FeaturedSlot) => f.feature)
    .filter(Boolean);
});

const rules = {
  required: (v: string) => !!v || "Requis",
  requiredArray: (v: string[]) =>
    (v && v.length > 0) || "Sélectionnez au moins un élément",
  subCategoryRequired: (v: string[]) => {
    if (formData.value?.categories.length === 0) return true;
    return (v && v.length > 0) || "Sous-catégorie obligatoire";
  },
  email: (v: string) => !v || /.+@.+\..+/.test(v) || "Email invalide",
};

// Initialisation des données du formulaire
const formData: Ref<BusinessFormData | null> = computed(() => {
  const source = businessData.value;
  if (!source) return null;

  return {
    name: source.name || "",
    slug: source.slug || "",
    short_description: (source as any).short_description || "",
    description: source.description || "",
    price_range: source.price_range || 1,
    phone: source.phone || "",
    whatsapp: source.whatsapp || "",
    website: source.website || "",
    calendar_link: (source as any).calendar_link || "",
    reservation_available: (source as any).reservation_available || false,
    menu_url: (source as any).menu_url || "",

    // Handle hours
    hours: source.hours?.length > 0 ? source.hours[0] : null,

    // Relations - Mapping to ID strings
    categories: (source.categories || []).map((c: any) =>
      typeof c === "object" && c !== null ? String(c.id) : String(c)
    ),

    sub_categories: (source.subcategories || []).map((s: any) =>
      typeof s === "object" && s !== null ? String(s.id) : String(s)
    ),

    featuredslot: (source.featured_slots || []).map((f: any) =>
      typeof f === "object" && f !== null ? String(f.id) : String(f)
    ),
  };
});

// Gestionnaire de soumission
const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    isSubmitting.value = true;
    if (formData.value) {
      await useUpdateBusiness(businessId, formData.value);
    }
    await navigateTo("/businesses");
    isSubmitting.value = false;
  }
};
</script>
