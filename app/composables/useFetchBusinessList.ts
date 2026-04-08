import type { Biz } from "~/types/biz";

const PAGE_SIZE = 10;

export const useFetchBusinessList = () => {
  const { $directus, $readItems } = useNuxtApp();

  const searchQuery = ref("");
  const businesses = ref<Biz[]>([]);
  const pending = ref(false);
  const error = ref<any>(null);
  const page = ref(1);
  const hasMore = ref(false);

  const fetchPage = async (p: number, reset = false) => {
    pending.value = true;
    error.value = null;

    try {
      const params: Record<string, any> = {
        limit: PAGE_SIZE,
        page: p,
      };

      if (searchQuery.value.trim()) {
        params.search = searchQuery.value.trim();
      }

      const items = ((await $directus.request($readItems("businesses", params))) || []) as Biz[];

      businesses.value = reset ? items : [...businesses.value, ...items];
      hasMore.value = items.length === PAGE_SIZE;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  };

  // Chargement initial
  onMounted(() => fetchPage(1, true));

  // Recherche : repart de la page 1 et écrase les résultats
  const search = async () => {
    page.value = 1;
    await fetchPage(1, true);
  };

  // Effacement du filtre : repart de zéro
  const clearSearch = async () => {
    searchQuery.value = "";
    page.value = 1;
    await fetchPage(1, true);
  };

  // Charge la page suivante et accumule
  const loadMore = async () => {
    page.value++;
    await fetchPage(page.value, false);
  };

  return {
    businesses,
    pending,
    error,
    searchQuery,
    hasMore,
    search,
    clearSearch,
    loadMore,
  };
};
