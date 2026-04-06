<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Médias & Images</div>
      
      <!-- Affichage des médias existants -->
      <div v-if="businessMedia && businessMedia.length > 0" class="mb-4">
        <v-row>
          <v-col 
            v-for="media in businessMedia" 
            :key="media.id" 
            cols="6" 
            md="3"
            class="mb-3"
          >
            <v-card variant="outlined" rounded="lg" class="media-card">
              <v-img
                v-if="media.type === 'image' || !media.type"
                :src="getDirectusFileUrl(media.media_id)"
                aspect-ratio="1"
                cover
                class="bg-grey-darken-3"
              >
                <template v-slot:error>
                  <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                    <v-icon icon="mdi-image-off" size="32" color="grey"></v-icon>
                  </div>
                </template>
              </v-img>
              
              <div v-else class="d-flex align-center justify-center bg-grey-darken-3" style="aspect-ratio: 1;">
                <v-icon icon="mdi-video" size="32" color="grey"></v-icon>
              </div>
              
              <v-card-actions class="pa-2">
                <v-chip size="x-small" color="primary" variant="tonal" class="text-caption">
                  {{ media.tags?.[0] || 'image' }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-btn
                  icon="mdi-delete"
                  size="x-small"
                  color="error"
                  variant="text"
                  @click="$emit('delete-media', media.id)"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
      
      <div v-else-if="!pending" class="text-body-2 text-grey mb-4">
        Aucun média associé à ce business.
      </div>
      
      <!-- Upload de nouveaux fichiers -->
      <v-file-input
        v-model="selectedFiles"
        label="Ajouter des images"
        variant="outlined"
        rounded="lg"
        color="white"
        multiple
        accept="image/*,video/*"
        prepend-icon="mdi-camera"
        show-size
        chips
        :loading="uploading"
      >
        <template v-slot:selection="{ fileNames }">
          <v-chip
            v-for="fileName in fileNames"
            :key="fileName"
            size="small"
            color="primary"
            variant="outlined"
            class="ma-1"
          >
            {{ fileName }}
          </v-chip>
        </template>
      </v-file-input>
      
      <v-btn
        v-if="selectedFiles.length > 0"
        color="white"
        variant="outlined"
        rounded="lg"
        prepend-icon="mdi-cloud-upload"
        @click="uploadFiles"
        :loading="uploading"
        class="mt-2"
      >
        Uploader {{ selectedFiles.length }} fichier(s)
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { BizMedia } from '~/types/biz';

interface Props {
  businessMedia: BizMedia[];
  pending: boolean;
  directusUrl: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'delete-media': [mediaId: string];
  'upload-files': [files: File[]];
}>();

const selectedFiles = ref<File[]>([]);
const uploading = ref(false);

const getDirectusFileUrl = (mediaId: string): string => {
  if (!mediaId) return '';
  return `${props.directusUrl}/assets/${mediaId}`;
};

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return;
  
  uploading.value = true;
  emit('upload-files', selectedFiles.value);
  uploading.value = false;
  selectedFiles.value = [];
};
</script>

<style scoped>
.media-card {
  overflow: hidden;
}
</style>
