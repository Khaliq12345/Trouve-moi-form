<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="modelValue.phone"
        label="Téléphone"
        variant="outlined"
        rounded="lg"
        color="white"
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field
        v-model="modelValue.whatsapp"
        label="WhatsApp"
        variant="outlined"
        rounded="lg"
        color="white"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { BusinessFormData } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();
</script>
