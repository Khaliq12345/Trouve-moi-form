<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h6 mb-4 text-grey-lighten-1">Métadonnées (Menu, Services, Portfolio, Vibes)</div>
      
      <v-progress-circular v-if="pendingMetas" indeterminate color="white" class="ma-4" />
      
      <div v-else-if="!groupedMetas" class="text-body-2 text-error mb-4">
        Erreur lors du chargement
      </div>
      
      <!-- Contenu principal -->
      <template v-else>
        <v-tabs v-model="activeTab" color="white" grow>
          <v-tab value="menu">Menu</v-tab>
          <v-tab value="service">Services</v-tab>
          <v-tab value="portfolio">Portfolio</v-tab>
          <v-tab value="vibes">Vibes</v-tab>
          <v-tab value="video">Video</v-tab>
        </v-tabs>
        
        <v-window v-model="activeTab" class="mt-4">
          <v-window-item v-for="type in metaTypes" :key="type" :value="type">
            <v-card variant="outlined" rounded="lg" class="pa-4 bg-grey-darken-3">
              <!-- Liste des metas existants -->
              <div v-if="groupedMetas?.[type]?.length > 0" class="mb-4">
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel
                    v-for="meta in groupedMetas[type]"
                    :key="meta.id"
                  >
                    <v-expansion-panel-title>
                      <div class="d-flex align-center w-100">
                        <div class="flex-grow-1">
                          <div class="font-weight-medium">{{ meta.title }}</div>
                        </div>
                        <v-chip v-if="meta.price" size="small" color="primary" class="mr-2">
                          {{ meta.price }} XOF
                        </v-chip>
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" @click.stop="editMeta(meta)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click.stop="confirmDelete(meta.id)"></v-btn>
                      </div>
                    </v-expansion-panel-title>
                    
                    <v-expansion-panel-text>
                      <div v-if="meta.link?.length > 0" class="mt-2">
                        <v-row>
                          <v-col v-for="(mediaId, idx) in meta.link" :key="idx" cols="3">
                            <v-img
                              v-if="meta.media_type === 'image'"
                              :src="imgLink(mediaId)"
                              aspect-ratio="1"
                              cover
                              rounded="lg"
                              class="bg-grey-darken-4"
                            />
                            <video
                              v-else
                              :src="imgLink(mediaId)"
                              controls
                              style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;"
                              class="bg-grey-darken-4"
                            />
                          </v-col>
                        </v-row>
                      </div>
                      <div v-else>
                        Aucun média
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              
              <div v-else class="text-body-2 text-grey mb-4">
                Aucun élément {{ type }} pour ce business.
              </div>
              
              <!-- Bouton ajouter -->
              <v-btn
                color="white"
                variant="outlined"
                rounded="lg"
                prepend-icon="mdi-plus"
                @click="openAddDialog(type)"
              >
                Ajouter un {{ type }}
              </v-btn>
            </v-card>
          </v-window-item>
        </v-window>
      </template>
      
      <!-- Dialog pour ajouter/éditer -->
      <v-dialog v-model="dialogOpen" max-width="600">
        <v-card color="grey-darken-3">
          <v-card-title>{{ editingMeta ? 'Modifier' : 'Ajouter' }} un {{ activeTab }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.title"
              label="Titre *"
              variant="outlined"
              rounded="lg"
              color="white"
              class="mb-3"
              :rules="[v => !!v || 'Titre requis']"
            ></v-text-field>
            
            <v-textarea
              v-model="form.description"
              label="Description *"
              variant="outlined"
              rounded="lg"
              color="white"
              class="mb-3"
              rows="3"
              :rules="[v => !!v || 'Description requise']"
            ></v-textarea>
            
            <v-text-field
              v-model="form.price"
              label="Prix"
              variant="outlined"
              rounded="lg"
              color="white"
              class="mb-3"
              type="number"
              prefix="€"
              hint="Optionnel, utile pour menu/service"
            ></v-text-field>
            
            <v-select
              v-model="form.media_type"
              :items="['image', 'video']"
              label="Type de média *"
              variant="outlined"
              rounded="lg"
              color="white"
              class="mb-3"
            ></v-select>
            
            <v-file-input
              v-model="selectedFiles"
              label="Médias"
              variant="outlined"
              rounded="lg"
              color="white"
              multiple
              accept="image/*,video/*"
              show-size
              chips
              class="mb-3"
              hint="Optionnel, sélectionnez un ou plusieurs fichiers"
            ></v-file-input>
            
            <!-- Preview des médias existants en édition -->
            <v-row v-if="form.existingMedia?.length > 0" class="mb-3">
              <v-col v-for="(mediaId, idx) in form.existingMedia" :key="idx" cols="3">
                <v-card variant="outlined" class="media-preview">
                  <v-img
                    v-if="form.media_type === 'image'"
                    :src="imgLink(mediaId)"
                    aspect-ratio="1"
                    cover
                  ></v-img>
                  <video
                    v-else
                    :src="imgLink(mediaId)"
                    controls
                    style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;"
                    class="bg-grey-darken-4"
                  />
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    color="error"
                    variant="text"
                    class="remove-btn"
                    @click="removeExistingMedia(idx)"
                  ></v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" variant="text" @click="dialogOpen = false">Annuler</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="white" variant="elevated" :loading="saving" @click="saveMeta">
              {{ editingMeta ? 'Mettre à jour' : 'Ajouter' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Dialog de confirmation suppression -->
      <v-dialog v-model="deleteDialogOpen" max-width="400">
        <v-card color="grey-darken-3">
          <v-card-title>Confirmer la suppression</v-card-title>
          <v-card-text>Voulez-vous vraiment supprimer cet élément ?</v-card-text>
          <v-card-actions>
            <v-btn color="grey" variant="text" @click="deleteDialogOpen = false">Annuler</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="elevated" :loading="deleting" @click="executeDelete">
              Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { BizMetaItem } from '~/types/biz';

interface Props {
  businessId: string;
}

const props = defineProps<Props>();

const metaTypes = ['menu', 'service', 'portfolio', 'vibes', 'video'] as const;
type MetaType = typeof metaTypes[number];

const { $directus, $uploadFiles } = useNuxtApp();

// -- État du composant --
const activeTab = ref<MetaType>('menu');
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editingMeta = ref<BizMetaItem | null>(null);
const selectedFiles = ref<File[]>([]);
const metaToDelete = ref<string | null>(null);

// -- Formulaire d'ajout/edition --
const form = reactive({
  title: '',
  description: '',
  price: '',
  media_type: 'image' as 'image' | 'video',
  existingMedia: [] as string[],
});

// -- Donnees --
const { groupedMetas, refreshMetas, createMeta, updateMeta, deleteMeta, pendingMetas } = useBusinessMetas(
  computed(() => props.businessId)
);

// -- Methodes --
const openAddDialog = (type: MetaType) => {
  editingMeta.value = null;
  form.title = '';
  form.description = '';
  form.price = '';
  form.media_type = 'image';
  form.existingMedia = [];
  selectedFiles.value = [];
  dialogOpen.value = true;
};

const editMeta = (meta: BizMetaItem) => {
  editingMeta.value = meta;
  form.title = meta.title;
  form.description = meta.description;
  form.price = meta.price?.toString() || '';
  form.media_type = meta.media_type as 'image' | 'video';
  form.existingMedia = [...(meta.link || [])];
  selectedFiles.value = [];
  dialogOpen.value = true;
};

const removeExistingMedia = (idx: number) => {
  form.existingMedia.splice(idx, 1);
};

const saveMeta = async () => {
  if (!form.title || !form.description) return;
  
  saving.value = true;
  try {
    // Upload des nouveaux fichiers
    const newMediaIds: string[] = [];
    for (const file of selectedFiles.value) {
      const formData = new FormData();
      formData.append('file', file);
      const uploaded = await $directus.request($uploadFiles(formData));
      if (uploaded?.id) newMediaIds.push(uploaded.id);
    }
    
    // Combiner médias existants et nouveaux
    const allMediaIds = [...form.existingMedia, ...newMediaIds];
    
    const metaData: Omit<BizMetaItem, 'id' | 'biz_name' | 'biz_slug'> = {
      title: form.title,
      description: form.description,
      type: activeTab.value,
      price: form.price || null,
      biz_id: props.businessId,
      media_type: form.media_type,
      link: allMediaIds,
    };
    
    if (editingMeta.value) {
      await updateMeta(editingMeta.value.id, metaData);
    } else {
      await createMeta(metaData);
    }
    
    dialogOpen.value = false;
    selectedFiles.value = [];
  } catch (e) {
    console.error('Erreur lors de la sauvegarde:', e);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (id: string) => {
  metaToDelete.value = id;
  deleteDialogOpen.value = true;
};

const executeDelete = async () => {
  if (!metaToDelete.value) return;
  
  deleting.value = true;
  try {
    await deleteMeta(metaToDelete.value);
    deleteDialogOpen.value = false;
  } catch (e) {
    console.error('Erreur lors de la suppression:', e);
  } finally {
    deleting.value = false;
    metaToDelete.value = null;
  }
};
</script>

<style scoped>
.media-preview {
  position: relative;
  overflow: hidden;
}
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
}
</style>
