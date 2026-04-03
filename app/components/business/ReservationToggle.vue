<template>
  <v-col cols="12">
    <v-switch
      v-model="modelValue.reservation_available"
      label="Réservation possible"
      color="green-accent-3"
      inset
    ></v-switch>
  </v-col>
</template>

<script setup lang="ts">
import type { BusinessFormData } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();
</script>
