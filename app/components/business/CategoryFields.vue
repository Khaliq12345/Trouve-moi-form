<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="modelValue.categories"
        :items="categoryKeys"
        label="Catégorie principale"
        variant="outlined"
        rounded="lg"
        color="white"
        multiple
        chips
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
        :disabled="modelValue.categories.length === 0"
        :rules="[rules.subCategoryRequired]"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    required: true
  },
  predefinedCategories: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const categoryKeys = Object.keys(props.predefinedCategories);

const availableSubCategories = computed(() => {
  let options = [];
  props.modelValue.categories.forEach(cat => {
    if (props.predefinedCategories[cat]) options.push(...props.predefinedCategories[cat]);
  });
  return options;
});

const handleCategoryChange = () => {
  const valid = availableSubCategories.value;
  // Modifier directement le tableau réactif pour préserver la réactivité
  const newSubCategories = props.modelValue.sub_categories.filter(sub => valid.includes(sub));
  props.modelValue.sub_categories = newSubCategories;
};
</script>
