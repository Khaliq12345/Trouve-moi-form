// Composable pour créer un business dans Directus
import type { BusinessFormData, DaySchedule } from '~/types/business';

interface DirectusHours {
  monday: { open: string | null; close: string | null };
  tuesday: { open: string | null; close: string | null };
  wednesday: { open: string | null; close: string | null };
  thursday: { open: string | null; close: string | null };
  friday: { open: string | null; close: string | null };
  saturday: { open: string | null; close: string | null };
  sunday: { open: string | null; close: string | null };
}

const dayMapping: Record<keyof DaySchedule, keyof DirectusHours> = {
  'Lundi': 'monday',
  'Mardi': 'tuesday',
  'Mercredi': 'wednesday',
  'Jeudi': 'thursday',
  'Vendredi': 'friday',
  'Samedi': 'saturday',
  'Dimanche': 'sunday'
};

// Mappe les jours français vers anglais pour Directus
const mapHoursToDirectus = (hours: DaySchedule): DirectusHours => {
  const result = {} as DirectusHours;
  (Object.keys(hours) as Array<keyof DaySchedule>).forEach((day) => {
    const englishDay = dayMapping[day];
    result[englishDay] = hours[day];
  });
  return result;
};

// Valide que les données essentielles sont présentes
const validateBusinessData = (formData: BusinessFormData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validation des adresses
  if (!formData.addresses || formData.addresses.length === 0) {
    errors.push('Au moins une adresse est requise');
  } else {
    formData.addresses.forEach((addr, idx) => {
      if (!addr?.trim()) {
        errors.push(`Adresse ${idx + 1}: l'adresse est vide`);
      }
    });
  }
  
  // Validation des horaires
  if (!formData.hours) {
    errors.push('Les horaires sont manquants');
  }
  
  // Validation des champs obligatoires
  if (!formData.name?.trim()) {
    errors.push('Le nom du business est requis');
  }
  if (!formData.categories || formData.categories.length === 0) {
    errors.push('Au moins une catégorie est requise');
  }
  
  return { valid: errors.length === 0, errors };
};

export const useCreateBusiness = () => {
    const createBusiness = async (formData: BusinessFormData) => {
        const { $directus, $createItem } = useNuxtApp();
        
        // Validation avant envoi
        const validation = validateBusinessData(formData);
        if (!validation.valid) {
            console.error('Validation échouée:', validation.errors);
            throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
        }
        
        // Mapper les hours vers le format Directus (jours en anglais)
        const directusHours = mapHoursToDirectus(formData.hours);
        
        // Générer le slug à partir du name
        const slug = formData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Préparation du payload avec mapping des relations M2M
        const businessPayload = {
            name: formData.name,
            slug: slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
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
            // Mapping des relations M2M
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
        

        // Créer le business
        const businessResponse = await $directus.request(
            $createItem('businesses', businessPayload)
        );
        
        return businessResponse;
    };
    
    return {
        createBusiness
    };
};
