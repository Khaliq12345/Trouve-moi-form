<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="modelValue.name"
        label="Nom de l'entreprise"
        variant="outlined"
        rounded="lg"
        color="white"
        clearable
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="6">
      <div class="text-subtitle-2 mb-2 ml-2">Gamme de prix (1 à 4)</div>
      <v-slider
        v-model="modelValue.price_range"
        :ticks="[1, 2, 3, 4]"
        :max="4"
        :min="1"
        step="1"
        show-ticks="always"
        thumb-label
        color="white"
        class="mx-2"
      ></v-slider>
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field
        v-model="modelValue.calendar_link"
        label="Lien du calendrier (Booking/Calendly)"
        variant="outlined"
        rounded="lg"
        color="white"
        prepend-inner-icon="mdi-calendar"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="modelValue.description"
        label="Description complète"
        variant="outlined"
        rounded="lg"
        color="white"
        rows="3"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    required: true
  }
});
</script>
