// Composable pour récupérer les features par catégorie
export const useFetchFeaturesByCategory = () => {
  const { $directus, $readItems } = useNuxtApp();

  const { data: categories, error } = useAsyncData('categories_features', () => {
    return $directus.request(
      $readItems('categories_new', {
        fields: [
          'slug',
          'name',
          'description',
          {
            features: [
              {
                featured_slots_id: ['slug', 'feature'],
              },
            ],
          },
        ],
      }),
    );
  }, {
    getCachedData: (key) => {
      return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
    },
  });

  if (error.value) {
    // Error handled silently
  }

  const getFeatures = (catSlug: string) => {
    if (!categories.value) return [];

    const category = (categories.value as any[]).find((c) => c.slug === catSlug);
    if (!category || !category.features) return [];

    return category.features.map((junction: any) => ({
      name: junction.featured_slots_id.feature,
      slug: junction.featured_slots_id.slug,
    }));
  };

  return { categories, getFeatures, error };
};
