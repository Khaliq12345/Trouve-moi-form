import type { Biz } from "~/types/biz";

export const useFetchSingleBusiness = (id: string) => {
  const { $directus, $readItems } = useNuxtApp();

  const {
    data: business,
    error,
    pending,
    refresh,
  } = useAsyncData<Biz | null>(
    `businest-${id}`,
    async (): Promise<Biz | null> => {
      if (!id) return null;

      // 1. Récupère le business par ID
      const results = await $directus.request(
        $readItems("businesses", {
          filter: {
            id: { _eq: id }, // On filtre strictement par ID
          },
          fields: [
            "*",
            "featuredslots.featured_slots_id.*",
            "sub_categories.sub_categories_id.*",
            "categories.categories_new_id.*",
          ],
        })
      );

      if (!results?.length) return null;

      const biz = results[0] as any;

      // Transforme les relations
      const featuredSlots =
        biz.featuredslots
          ?.map((j: any) => j.featured_slots_id)
          .filter(Boolean) || [];
      const subCategories =
        biz.sub_categories
          ?.map((j: any) => j.sub_categories_id)
          .filter((s: any) => s && s.id) || [];
      const categories =
        biz.categories?.map((j: any) => j.categories_new_id).filter(Boolean) ||
        [];

      return {
        ...biz,
        // Garde les objets complets avec leurs noms pour l'affichage
        featured_slots: featuredSlots.filter(Boolean),
        subcategories: subCategories,
        categories: categories.filter(Boolean),
      };
    }
  );

  return {
    business,
    error,
    pending,
    refresh,
  };
};
