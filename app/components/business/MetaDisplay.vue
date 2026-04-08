<template>
  <div v-if="meta.link?.length">
    <div
      class="text-caption text-uppercase text-grey-darken-1 font-weight-black mb-2"
    >
      Médias
    </div>
    <v-row density="comfortable">
      <v-col
        v-for="(mediaId, idx) in meta.link"
        :key="idx"
        cols="4"
        sm="3"
        md="2"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 4 : 0"
            rounded="lg"
            class="overflow-hidden bg-grey-darken-4"
          >
            <v-img
              v-if="meta.media_type === 'image'"
              :src="imgLink(mediaId)"
              cover
              aspect-ratio="1"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-darken-2" />
                </v-row>
              </template>
            </v-img>

            <video
              v-else
              :src="imgLink(mediaId)"
              class="w-100 h-100 object-cover d-block"
              style="aspect-ratio: 1; object-fit: cover"
            />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
  <!-- Show when there's no media -->
  <v-alert
    v-else
    density="compact"
    variant="tonal"
    type="info"
    class="text-caption"
    icon="mdi-image-off"
  >
    Aucun média disponible
  </v-alert>
</template>

<script setup lang="ts">
const props = defineProps<{
  meta: any;
}>();
</script>
