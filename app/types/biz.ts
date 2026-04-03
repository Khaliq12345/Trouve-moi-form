export interface BizLocation {
  id: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  city: string;
  latitude?: string;
  longitude?: string;
  local_direction?: string;
  is_main: boolean;
  bussness?: string;
  address?: string;
}

export interface SubCategory {
  id: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  name: string;
  slug: string;
  categories_new?: string;
}

export interface BizHours {
  open: string | null;
  close: string | null;
}

export interface FeaturedSlot {
  id: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  feature: string;
  slug: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Biz {
  id: string;
  sort?: number | null;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  name: string;
  description: string;
  phone: string;
  whatsapp?: string;
  reviews_count?: number;
  website?: string;
  is_open: boolean;
  hours?: DaySchedule;
  rating?: number;
  price_range: number;
  slug: string;
  categories?: Category[];
  featuredslots?: number[];
  featured_slots?: FeaturedSlot[];
  sub_categories?: any[];
  subcategories?: SubCategory[];
  locations?: BizLocation[];
  reservation_available?: boolean;
  calendar_link?: string;
  contact_email?: string;
}
