<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Métadonnées</div>

      <v-progress-circular
        v-if="pendingMetas"
        indeterminate
        color="white"
        class="ma-4"
      />
      <div v-else-if="!groupedMetas" class="text-body-2 text-error mb-4">
        Erreur de chargement
      </div>

      <template v-else>
        <v-tabs v-model="activeTab" color="white" grow>
          <v-tab v-for="type in metaTypes" :key="type" :value="type">
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4">
          <v-window-item v-for="type in metaTypes" :key="type" :value="type">
            <BusinessMetaList
              :items="groupedMetas[type] || []"
              :type="type"
              @edit="openEditDialog"
              @add="openAddDialog"
              @delete="openDeleteDialog"
            />
          </v-window-item>
        </v-window>
      </template>

      <BusinessMetaFormDialog
        v-model="dialogOpen"
        :editing-item="editingMeta"
        :active-type="activeTab"
        :business-id="businessId"
        @saved="refreshMetas"
      />

      <BusinessDeleteMeta
        v-model="deleteDialogOpen"
        :businessId="businessId"
        :metaId="editingMeta"
      ></BusinessDeleteMeta>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{ businessId: string }>();
const metaTypes = ["menu", "service", "portfolio", "vibes", "video"] as const;
const activeTab = ref(metaTypes[0]);
const dialogOpen = ref(false);
const editingMeta = ref<string>("");
const deleteDialogOpen = ref(false);

const { groupedMetas, pendingMetas, refreshMetas } = useBusinessMetas(
  computed(() => props.businessId)
);

const openAddDialog = () => {
  editingMeta.value = "";
  dialogOpen.value = true;
};

const openEditDialog = (meta: string) => {
  editingMeta.value = meta;
  dialogOpen.value = true;
};

const openDeleteDialog = (meta: string) => {
  editingMeta.value = meta;
  deleteDialogOpen.value = true;
};
</script>
