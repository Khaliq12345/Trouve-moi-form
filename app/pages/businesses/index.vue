<template>
  <v-container fluid class="bg-black fill-height pa-4 pa-md-8">
    <!-- Header section with title and add button -->
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2 text-white">Businesses</h1>
          <p class="text-body-1 text-grey-lighten-1">
            {{ businesses?.length || 0 }} business{{ businesses?.length !== 1 ? 'es' : '' }} trouvé{{ businesses?.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <v-btn
          to="/"
          color="white"
          variant="elevated"
          prepend-icon="mdi-plus"
          rounded="pill"
          class="text-black font-weight-bold"
        >
          Nouveau
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <v-row v-if="pending">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="white"
          size="48"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          rounded="lg"
          theme="dark"
        >
          Erreur lors du chargement. Veuillez réessayer.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Empty state -->
    <v-row v-else-if="!businesses?.length">
      <v-col cols="12">
        <v-alert
          type="info"
          variant="tonal"
          rounded="lg"
          theme="dark"
        >
          Aucun business trouvé. Créez votre premier business !
        </v-alert>
      </v-col>
    </v-row>

    <!-- Business cards grid -->
    <v-row v-else>
      <v-col
        v-for="business in businesses"
        :key="business.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          theme="dark"
          color="grey-darken-4"
          class="h-100"
          rounded="xl"
          elevation="12"
          hover
          @click="navigateToEdit(business.id)"
        >
          <v-card-item class="pa-4">
            <template v-slot:prepend>
              <v-avatar
                color="white"
                size="48"
                class="text-h6 text-black font-weight-bold"
              >
                {{ business.name.charAt(0).toUpperCase() }}
              </v-avatar>
            </template>
            <v-card-title class="text-h6 font-weight-bold text-white">
              {{ business.name }}
            </v-card-title>
            <template v-slot:append>
              <v-chip
                :color="business.is_open ? 'success' : 'error'"
                size="small"
                variant="elevated"
              >
                {{ business.is_open ? 'Ouvert' : 'Fermé' }}
              </v-chip>
            </template>
          </v-card-item>

          <v-card-text class="text-grey-lighten-1">
            <p class="text-body-2 mb-4 line-clamp-2">
              {{ business.description || 'Pas de description' }}
            </p>
          </v-card-text>

          <!-- Card actions with edit button -->
          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="white"
              size="small"
              :to="`/businesses/${business.id}`"
              @click.stop
              rounded="pill"
            >
              Modifier
              <v-icon end size="small">mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { data: businesses, pending, error } = useFetchBusinessList();

const navigateToEdit = (id: string) => {
  navigateTo(`/businesses/${id}`);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
