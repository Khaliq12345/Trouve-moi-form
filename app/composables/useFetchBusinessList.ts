import type { Biz } from "~/types/biz";

export const useFetchBusinessList = () => {
  const { $directus, $readItems } = useNuxtApp();

  const {
    data: businesses,
    error,
    pending,
    refresh,
  } = useAsyncData<Biz[]>("businesses-list", async (): Promise<Biz[]> => {
    const results = await $directus.request($readItems("businesses"));

    if (!results?.length) return [];

    return results.map((biz: any) => {
      return biz;
    }) as Biz[];
  });

  return {
    data: businesses,
    error,
    pending,
    refresh,
  };
};
