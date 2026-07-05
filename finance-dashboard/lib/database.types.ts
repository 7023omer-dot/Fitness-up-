export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "sale"
  | "product_cost"
  | "advertising"
  | "processing_fee"
  | "shipping"
  | "software"
  | "other";

export type TransactionSource = "manual" | "csv_import" | "shopify";

export type AdPlatform = "facebook" | "tiktok" | "google" | "other";

export type Product = {
  id: string;
  name: string;
  cost: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  product_id: string | null;
  amount: number;
  quantity: number | null;
  date: string;
  paid_to: string | null;
  note: string | null;
  paid: boolean;
  source: TransactionSource;
  external_id: string | null;
  created_by: string | null;
  created_at: string;
};

export type AdCampaign = {
  id: string;
  platform: AdPlatform;
  product_id: string | null;
  spend: number;
  attributed_revenue: number;
  date: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Product> & { name: string };
        Update: Partial<Product>;
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: Partial<Transaction> & {
          type: TransactionType;
          category: TransactionCategory;
          amount: number;
        };
        Update: Partial<Transaction>;
        Relationships: [];
      };
      ad_campaigns: {
        Row: AdCampaign;
        Insert: Partial<AdCampaign> & { platform: AdPlatform };
        Update: Partial<AdCampaign>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  sale: "מכירה",
  product_cost: "עלות מוצר",
  advertising: "פרסום",
  processing_fee: "עמלת סליקה",
  shipping: "משלוח",
  software: "אפליקציות/תוכנה",
  other: "אחר",
};

export const PLATFORM_LABELS: Record<AdPlatform, string> = {
  facebook: "פייסבוק",
  tiktok: "טיקטוק",
  google: "גוגל",
  other: "אחר",
};
