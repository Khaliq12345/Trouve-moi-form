<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Itinéraire</div>

      <div v-for="(step, index) in steps" :key="index" class="mb-3">
        <v-textarea
          v-model="steps[index].description"
          :label="`Étape ${step.step}`"
          variant="outlined"
          rounded="lg"
          color="white"
          rows="2"
          auto-grow
          :append-inner-icon="steps.length > 1 ? 'mdi-close' : undefined"
          @click:append-inner="removeStep(index)"
        ></v-textarea>
      </div>

      <v-btn
        color="white"
        variant="outlined"
        rounded="lg"
        prepend-icon="mdi-plus"
        @click="addStep"
        class="mt-2"
      >
        Ajouter une étape
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { BusinessFormData } from "~/types/business";

interface Step {
  step: number;
  description: string;
}

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();

const reindex = (arr: Step[]): Step[] =>
  arr.map((s, i) => ({ ...s, step: i + 1 }));

const steps = ref<Step[]>(
  props.modelValue.textDirections?.length
    ? [...props.modelValue.textDirections]
    : [{ step: 1, description: "" }],
);

watch(
  steps,
  (val) => {
    props.modelValue.textDirections = reindex(val);
  },
  { deep: true },
);

watch(
  () => props.modelValue.textDirections,
  (newSteps) => {
    if (JSON.stringify(newSteps) !== JSON.stringify(steps.value)) {
      steps.value = newSteps?.length
        ? [...newSteps]
        : [{ step: 1, description: "" }];
    }
  },
);

const addStep = () => {
  steps.value.push({ step: steps.value.length + 1, description: "" });
};

const removeStep = (index: number) => {
  if (steps.value.length > 1) {
    steps.value.splice(index, 1);
  }
};
</script>
