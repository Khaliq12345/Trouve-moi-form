// Composable pour récupérer un business unique par son slug
import type { Biz, BizLocation } from '~/types/biz';

export const useFetchSingleBusiness = (slug: string | Ref<string>) => {
  const { $directus, $readItems } = useNuxtApp();
  const slugRef = typeof slug === 'string' ? ref(slug) : slug;

  const { data: business, error, pending, refresh } = useAsyncData<Biz | null>(
    () => `business-${slugRef.value}`,
    async (): Promise<Biz | null> => {
      if (!slugRef.value) return null;

      // 1. Récupère le business avec toutes ses relations
      const results = await $directus.request(
        $readItems('businesses', {
          filter: {
            slug: { _eq: slugRef.value },
          },
          fields: [
            '*',
            'featuredslots.featured_slots_id.*',
            'sub_categories.sub_categories_id.*',
            'categories.categories_new_id.*',
            'locations.*',
          ],
        }),
      );

      if (!results?.length) return null;

      const business = results[0] as Biz & {
        featuredslots?: any[];
        sub_categories?: any[];
        categories?: any[];
        locations?: any[];
      };

      // Transforme les featured slots
      const featuredSlots =
        business?.featuredslots?.map(
          (junction: any) => junction.featured_slots_id,
        ) || [];

      // Transforme les sub_categories
      const subCategories =
        business?.sub_categories?.map(
          (junction: any) => junction.sub_categories_id,
        ) || [];

      // Transforme les categories
      const categories =
        business?.categories?.map(
          (junction: any) => junction.categories_new_id,
        ) || [];

      // 2. Récupère les locations si pas incluses
      let locations: BizLocation[] = [];

      if (!business.locations && business.id) {
        const locResponse = await $directus.request(
          $readItems('business_locations', {
            filter: {
              bussness: { _eq: business.id },
            },
            fields: ['*'],
          }),
        );
        locations = (locResponse as BizLocation[]) || [];
      } else {
        locations = business.locations || [];
      }

      return {
        ...business,
        featured_slots: featuredSlots,
        subcategories: subCategories,
        categories,
        locations,
      };
    },
    {
      immediate: true,
      getCachedData: (key) => {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  if (error.value) {
    // Error handled silently
  }

  return {
    business,
    error,
    pending,
    refresh,
  };
};
