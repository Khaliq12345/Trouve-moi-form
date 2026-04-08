// Composable pour gerer les metadonnees d'un business (inspire de TrouveMoi)
import type { BizMetaItem, GroupedBizMeta } from "~/types/biz";

/**
 * Composable pour gerer les metadonnees d'un business
 * Fournit CRUD et groupement par type (menu, service, portfolio, vibes, video)
 */
export const useBusinessMetas = (bizId?: Ref<string | null | undefined>) => {
  const { $directus, $readItems, $createItem, $updateItem, $deleteItem } =
    useNuxtApp();

  // Cle de cache unique par business
  const cacheKey = computed(() => {
    const id = bizId?.value;
    return id ? `meta-${id}` : "meta-all";
  });

  // Récupération des métas groupés par type
  const {
    data: groupedMetas,
    refresh: refreshMetas,
    pending: pendingMetas,
  } = useAsyncData<GroupedBizMeta>(
    cacheKey.value,
    async () => {
      const grouped: GroupedBizMeta = {
        menu: [],
        service: [],
        portfolio: [],
        vibes: [],
        video: [],
      };

      const currentBizId = bizId?.value;
      if (!currentBizId) {
        return grouped;
      }

      try {
        // Requete vers la collection "meta" avec relations
        const items = await $directus.request(
          $readItems("meta", {
            fields: [
              "*",
              "media.directus_files_id",
              "biz_id.id",
              "biz_id.name",
              "biz_id.slug",
            ],
            filter: { biz_id: { _eq: currentBizId } },
          })
        );

        items.forEach((item: any) => {
          // Extraction des IDs de fichiers depuis la relation media
          const extractedLinks =
            item.media && Array.isArray(item.media)
              ? item.media.map((m: any) => m.directus_files_id).filter(Boolean)
              : [];

          // Construction de l'objet BizMetaItem propre
          const cleanItem = {
            id: item.id,
            title: item.title || "",
            description: item.description || "",
            type: item.type || "service",
            price: item.price,
            biz_id: item.biz_id?.id || item.biz_id,
            biz_name: item.biz_id?.name,
            biz_slug: item.biz_id?.slug,
            media_type: item.media_type || "image",
            link: extractedLinks,
          } as BizMetaItem;

          // Classement dans la categorie correspondante
          if (cleanItem.type && grouped[cleanItem.type] !== undefined) {
            grouped[cleanItem.type]?.push(cleanItem);
          } else {
            // Type inconnu -> service par defaut
            grouped.service.push(cleanItem);
          }
        });

        return grouped;
      } catch (error) {
        console.error("Error fetching metas:", error);
        return grouped;
      }
    },
    {
      watch: [() => bizId?.value],
      immediate: true,
    }
  );

  // Creer un nouveau meta
  const createMeta = async (
    meta: Omit<BizMetaItem, "id" | "biz_name" | "biz_slug">
  ) => {
    const currentBizId = bizId?.value;
    if (!currentBizId) throw new Error("Business ID required");

    const payload = {
      title: meta.title,
      description: meta.description,
      type: meta.type,
      price: meta.price,
      biz_id: currentBizId,
      media_type: meta.media_type,
      media:
        meta.link?.map((fileId: string) => ({ directus_files_id: fileId })) ||
        [],
    };
    console.log(payload);

    const result = await $directus.request($createItem("meta", payload));
    await refreshMetas();
    return result;
  };

  // Mettre a jour un meta existant
  const updateMeta = async (id: string, meta: Partial<BizMetaItem>) => {
    const payload: any = {};
    if (meta.title !== undefined) payload.title = meta.title;
    if (meta.description !== undefined) payload.description = meta.description;
    if (meta.type !== undefined) payload.type = meta.type;
    if (meta.price !== undefined) payload.price = meta.price;
    if (meta.media_type !== undefined) payload.media_type = meta.media_type;
    if (meta.link !== undefined) {
      payload.media = meta.link.map((fileId: string) => ({
        directus_files_id: fileId,
      }));
    }

    const result = await $directus.request($updateItem("meta", id, payload));
    await refreshMetas();
    return result;
  };

  // Supprimer un meta
  const deleteMeta = async (id: string) => {
    await $directus.request($deleteItem("meta", id));
    await refreshMetas();
  };

  return {
    groupedMetas,
    refreshMetas,
    pendingMetas,
    createMeta,
    updateMeta,
    deleteMeta,
  };
};
