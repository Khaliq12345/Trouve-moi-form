export interface BizLocation {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  city: string;
  latitude: string;
  longitude: string;
  local_direction: string;
  is_main: boolean;
  biz: string;
  address: string;
}

export type BusinessLocations = BizLocation[];

export interface SubCategory {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  name: string;
  slug: string;
  categories_new: string;
}

export interface BizHours {
  open: string | null;
  close: string | null;
}

export interface FeaturedSlot {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
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

export interface BizsMediaItem {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  media_id: string;
  type: "image" | "video" | string;
  extra_type: "buisness" | string;
  extra_id: string;
  tags: string[];
  description: string | null;
  link: string;
}

export type GroupedBizMedia = Record<string, BizsMediaItem[]>;

export interface BizMedia {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  media_id: string;
  type: "image" | "video" | string;
  extra_type: "buisness" | string;
  extra_id: string;
  tags: string[];
  description: string | null;
}

export interface Biz {
  id: string;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  reviews_count: number;
  website?: string;
  is_open: boolean;
  hours: [DaySchedule];
  rating: number;
  price_range: number;
  slug: string;
  // Relations avec objets complets (pour affichage)
  categories: Array<{ id: string | number; name: string; slug?: string }>;
  featured_slots: FeaturedSlot[];
  subcategories?: SubCategory[];
  // Champs additionnels
  reservation_available?: boolean;
  calendar_link?: string;
  short_description?: string;
  menu_url?: string;
  locations?: string;
}

export interface BizMetaItem {
  id: string;
  title: string;
  description: string;
  type: "menu" | "service" | "portfolio" | "vibes" | "video" | string;
  price?: number | string | null;
  biz_id: string;
  biz_name?: string;
  biz_slug?: string;
  media_type: "image" | "video" | string;
  link: string[];
}

export interface GroupedBizMeta {
  menu: BizMetaItem[];
  service: BizMetaItem[];
  portfolio: BizMetaItem[];
  vibes: BizMetaItem[];
  video: BizMetaItem[];
  [key: string]: BizMetaItem[];
}
