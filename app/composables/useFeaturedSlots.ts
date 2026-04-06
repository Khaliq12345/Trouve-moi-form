import type { FeaturedSlot } from '~/types/featuredSlot';

export const useFeaturedSlots = () => {
    return useAsyncData('featured-slots', async () => {
        const { $directus, $readItems } = useNuxtApp();
        const response = await $directus.request($readItems('featured_slots', {
            fields: ['id', 'feature', 'slug']
        }));
        return response as FeaturedSlot[];
    });
};
