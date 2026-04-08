<template>
  <v-row class="mb-4">
    <v-col cols="12">
      <v-card variant="outlined" rounded="lg" class="pa-4 bg-grey-darken-3">
        <div class="text-subtitle-2 text-grey-lighten-1 mb-2">
          ID: {{ businessId }}
        </div>
        <div v-if="dateCreated" class="text-caption text-grey">
          Créé le:
          {{ new Date(dateCreated).toLocaleDateString("fr-FR") }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  businessId: string;
  dateCreated: string;
}>();
</script>
