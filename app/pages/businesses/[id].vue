<template>
  <v-container fluid class="bg-black fill-height pa-4 pa-md-8">
    <v-form ref="formRef" @submit.prevent="submitForm" validate-on="submit" class="w-100">
      <v-card 
        theme="dark" 
        color="grey-darken-4" 
        rounded="xl" 
        elevation="12" 
        class="pa-4 pa-md-8 mx-auto" 
        max-width="1100"
      >
        <v-card-title class="text-h4 font-weight-bold mb-2 text-white text-center">
          Modifier le Business
        </v-card-title>
        <v-card-subtitle class="text-center mb-6 text-grey-lighten-1">
          {{ formData.name || 'Chargement...' }}
        </v-card-subtitle>
        
        <v-card-text>
          <div v-if="pending" class="text-center py-8">
            <v-progress-circular indeterminate color="white" size="48"></v-progress-circular>
          </div>
          
          <div v-else-if="error" class="text-center py-8">
            <v-alert type="error" variant="tonal" rounded="lg">
              Erreur lors du chargement du business
            </v-alert>
          </div>
          
          <template v-else>
            <!-- Section Info avec preview des données -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card variant="outlined" rounded="lg" class="pa-4 bg-grey-darken-3">
                  <div class="text-subtitle-2 text-grey-lighten-1 mb-2">ID: {{ businessId }}</div>
                  <div v-if="businessData?.date_created" class="text-caption text-grey">
                    Créé le: {{ new Date(businessData.date_created).toLocaleDateString('fr-FR') }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <BusinessInfoFields v-model="formData" :rules="rules" />

            <BusinessAddressFields v-model="formData" :rules="rules" />

            <!-- Preview des catégories sélectionnées avec noms -->
            <v-row v-if="selectedCategoryNames.length > 0" class="mb-2">
              <v-col cols="12">
                <div class="text-caption text-grey-lighten-1">
                  Catégories: <span class="text-white">{{ selectedCategoryNames.join(' • ') }}</span>
                </div>
              </v-col>
            </v-row>

            <!-- Preview des sous-catégories -->
            <v-row v-if="selectedSubCategoryNames.length > 0" class="mb-2">
              <v-col cols="12">
                <div class="text-caption text-grey-lighten-1">
                  Sous-catégories: <span class="text-white">{{ selectedSubCategoryNames.join(' • ') }}</span>
                </div>
              </v-col>
            </v-row>

            <!-- Preview des featured slots -->
            <v-row v-if="selectedFeatureNames.length > 0" class="mb-2">
              <v-col cols="12">
                <div class="text-caption text-grey-lighten-1">
                  Fonctionnalités: <span class="text-white">{{ selectedFeatureNames.join(' • ') }}</span>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <BusinessOpeningHours v-model="formData" />

              <BusinessFeatureField v-model="formData" />
            </v-row>

            <BusinessContactFields v-model="formData" />

            <BusinessCategoryFields 
              v-model="formData" 
              :rules="rules" 
            />

            <!-- Gestion des métadonnées (inclut les médias) -->
            <BusinessMetaManager
              :business-id="businessId"
              class="mt-6"
            />

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
import type { BusinessFormData, DayScheduleUI } from '~/types/business';
import type { FeaturedSlot, SubCategory } from '~/types/biz';

const route = useRoute();
const businessId = route.params.id as string;

// Récupération du business avec toutes ses relations
const { business: businessData, pending, error } = useFetchSingleBusiness(businessId);

const formRef = ref<any>(null);
const isSubmitting = ref(false);

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
] as const;

const defaultHours: DayScheduleUI = daysOfWeek.reduce((acc, day) => {
  acc[day] = { closed: false, value: ['09:00', '18:00'] };
  return acc;
}, {} as DayScheduleUI);

const formData = reactive<BusinessFormData>({
  name: '',
  slug: '',
  short_description: '',
  description: '',
  price_range: 1,
  calendar_link: '',
  phone: '',
  whatsapp: '',
  website: '',
  hours: { ...defaultHours },
  featuredslot: [],
  categories: [],
  sub_categories: [],
  reservation_available: false,
  menu_url: '',
  addresses: ['']
});

// Computed pour afficher les noms des relations sélectionnées
const selectedCategoryNames = computed(() => {
  if (!businessData.value?.categories) return [];
  // Les catégories sont déjà les objets complets avec name
  return businessData.value.categories.map((c: any) => c.name || c).filter(Boolean);
});

const selectedSubCategoryNames = computed(() => {
  if (!businessData.value?.subcategories) return [];
  return businessData.value.subcategories.map((s: SubCategory) => s.name).filter(Boolean);
});

const selectedFeatureNames = computed(() => {
  if (!businessData.value?.featured_slots) return [];
  return businessData.value.featured_slots.map((f: FeaturedSlot) => f.feature).filter(Boolean);
});

const rules = {
  required: (v: string) => !!v || 'Requis',
  requiredArray: (v: string[]) => (v && v.length > 0) || 'Sélectionnez au moins un élément',
  subCategoryRequired: (v: string[]) => {
    if (formData.categories.length === 0) return true;
    return (v && v.length > 0) || 'Sous-catégorie obligatoire';
  },
  email: (v: string) => !v || /.+@.+\..+/.test(v) || 'Email invalide'
};

// Initialisation des données du formulaire
watch(businessData, (newBusiness) => {
  if (newBusiness) {
    
    // Assignation propre pour éviter de polluer le formData
    formData.name = newBusiness.name || '';
    formData.slug = newBusiness.slug || '';
    formData.short_description = (newBusiness as any).short_description || '';
    formData.description = newBusiness.description || '';
    formData.price_range = newBusiness.price_range || 1;
    formData.phone = newBusiness.phone || '';
    formData.whatsapp = newBusiness.whatsapp || '';
    formData.website = newBusiness.website || '';
    formData.calendar_link = (newBusiness as any).calendar_link || '';
    formData.reservation_available = (newBusiness as any).reservation_available || false;
    formData.menu_url = (newBusiness as any).menu_url || '';
    
    // Heures - conversion depuis le format Directus [array avec jours anglais]
    if (newBusiness.hours) {
      const hoursData = Array.isArray(newBusiness.hours) 
        ? newBusiness.hours[0] 
        : newBusiness.hours;
      
      const dayMapping: Record<string, string> = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
      };
      
      daysOfWeek.forEach((day) => {
        const englishDay = Object.keys(dayMapping).find(k => dayMapping[k] === day);
        const dayData = englishDay ? hoursData[englishDay] : null;
        
        if (dayData) {
          const isClosed = dayData.open === null || dayData.close === null;
          formData.hours[day] = {
            closed: isClosed,
            value: [
              dayData.open || '09:00',
              dayData.close || '18:00'
            ]
          };
        } else {
          formData.hours[day] = { closed: false, value: ['09:00', '18:00'] };
        }
      });
    }
    
    // Relations - Extraire les IDs des objets complets
    // Les categories sont déjà des objets avec id et name
    formData.categories = (newBusiness.categories || []).map((c: any) => {
      return typeof c === 'object' && c !== null ? String(c.id) : String(c);
    });
    
    // Les subcategories sont des objets SubCategory complets
    formData.sub_categories = (newBusiness.subcategories || []).map((s: any) => {
      return typeof s === 'object' && s !== null ? String(s.id) : String(s);
    });
    
    // Les featured_slots sont des objets FeaturedSlot complets
    formData.featuredslot = (newBusiness.featured_slots || []).map((f: any) => {
      return typeof f === 'object' && f !== null ? String(f.id) : String(f);
    });
    
    // Adresses - depuis le champ addresses (array de strings)
    if (newBusiness.addresses && newBusiness.addresses.length > 0) {
      formData.addresses = newBusiness.addresses.filter((a: string) => a?.trim());
    } else if ((newBusiness as any).locations && (newBusiness as any).locations.length > 0) {
      // Fallback sur locations si addresses vide
      formData.addresses = (newBusiness as any).locations.map((loc: any) => loc.address || '').filter(Boolean);
    } else {
      formData.addresses = [''];
    }
  }
}, { deep: true });

// Gestionnaire de soumission
const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  
  if (valid) {
    isSubmitting.value = true;
    await useUpdateBusiness(businessId, formData);
    await navigateTo('/businesses');
    isSubmitting.value = false;
  }
};
</script>