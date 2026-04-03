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
            v-model="isClosed[day]"
            label="Fermé"
            color="error"
            hide-details
            inset
            @update:model-value="(val) => toggleClosed(day, val)"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="timeValues[day].open"
            :disabled="isClosed[day]"
            label="Ouverture"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
            placeholder="09:00"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="timeValues[day].close"
            :disabled="isClosed[day]"
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
import { reactive, watch } from 'vue';
import type { BusinessFormData, DaySchedule } from '~/types';

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
] as const;

// État local pour le switch "Fermé" (true si open === null)
const isClosed = reactive<Record<keyof DaySchedule, boolean>>({
  Lundi: props.modelValue.hours.Lundi.open === null,
  Mardi: props.modelValue.hours.Mardi.open === null,
  Mercredi: props.modelValue.hours.Mercredi.open === null,
  Jeudi: props.modelValue.hours.Jeudi.open === null,
  Vendredi: props.modelValue.hours.Vendredi.open === null,
  Samedi: props.modelValue.hours.Samedi.open === null,
  Dimanche: props.modelValue.hours.Dimanche.open === null,
});

// Valeurs des champs ouverture/fermeture (fallback sur 09:00/18:00 si null)
const timeValues = reactive<Record<keyof DaySchedule, { open: string; close: string }>>({
  Lundi: { open: props.modelValue.hours.Lundi.open ?? '09:00', close: props.modelValue.hours.Lundi.close ?? '18:00' },
  Mardi: { open: props.modelValue.hours.Mardi.open ?? '09:00', close: props.modelValue.hours.Mardi.close ?? '18:00' },
  Mercredi: { open: props.modelValue.hours.Mercredi.open ?? '09:00', close: props.modelValue.hours.Mercredi.close ?? '18:00' },
  Jeudi: { open: props.modelValue.hours.Jeudi.open ?? '09:00', close: props.modelValue.hours.Jeudi.close ?? '18:00' },
  Vendredi: { open: props.modelValue.hours.Vendredi.open ?? '09:00', close: props.modelValue.hours.Vendredi.close ?? '18:00' },
  Samedi: { open: props.modelValue.hours.Samedi.open ?? '09:00', close: props.modelValue.hours.Samedi.close ?? '18:00' },
  Dimanche: { open: props.modelValue.hours.Dimanche.open ?? '09:00', close: props.modelValue.hours.Dimanche.close ?? '18:00' },
});

// Quand on toggle "Fermé"
const toggleClosed = (day: keyof DaySchedule, closed: boolean) => {
  if (closed) {
    props.modelValue.hours[day].open = null;
    props.modelValue.hours[day].close = null;
  } else {
    props.modelValue.hours[day].open = timeValues[day].open;
    props.modelValue.hours[day].close = timeValues[day].close;
  }
};

// Watchers pour synchroniser les changements des inputs vers le modèle
watch(timeValues, (newValues) => {
  daysOfWeek.forEach((day) => {
    if (!isClosed[day]) {
      props.modelValue.hours[day].open = newValues[day].open;
      props.modelValue.hours[day].close = newValues[day].close;
    }
  });
}, { deep: true });
</script>
