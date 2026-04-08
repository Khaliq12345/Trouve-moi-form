// Type pour le format Directus des horaires (tableau avec objet anglais)
export interface DirectusHours {
  monday: { open: string | null; close: string | null };
  tuesday: { open: string | null; close: string | null };
  wednesday: { open: string | null; close: string | null };
  thursday: { open: string | null; close: string | null };
  friday: { open: string | null; close: string | null };
  saturday: { open: string | null; close: string | null };
  sunday: { open: string | null; close: string | null };
}

// Type pour le format UI des horaires (avec closed et value, jours en français)
export interface HoursUI {
  closed: boolean;
  value: [string, string]; // [open, close]
}

export interface DayScheduleUI {
  Lundi: HoursUI;
  Mardi: HoursUI;
  Mercredi: HoursUI;
  Jeudi: HoursUI;
  Vendredi: HoursUI;
  Samedi: HoursUI;
  Dimanche: HoursUI;
}

export interface BizHours {
  open: string | null;
  close: string | null;
}

export interface DaySchedule {
  Lundi: BizHours;
  Mardi: BizHours;
  Mercredi: BizHours;
  Jeudi: BizHours;
  Vendredi: BizHours;
  Samedi: BizHours;
  Dimanche: BizHours;
}

export interface BusinessFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price_range: number;
  calendar_link: string;
  phone: string;
  whatsapp: string;
  website: string;
  hours: DaySchedule | null | undefined; // Format UI avec jours français
  featuredslot: string[];
  categories: string[];
  sub_categories: string[];
  reservation_available: boolean;
  menu_url: string;
  locations: string;
  textDirections: { step: number; description: string }[];
}
