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
            v-model="localHours[day].closed"
            label="Fermé"
            color="error"
            hide-details
            inset
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="localHours[day].value[0]"
            :disabled="localHours[day].closed"
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
            v-model="localHours[day].value[1]"
            :disabled="localHours[day].closed"
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
import type { BusinessFormData, DayScheduleUI } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: BusinessFormData];
}>();

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
] as const;

// Local copy that we can mutate freely
const localHours = reactive<DayScheduleUI>({
  Lundi: { closed: false, value: ['09:00', '18:00'] },
  Mardi: { closed: false, value: ['09:00', '18:00'] },
  Mercredi: { closed: false, value: ['09:00', '18:00'] },
  Jeudi: { closed: false, value: ['09:00', '18:00'] },
  Vendredi: { closed: false, value: ['09:00', '18:00'] },
  Samedi: { closed: false, value: ['09:00', '18:00'] },
  Dimanche: { closed: false, value: ['09:00', '18:00'] },
});

// Watch props.modelValue.hours and update local copy
watch(() => props.modelValue.hours, (newHours) => {
  if (!newHours) return;
  daysOfWeek.forEach((day) => {
    if (newHours[day]) {
      localHours[day] = {
        closed: newHours[day].closed ?? false,
        value: [
          newHours[day].value?.[0] ?? '09:00',
          newHours[day].value?.[1] ?? '18:00'
        ]
      };
    }
  });
}, { immediate: true, deep: true });

// Watch local changes and emit updates
watch(localHours, (newVal) => {
  const updated = { ...props.modelValue };
  daysOfWeek.forEach((day) => {
    updated.hours = { ...updated.hours, [day]: { ...newVal[day] } };
  });
  emit('update:modelValue', updated);
}, { deep: true });
</script>
