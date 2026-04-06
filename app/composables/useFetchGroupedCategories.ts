// Composable pour récupérer les catégories groupées avec leurs sous-catégories
import type { Category, SubCategory, GroupedCategory } from '~/types/category';

export const useFetchGroupedCategories = () => {
  return useAsyncData<GroupedCategory[]>('grouped-categories', async () => {
    const { $directus, $readItems } = useNuxtApp();

    // Récupération simultanée des catégories et sous-catégories
    const [categoriesResult, subCategoriesResult] = await Promise.all([
      $directus.request($readItems('categories_new')),
      $directus.request($readItems('sub_categories')),
    ]);

    const categories = categoriesResult as Category[];
    const subCategories = subCategoriesResult as SubCategory[];

    // Groupage des sous-catégories par catégorie
    const groupedData: GroupedCategory[] = categories.map((category) => {
      const relatedSubCategories = subCategories.filter((sub) => {
        const parentId =
          typeof sub.categories_new === 'object' && sub.categories_new !== null
            ? (sub.categories_new as any).id
            : sub.categories_new;
        return parentId === category.id;
      });

      return {
        ...category,
        sub_categories: relatedSubCategories,
      };
    });

    return groupedData;
  }, {
    getCachedData: (key) => {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  });
};
