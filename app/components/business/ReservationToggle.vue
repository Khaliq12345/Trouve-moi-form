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

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
</script>
