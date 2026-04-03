<template>
  <v-col cols="12">
    <v-select
      v-model="modelValue.featuredslot"
      :items="featuredSlots"
      label="Fonctionnalités & Services"
      variant="outlined"
      rounded="lg"
      color="white"
      multiple
      chips
      closable-chips
      item-title="feature"
      item-value="id"
      prepend-inner-icon="mdi-star-circle"
      :loading="pending"
    ></v-select>
  </v-col>
</template>

<script setup lang="ts">
import type { BusinessFormData } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();

// Récupération des featured slots depuis Directus
const { data: featuredSlots, pending } = useFeaturedSlots();
</script>
