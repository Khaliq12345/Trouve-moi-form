<template>
  <v-col cols="12">
    <div class="text-h6 mb-4 text-grey-lighten-1">Horaires d'ouverture</div>
    <v-sheet border rounded="lg" color="transparent" class="pa-4">
      <v-row
        v-for="(day, index) in daysOfWeek"
        :key="index"
        align="center"
        class="mb-2"
      >
        <v-col cols="12" sm="3" class="text-subtitle-1 font-weight-medium">
          {{ day }}
        </v-col>

        <!-- Open time -->
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="modelValue.hours[day].open"
            label="Ouverture"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
            placeholder="09:00"
          ></v-text-field>
        </v-col>

        <!-- CLose time -->
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="modelValue.hours[day].close"
            label="Fermeture"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
            placeholder="18:00"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-sheet>
  </v-col>
</template>

<script setup lang="ts">
import type { BusinessFormData, DaySchedule } from "~/types/business";

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();

// Liste des jours pour la boucle de l'interface des horaires
const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

// Initialisation des horaires au format Directus (open/close/null)
if (Object.keys(props.modelValue.hours).length === 0) {
  props.modelValue.hours = daysOfWeek.reduce((acc, day) => {
    acc[day] = { open: "09:00", close: "18:00" };
    return acc;
  }, {} as DaySchedule);
}
</script>
