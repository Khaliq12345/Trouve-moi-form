<template>
  <v-dialog v-model="deleteDialogOpen" max-width="400">
    <v-card color="grey-darken-3">
      <v-card-title>Confirmer la suppression</v-card-title>
      <v-card-text>Voulez-vous vraiment supprimer cet élément ?</v-card-text>
      <v-card-actions>
        <v-btn color="grey" variant="text" @click="deleteDialogOpen = false"
          >Annuler</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="elevated"
          :loading="deleting"
          @click="executeDelete"
        >
          Supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  metaId: string;
  businessId: string;
}>();

const deleteDialogOpen = defineModel<boolean>();
const deleting = ref(false);

// -- Donnees --
const { deleteMeta } = useBusinessMetas(computed(() => props.businessId));

const executeDelete = async () => {
  deleting.value = true;
  try {
    await deleteMeta(props.metaId);
    deleteDialogOpen.value = false;
  } catch (e) {
    console.error("Erreur lors de la suppression:", e);
  } finally {
    deleting.value = false;
  }
};
</script>
