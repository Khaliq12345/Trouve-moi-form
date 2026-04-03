// Composable pour récupérer les sous-catégories par slug de catégorie
import type { SubCategory } from '~/types/category';

export const useFetchSubCategoryByCat = () => {
  const { $directus, $readItems } = useNuxtApp();

  const { data: sub_categories, error } = useAsyncData(
    'sub_categories_all',
    () => {
      return $directus.request(
        $readItems('sub_categories', {
          fields: ['name', 'slug', { categories_new: ['name', 'slug'] }],
        }),
      );
    },
    {
      getCachedData: (key) => {
        return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
      },
    },
  );

  if (error.value) {
    // Error handled silently
  }

  // Fonction pour récupérer les sous-catégories d'une catégorie spécifique
  const getSubcategories = (catSlug: string) => {
    if (!sub_categories.value) return [];

    return sub_categories.value
      .filter((sub: any) => sub.categories_new?.slug === catSlug)
      .map((sub: any) => ({ name: sub.name, slug: sub.slug }));
  };

  return { sub_categories, getSubcategories, error };
};
