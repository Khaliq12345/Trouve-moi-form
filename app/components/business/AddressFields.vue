<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Adresses</div>
      
      <div v-for="(address, index) in modelValue.addresses" :key="index" class="mb-3">
        <v-text-field
          v-model="modelValue.addresses[index]"
          :label="index === 0 ? 'Adresse principale' : `Adresse ${index + 1}`"
          variant="outlined"
          rounded="lg"
          color="white"
          :rules="[rules.required]"
          :append-inner-icon="modelValue.addresses.length > 1 ? 'mdi-close' : undefined"
          @click:append-inner="removeAddress(index)"
        ></v-text-field>
      </div>
      
      <v-btn
        color="white"
        variant="outlined"
        rounded="lg"
        prepend-icon="mdi-plus"
        @click="addAddress"
        class="mt-2"
      >
        Ajouter une adresse
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { BusinessFormData } from '~/types/business';

interface Props {
  modelValue: BusinessFormData;
  rules: {
    required: (v: string) => boolean | string;
  };
}

const props = defineProps<Props>();

const addAddress = () => {
  props.modelValue.addresses.push('');
};

const removeAddress = (index: number) => {
  if (props.modelValue.addresses.length > 1) {
    props.modelValue.addresses.splice(index, 1);
  }
};
</script>
