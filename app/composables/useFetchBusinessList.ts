import type { Biz } from "~/types/biz";

export const useFetchBusinessList = () => {
  const { $directus, $readItems } = useNuxtApp();

  const searchQuery = ref("");

  const {
    data: businesses,
    error,
    pending,
    refresh,
  } = useAsyncData<Biz[]>("businesses-list", async (): Promise<Biz[]> => {
    const params: Record<string, any> = {};

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    const results = await $directus.request($readItems("businesses", params));

    if (!results?.length) return [];

    return results as Biz[];
  });

  // Déclenche la recherche manuellement (bouton)
  const search = async () => {
    await refresh();
  };

  // Efface la recherche et recharge tout
  const clearSearch = async () => {
    searchQuery.value = "";
    await refresh();
  };

  return {
    businesses,
    error,
    pending,
    searchQuery,
    search,
    clearSearch,
  };
};
