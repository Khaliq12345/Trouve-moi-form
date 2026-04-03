export interface FeaturedSlot {
  id: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  feature: string;
  slug: string;
}
