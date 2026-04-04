// Ré-exporte SubCategory depuis biz.ts pour éviter les doublons
export type { SubCategory } from './biz';

// Définition de la structure d'une catégorie selon le modèle "Categories New"
export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  important?: boolean;
  features?: any;
  icon?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
}

// L'objet de retour final : la catégorie étendue avec ses sous-catégories
export interface GroupedCategory extends Category {
  sub_categories: import('./biz').SubCategory[];
}
