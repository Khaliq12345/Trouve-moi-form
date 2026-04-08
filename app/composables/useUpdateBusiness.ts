// Composable pour mettre à jour un business
import type { BusinessFormData } from "~/types/business";

export const useUpdateBusiness = (id: string, formData: BusinessFormData) => {
  const { $directus, $updateItem } = useNuxtApp();

  const businessPayload = {
    name: formData.name,
    slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
    short_description: formData.short_description,
    description: formData.description,
    price_range: formData.price_range,
    calendar_link: formData.calendar_link,
    phone: formData.phone,
    whatsapp: formData.whatsapp,
    website: formData.website,
    reservation_available: formData.reservation_available,
    hours: formData.hours,
    // addresses: formData.addresses.filter((a) => a?.trim()),
    categories: formData.categories.map((id) => ({
      categories_new_id: id,
    })),
    sub_categories: formData.sub_categories.map((id) => ({
      sub_categories_id: id,
    })),
    featuredslots: formData.featuredslot.map((id) => ({
      featured_slots_id: id,
    })),
  };

  return $directus.request($updateItem("businesses", id, businessPayload));
};
