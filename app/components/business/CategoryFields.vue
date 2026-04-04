<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="selectedCategoryIds"
        :items="categories"
        label="Catégorie principale"
        variant="outlined"
        rounded="lg"
        color="white"
        multiple
        chips
        item-title="name"
        item-value="id"
        :loading="pendingCategories"
        @update:model-value="handleCategoryChange"
        :rules="[rules.requiredArray]"
      ></v-select>
    </v-col>

    <v-col cols="12" md="6">
      <v-select
        v-model="modelValue.sub_categories"
        :items="availableSubCategories"
        label="Sous-catégories (Obligatoire)"
        variant="outlined"
        rounded="lg"
        color="white"
        multiple
        chips
        item-title="name"
        item-value="id"
        :disabled="selectedCategoryIds.length === 0 || pendingCategories"
        :loading="pendingCategories"
        :rules="[rules.subCategoryRequired]"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { GroupedCategory, SubCategory } from '~/types/category';
import type { BusinessFormData } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
  rules: {
    requiredArray: (v: string[]) => boolean | string;
    subCategoryRequired: (v: string[]) => boolean | string;
  };
}

const props = defineProps<Props>();

// Récupération des catégories et sous-catégories depuis Directus
const { data: groupedCategories, pending: pendingCategories } = useFetchGroupedCategories();

// Liste des catégories pour le select
const categories = computed<GroupedCategory[]>(() => groupedCategories.value || []);

// IDs des catégories sélectionnées (stockage interne) - initialisé à partir des props
const selectedCategoryIds = ref<string[]>(props.modelValue.categories || []);

// Synchroniser selectedCategoryIds avec modelValue.categories (uniquement côté client)
watch(() => props.modelValue.categories, (newVal) => {
  const newCategories = newVal || [];
  // Éviter les mises à jour inutiles
  if (JSON.stringify(selectedCategoryIds.value) !== JSON.stringify(newCategories)) {
    selectedCategoryIds.value = newCategories;
    // Appeler handleCategoryChange pour mettre à jour les sous-catégories disponibles
    // (nécessaire quand les catégories sont initialisées depuis le parent, ex: page d'édition)
    handleCategoryChange();
  }
}, { deep: true });

// Mettre à jour modelValue.categories quand selectedCategoryIds change (avec vérification)
watch(selectedCategoryIds, (newVal) => {
  const currentCategories = props.modelValue.categories || [];
  if (JSON.stringify(currentCategories) !== JSON.stringify(newVal)) {
    props.modelValue.categories = [...newVal];
  }
}, { deep: true });

// Calculer les sous-catégories disponibles basées sur les catégories sélectionnées
const availableSubCategories = computed<SubCategory[]>(() => {
  if (!groupedCategories.value || selectedCategoryIds.value.length === 0) {
    return [];
  }
  
  const subCats: SubCategory[] = [];
  selectedCategoryIds.value.forEach(catId => {
    const category = groupedCategories.value?.find(c => c.id === catId);
    if (category?.sub_categories) {
      subCats.push(...category.sub_categories);
    }
  });
  
  return subCats;
});

const handleCategoryChange = () => {
  // Filtrer les sous-catégories pour ne garder que celles des catégories sélectionnées
  const validSubCatIds = availableSubCategories.value.map(sub => sub.id);
  const newSubCategories = props.modelValue.sub_categories.filter(subId => 
    validSubCatIds.includes(subId)
  );
  props.modelValue.sub_categories = newSubCategories;
};
</script>
