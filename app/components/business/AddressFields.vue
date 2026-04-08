<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Adresses</div>

      <div v-for="(address, index) in addresses" :key="index" class="mb-3">
        <v-text-field
          v-model="addresses[index]"
          :label="index === 0 ? 'Adresse principale' : `Adresse ${index + 1}`"
          variant="outlined"
          rounded="lg"
          color="white"
          :rules="[rules.required]"
          :append-inner-icon="addresses.length > 1 ? 'mdi-close' : undefined"
          @click:append-inner="removeAddress(index)"
        ></v-text-field>
      </div>

      <v-btn
        color="white"
        variant="outlined"
        rounded="lg"
        prepend-icon="mdi-plus"
        @click="() => addresses.push('')"
        class="mt-2"
      >
        Ajouter une adresse
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { BusinessFormData } from "~/types/business";

interface Props {
  modelValue: BusinessFormData;
  rules: {
    required: (v: string) => boolean | string;
  };
}

const props = defineProps<Props>();

const addresses = ref<string[]>(
  props.modelValue.locations ? props.modelValue.locations.split("\n") : [""],
);

watch(
  addresses,
  (locations) => {
    props.modelValue.locations = locations
      .filter((location) => location !== "")
      .join("\n");
  },
  { deep: true },
);

watch(
  () => props.modelValue.locations,
  (locations) => {
    const incoming = locations ? locations.split("\n") : [""];
    if (incoming.join("\n") !== addresses.value.join("\n")) {
      addresses.value = incoming;
    }
  },
);

const removeAddress = (index: number) => {
  if (addresses.value.length > 1) {
    addresses.value.splice(index, 1);
  }
};
</script>
