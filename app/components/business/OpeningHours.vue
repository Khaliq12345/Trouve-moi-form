<template>
  <v-col cols="12">
    <div class="text-h6 mb-4 text-grey-lighten-1">Horaires d'ouverture</div>
    <v-sheet border rounded="lg" color="transparent" class="pa-4">
      <v-row v-for="(day, index) in daysOfWeek" :key="index" align="center" class="mb-2">
        <v-col cols="12" sm="3" class="text-subtitle-1 font-weight-medium">
          {{ day }}
        </v-col>
        <v-col cols="6" sm="3">
          <v-switch
            v-model="modelValue.hours[day].closed"
            label="Fermé"
            color="error"
            hide-details
            inset
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="modelValue.hours[day].value"
            :disabled="modelValue.hours[day].closed"
            label="Tranche horaire (ex: 08:00 - 18:00)"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-sheet>
  </v-col>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
];
</script>
