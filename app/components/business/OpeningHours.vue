<template>
  <v-col cols="12">
    <div class="text-h6 mb-4 text-grey-lighten-1">
      Horaires d'ouverture
    </div>
    <v-sheet
      border
      rounded="lg"
      color="transparent"
      class="pa-4"
    >
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
            :model-value="localHours[day]?.open"
            @update:model-value="updateHour(day, 'open', $event)"
            label="Ouverture"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
            placeholder="09:00"
          />
        </v-col>

        <!-- Close time -->
        <v-col cols="12" sm="3">
          <v-text-field
            :model-value="localHours[day]?.close"
            @update:model-value="updateHour(day, 'close', $event)"
            label="Fermeture"
            variant="underlined"
            density="compact"
            color="white"
            hide-details
            placeholder="18:00"
          />
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

console.log("hours: ", props.modelValue.hours)

const daysOfWeek = [
  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche",
] as const;


const localHours = reactive<DaySchedule>(
  daysOfWeek.reduce((acc, day) => {
    acc[day] = props.modelValue.hours?.[day] ?? { open: "09:00", close: "18:00" };
    return acc;
  }, {} as DaySchedule)
);

function updateHour(day: keyof DaySchedule, field: "open" | "close", value: string) {
  localHours[day] = { ...localHours[day], [field]: value };

  props.modelValue.hours = localHours;
}
</script>