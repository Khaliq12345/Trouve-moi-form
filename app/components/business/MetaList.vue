<template>
  <v-card variant="outlined" rounded="lg" class="pa-4 bg-grey-darken-3">
    <v-expansion-panels v-if="items.length > 0" variant="accordion">
      <v-expansion-panel
        v-for="meta in items"
        :key="meta.id"
        elevation="0"
        class="bg-transparent border-b-thin"
      >
        <v-expansion-panel-title class="px-2">
          <div class="d-flex align-center w-100">
            <div class="flex-grow-1">
              <span class="text-subtitle-1 font-weight-bold">{{
                meta.title
              }}</span>
            </div>

            <v-chip
              v-if="meta.price"
              size="small"
              color="primary"
              variant="flat"
              class="mr-3"
            >
              {{ meta.price }} XOF
            </v-chip>

            <div class="d-flex gap-1">
              <v-btn
                icon="mdi-pencil"
                size="x-small"
                variant="text"
                color="grey-lighten-1"
                @click.stop="$emit('edit', meta)"
              />
              <v-btn
                icon="mdi-delete"
                size="x-small"
                variant="text"
                color="error"
                @click.stop="$emit('delete', meta.id)"
              />
            </div>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <div
            v-if="meta.description"
            class="text-body-2 text-grey-lighten-1 mb-4 whitespace-pre-wrap"
          >
            {{ meta.description }}
          </div>

          <!-- DIsplay the image/vidoes -->
          <BusinessMetaDisplay :meta="meta"></BusinessMetaDisplay>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-sheet
      v-else
      color="transparent"
      class="d-flex flex-column align-center justify-center py-8 text-center"
    >
      <v-icon
        icon="mdi-database-off-outline"
        size="large"
        color="grey"
        class="mb-2"
      />
      <div class="text-body-2 text-grey">
        Aucun élément <strong>{{ type }}</strong> n'a été trouvé.
      </div>
    </v-sheet>

    <v-btn
      color="white"
      variant="elevated"
      block
      prepend-icon="mdi-plus"
      class="mt-6 text-none"
      rounded="lg"
      @click="$emit('add')"
    >
      Ajouter un {{ type }}
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
// Props & Emits stay the same as your previous logic
defineProps<{
  items: any[];
  type: string;
}>();

defineEmits(["edit", "delete", "add"]);
</script>

<style scoped>
/* Ensures that line breaks in descriptions are preserved */
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

/* Custom border for the accordion items */
.border-b-thin {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.object-cover {
  object-fit: cover;
}
</style>
