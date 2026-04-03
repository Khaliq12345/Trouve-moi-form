export interface BizHours {
  open: string | null;
  close: string | null;
}

// Type pour le format UI des horaires (avec closed et value)
export interface HoursUI {
  closed: boolean;
  value: string;
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
  contact_email: string;
  website: string;
  hours: DaySchedule;
  featuredslot: string[];
  categories: string[];
  sub_categories: string[];
  reservation_available: boolean;
  menu_url: string;
  addresses: string[];
}
