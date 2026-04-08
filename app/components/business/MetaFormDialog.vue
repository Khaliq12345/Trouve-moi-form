<template>
  <v-dialog v-model="isOpen" max-width="600">
    <v-card color="grey-darken-3">
      <v-card-title
        >{{ editingItem ? "Modifier" : "Ajouter" }}
        {{ activeType }}</v-card-title
      >
      <v-card-text>
        <v-text-field
          v-model="form.title"
          label="Titre *"
          variant="outlined"
          class="mb-3"
        />
        <v-textarea
          v-model="form.description"
          label="Description *"
          variant="outlined"
          rows="3"
          class="mb-3"
        />
        <v-text-field
          v-model="form.price"
          label="Prix"
          type="number"
          prefix="XOF"
          variant="outlined"
          class="mb-3"
        />
        <v-select
          v-model="form.media_type"
          :items="['image', 'video']"
          label="Type de média"
          variant="outlined"
        />

        <v-file-input
          v-model="selectedFiles"
          label="Nouveaux médias"
          multiple
          chips
          variant="outlined"
          prepend-icon="mdi-camera"
        />

        <div
          v-if="form.existingMedia.length"
          class="mt-2 d-flex flex-wrap gap-2"
        >
          <div
            v-for="(id, i) in form.existingMedia"
            :key="id"
            class="position-relative"
          >
            <v-img
              :src="imgLink(id)"
              width="60"
              height="60"
              cover
              class="rounded"
            />
            <v-btn
              icon="mdi-close"
              size="x-small"
              class="remove-btn"
              @click="removeMedia(i)"
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isOpen = false">Annuler</v-btn>
        <v-btn
          color="white"
          variant="elevated"
          :loading="saving"
          @click="handleSave"
        >
          {{ editingItem ? "Mettre à jour" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  editingItem: any;
  activeType: string;
  businessId: string;
}>();
const emit = defineEmits(["update:modelValue", "saved"]);
const { $directus, $uploadFiles } = useNuxtApp();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { updateMeta, createMeta } = useBusinessMetas(
  computed(() => props.businessId)
);

const saving = ref(false);
const selectedFiles = ref<File[]>([]);
const form = computed(() => {
  if (!props.editingItem) {
    return {
      title: "",
      description: "",
      price: "",
      media_type: "image",
      existingMedia: [],
    };
  }
  return {
    ...props.editingItem,
    existingMedia: [...(props.editingItem.link || [])],
  };
});

const removeMedia = (index: number) => {
  form.value.existingMedia.splice(index, 1);
};

const handleSave = async () => {
  saving.value = true;
  try {
    const newMediaIds = [];
    for (const file of selectedFiles.value) {
      const formData = new FormData();
      formData.append("file", file);
      const uploaded = await $directus.request($uploadFiles(formData));
      if (uploaded?.id) newMediaIds.push(uploaded.id);
    }

    const payload = {
      ...form,
      link: [...form.value.existingMedia, ...newMediaIds],
      type: props.activeType,
      biz_id: props.businessId,
    };

    props.editingItem
      ? await updateMeta(props.editingItem.id, payload)
      : await createMeta(payload);
    emit("saved");
    isOpen.value = false;
  } finally {
    saving.value = false;
  }
};
</script>
