// Composable pour mettre à jour un business
import type { BusinessFormData, DayScheduleUI } from '~/types/business';

interface DirectusHours {
  monday: { open: string | null; close: string | null };
  tuesday: { open: string | null; close: string | null };
  wednesday: { open: string | null; close: string | null };
  thursday: { open: string | null; close: string | null };
  friday: { open: string | null; close: string | null };
  saturday: { open: string | null; close: string | null };
  sunday: { open: string | null; close: string | null };
}

type DayOfWeekUI = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';

const dayMapping: Record<DayOfWeekUI, keyof DirectusHours> = {
  'Lundi': 'monday',
  'Mardi': 'tuesday',
  'Mercredi': 'wednesday',
  'Jeudi': 'thursday',
  'Vendredi': 'friday',
  'Samedi': 'saturday',
  'Dimanche': 'sunday'
};

const mapHoursToDirectus = (hours: DayScheduleUI): DirectusHours => {
  const result = {} as DirectusHours;
  (Object.keys(hours) as DayOfWeekUI[]).forEach((day) => {
    const englishDay = dayMapping[day];
    const hourData = hours[day];
    if (hourData.closed) {
      result[englishDay] = { open: null, close: null };
    } else {
      result[englishDay] = { open: hourData.value[0], close: hourData.value[1] };
    }
  });
  return result;
};

export const useUpdateBusiness = (id: string, formData: BusinessFormData) => {
  const { $directus, $updateItem } = useNuxtApp();

  const directusHours = mapHoursToDirectus(formData.hours);

  const businessPayload = {
    name: formData.name,
    slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
    short_description: formData.short_description,
    description: formData.description,
    price_range: formData.price_range,
    calendar_link: formData.calendar_link,
    phone: formData.phone,
    whatsapp: formData.whatsapp,
    website: formData.website,
    reservation_available: formData.reservation_available,
    hours: directusHours,
    addresses: formData.addresses.filter(a => a?.trim()),
    categories: formData.categories.map(id => ({
      categories_new_id: id
    })),
    sub_categories: formData.sub_categories.map(id => ({
      sub_categories_id: id
    })),
    featuredslots: formData.featuredslot.map(id => ({
      featured_slots_id: id
    }))
  };

  return $directus.request(
    $updateItem('businesses', id, businessPayload)
  );
};
