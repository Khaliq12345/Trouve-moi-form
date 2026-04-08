export const useDirectusAudio = () => {
  const { $directus, $uploadFiles } = useNuxtApp();
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  const uploadAudio = async (file: File): Promise<string> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const result = await $directus.request($uploadFiles(fileFormData));
      
      return Array.isArray(result) ? result[0].id : result.id;
    } catch (e) {
      console.error("Erreur upload audio:", e);
      uploadError.value = "Échec de l'envoi du fichier audio.";
      throw e;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    uploadAudio,
    isUploading,
    uploadError,
  };
};
