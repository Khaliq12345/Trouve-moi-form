<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Audio</div>

      <v-file-input
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

      <div v-if="previewUrl" class="mt-2 w-100 d-flex flex-column">
        <audio
          :src="previewUrl"
          controls
          class="w-100"
        ></audio>
        <v-btn
          v-if="modelValue.audio"
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
const emit = defineEmits<{
  "update:modelValue": [value: BusinessFormData];
}>();

const { $directus, $uploadFiles } = useNuxtApp();
const config = useRuntimeConfig();

const isUploading = ref(false);
const uploadError = ref<string | null>(null);

// Historique si on ajoute depuis l'ordinateur
const fileList = ref<File[]>([]);

const previewUrl = computed(() => {
  if (props.modelValue.audio) {
    // Si c'est un ID Directus, on construit l'URL de l'asset
    return `${config.public.directusUrl}/assets/${props.modelValue.audio}`;
  }
  return null;
});

const onFileChange = async (files: File | File[]) => {
  const file = Array.isArray(files) ? files[0] : files;

  uploadError.value = null;

  if (!file) {
    onClear();
    return;
  }

  fileList.value = [file];

  // Upload immédiat vers Directus
  try {
    isUploading.value = true;
    
    const fileFormData = new FormData();
    fileFormData.append("file", file);

    const result = await $directus.request($uploadFiles(fileFormData));
    const fileId = Array.isArray(result) ? result[0].id : result.id;

    emit("update:modelValue", { ...props.modelValue, audio: fileId });
  } catch (e) {
    console.error("Erreur upload audio:", e);
    uploadError.value = "Échec de l'envoi du fichier audio.";
  } finally {
    isUploading.value = false;
  }
};

const onClear = () => {
  fileList.value = [];
  uploadError.value = null;
  emit("update:modelValue", { ...props.modelValue, audio: null });
};
</script>
