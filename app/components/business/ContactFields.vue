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

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
</script>
