<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Audio</div>

      <div v-if="modelValue.audio" class="w-100 d-flex flex-column">
        <audio
          :src="previewUrl"
          controls
          class="w-100"
        ></audio>
        <v-btn
          color="error"
          variant="text"
          size="small"
          prepend-icon="mdi-delete"
          @click="onClear"
          class="mt-2 align-self-start"
        >
          Retirer l'audio
        </v-btn>
      </div>

      <v-file-input
        v-else
        :model-value="fileList"
        label="Fichier audio"
        variant="outlined"
        rounded="lg"
        color="white"
        accept="audio/*"
        prepend-icon=""
        prepend-inner-icon="mdi-music"
        :loading="isUploading"
        @update:model-value="onFileChange"
        @click:clear="onClear"
      ></v-file-input>

      <v-alert
        v-if="uploadError"
        type="error"
        rounded="lg"
        class="mt-2"
        density="compact"
      >
        {{ uploadError }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { BusinessFormData } from "~/types/business";

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();

const { uploadAudio, isUploading, uploadError } = useDirectusAudio();

// Historique si on ajoute depuis l'ordinateur
const fileList = ref<File[]>([]);

const previewUrl = computed(() => {
  if (props.modelValue.audio) {
    return imgLink(props.modelValue.audio);
  }
  return null;
});

const onFileChange = async (files: File | File[]) => {
  const file = Array.isArray(files) ? files[0] : files;

  if (!file) {
    onClear();
    return;
  }

  fileList.value = [file];

  try {
    const fileId = await uploadAudio(file);
    props.modelValue.audio = fileId;
  } catch (e) {
    // Erreur gérée par le composable
  }
};

const onClear = () => {
  fileList.value = [];
  if (uploadError?.value) uploadError.value = null;
  props.modelValue.audio = null;
};
</script>
