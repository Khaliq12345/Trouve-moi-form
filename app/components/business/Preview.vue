<template>
  <!-- Preview des catégories sélectionnées avec noms -->
  <div v-if="names">
    <v-row v-if="names.length > 0" class="mb-2">
      <v-col cols="12">
        <div class="text-caption text-grey-lighten-1">
          {{ title }}: <span class="text-white">{{ names.join(" • ") }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  names?: any[];
  title: string;
}>();
</script>
