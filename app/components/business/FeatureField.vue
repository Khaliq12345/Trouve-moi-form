<template>
  <v-col cols="12">
    <v-combobox
      v-model="modelValue.featuredslot"
      label="Fonctionnalités & Services (Appuyez sur Entrée pour ajouter)"
      variant="outlined"
      rounded="lg"
      color="white"
      multiple
      chips
      closable-chips
      prepend-inner-icon="mdi-star-circle"
    ></v-combobox>
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
