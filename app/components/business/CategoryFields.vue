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
import { computed } from 'vue';
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

// Computed pour gérer la bi-directionnalité sans double watch
const selectedCategoryIds = computed<string[]>({
  get: () => props.modelValue.categories || [],
  set: (newVal) => {
    props.modelValue.categories = [...newVal];
    // Filtrer les sous-catégories pour ne garder que celles des catégories sélectionnées
    const validSubCatIds = availableSubCategories.value.map(sub => sub.id);
    props.modelValue.sub_categories = props.modelValue.sub_categories.filter(subId =>
      validSubCatIds.includes(subId)
    );
  }
});

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
</script>
