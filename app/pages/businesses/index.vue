<template>
  <v-container fluid class="bg-black min-h-screen pa-3 pa-sm-4 pa-md-8">
    <!-- Header -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="8">
        <h1 class="text-h5 text-sm-h4 font-weight-bold text-white">Businesses</h1>
        <p class="text-caption text-sm-body-2 text-grey-lighten-1 mt-1">
          {{ businesses?.length || 0 }}
          business{{ (businesses?.length || 0) !== 1 ? "es" : "" }} trouvé{{
            (businesses?.length || 0) !== 1 ? "s" : ""
          }}
        </p>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-start justify-sm-end">
        <v-btn
          to="/"
          color="white"
          variant="elevated"
          prepend-icon="mdi-plus"
          rounded="pill"
          class="text-black font-weight-bold"
          block
          :class="{ 'max-w-btn': true }"
        >
          Nouveau Business
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search bar -->
    <v-row class="mb-5">
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un business…"
          variant="outlined"
          rounded="lg"
          color="white"
          bg-color="grey-darken-4"
          prepend-inner-icon="mdi-magnify"
          hide-details
          theme="dark"
          @keyup.enter="search"
        >
          <template #append>
            <v-btn
              v-if="searchQuery"
              icon="mdi-close"
              variant="text"
              color="grey-lighten-1"
              size="small"
              @click="clearSearch"
            />
            <v-btn
              color="white"
              variant="elevated"
              rounded="lg"
              :loading="pending"
              @click="search"
              class="ml-1 ml-sm-2 text-black font-weight-bold text-none"
              size="default"
            >
              <span class="d-none d-sm-inline">Rechercher</span>
              <v-icon class="d-sm-none">mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="pending && !businesses?.length">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="white" size="48" />
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" rounded="lg" theme="dark">
          Erreur lors du chargement. Veuillez réessayer.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Empty state -->
    <v-row v-else-if="!businesses?.length">
      <v-col cols="12">
        <v-alert type="info" variant="tonal" rounded="lg" theme="dark">
          <span v-if="searchQuery">
            Aucun résultat pour "<strong>{{ searchQuery }}</strong>".
          </span>
          <span v-else>Aucun business trouvé. Créez votre premier business !</span>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Business cards grid -->
    <v-row v-else dense>
      <v-col
        v-for="business in businesses"
        :key="business.id"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <v-card
          theme="dark"
          color="grey-darken-4"
          class="w-100"
          rounded="xl"
          elevation="8"
          hover
          @click="navigateToEdit(business.id)"
        >
          <v-card-item class="pa-3 pa-sm-4">
            <template v-slot:prepend>
              <v-avatar
                color="white"
                size="40"
                class="text-subtitle-1 text-black font-weight-bold"
              >
                {{ business.name.charAt(0).toUpperCase() }}
              </v-avatar>
            </template>
            <v-card-title class="text-subtitle-1 text-sm-h6 font-weight-bold text-white">
              {{ business.name }}
            </v-card-title>
            <template v-slot:append>
              <v-chip
                :color="business.is_open ? 'success' : 'error'"
                size="x-small"
                variant="elevated"
              >
                {{ business.is_open ? "Ouvert" : "Fermé" }}
              </v-chip>
            </template>
          </v-card-item>

          <v-card-text class="text-grey-lighten-1 pt-0 pb-1 px-3 px-sm-4">
            <p class="text-body-2 line-clamp-2">
              {{ business.description || "Pas de description" }}
            </p>
          </v-card-text>

          <v-card-actions class="px-3 px-sm-4 pb-3 pt-0">
            <v-spacer />
            <v-btn
              variant="text"
              color="white"
              size="small"
              :to="`/businesses/${business.id}`"
              @click.stop
              rounded="pill"
              class="text-none"
            >
              Modifier
              <v-icon end size="small">mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Voir plus -->
    <v-row v-if="hasMore && !pending" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn
          color="white"
          variant="outlined"
          rounded="pill"
          size="large"
          :loading="pending"
          prepend-icon="mdi-chevron-down"
          class="px-8 font-weight-bold"
          @click="loadMore"
        >
          Voir plus
        </v-btn>
      </v-col>
    </v-row>

    <!-- Spinner discret pendant le chargement de la page suivante -->
    <v-row v-if="pending && businesses?.length" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="grey" size="32" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { businesses, pending, error, searchQuery, hasMore, search, clearSearch, loadMore } =
  useFetchBusinessList();

const navigateToEdit = (id: string) => {
  navigateTo(`/businesses/${id}`);
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.max-w-btn {
  max-width: 240px;
}

@media (max-width: 599px) {
  .max-w-btn {
    max-width: 100%;
  }
}
</style>
