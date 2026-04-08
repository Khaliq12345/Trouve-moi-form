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

      <audio
        v-if="previewUrl"
        :src="previewUrl"
        controls
        class="w-100 mt-2"
      ></audio>

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
import type { BusinessFormData } from "~/types/business";

interface Props {
  modelValue: BusinessFormData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: BusinessFormData];
}>();

const { uploadAudio } = useDirectusAudio(); // ton composable

const isUploading = ref(false);
const uploadError = ref<string | null>(null);

const fileList = computed(() =>
  props.modelValue.audioFile ? [props.modelValue.audioFile] : [],
);

const previewUrl = ref<string | null>(
  props.modelValue.audioFile
    ? URL.createObjectURL(props.modelValue.audioFile)
    : null,
);

const onFileChange = async (files: File | File[]) => {
  const file = Array.isArray(files) ? files[0] : files;

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  uploadError.value = null;

  if (!file) {
    onClear();
    return;
  }

  // On stocke le File brut dans le formData immédiatement
  previewUrl.value = URL.createObjectURL(file);
  emit("update:modelValue", { ...props.modelValue, audioFile: file });

  // Upload vers Directus
  try {
    isUploading.value = true;
    await uploadAudio(file);
  } catch (e) {
    uploadError.value = "Échec de l'envoi du fichier audio.";
  } finally {
    isUploading.value = false;
  }
};

const onClear = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  uploadError.value = null;
  emit("update:modelValue", { ...props.modelValue, audioFile: null });
};

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>
