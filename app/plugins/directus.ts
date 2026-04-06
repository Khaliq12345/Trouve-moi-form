import {
  createDirectus,
  rest,
  readItem,
  readItems,
  createItem,
  updateItem,
  deleteItem,
  uploadFiles,
  staticToken,
} from "@directus/sdk";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directus = createDirectus(config.public.directusUrl)
    .with(rest())
    .with(staticToken(config.public.staticTokenPublic));

  return {
    provide: { directus, readItem, readItems, createItem, updateItem, deleteItem, uploadFiles },
  };
});
