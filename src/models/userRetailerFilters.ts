// src/models/userRetailerFilters.ts

export interface UserRetailerFilters {
  userId: string;                      // uuid - foreign key to users
  configured: boolean;                 // Has user completed initial setup?
  activeCategories: string[];          // e.g., ['location', 'demographics', 'pricePoint']
  filters: RetailerFilterValues;       // Actual filter values
  createdAt: Date;
  updatedAt: Date;
}

export interface RetailerFilterValues {
  // Location
  region?: string[];
  state?: string[];
  city?: string[];
  
  // Retailer Type
  retailerType?: string[];
  minLocations?: number | null;
  maxLocations?: number | null;
  
  // Price Point
  pricePoint?: string[];
  
  // Target Demographics
  targetGender?: string[];
  targetAgeGroup?: string[];
  minRating?: number | null;
  
  // Product Categories
  categories?: string[];
  minMSRP?: number | null;
  maxMSRP?: number | null;
  
  // Aesthetic
  aesthetics?: string[];
  seasonality?: string[];
  
  // Financial
  minRevenue?: number | null;
  maxRevenue?: number | null;
  
  // Buying Terms
  otbStrategy?: string[];
  minOrderSize?: number | null;
  maxOrderSize?: number | null;
  paymentTerms?: string[];
  
  // Operations
  ediRequired?: boolean | null;
  dropshipEnabled?: boolean | null;
}

export interface CreateUserRetailerFiltersInput {
  userId: string;
  configured?: boolean;
  activeCategories?: string[];
  filters?: Partial<RetailerFilterValues>;
}

export interface UpdateUserRetailerFiltersInput {
  configured?: boolean;
  activeCategories?: string[];
  filters?: Partial<RetailerFilterValues>;
}

/**
 * Create empty default filter values
 */
export function createEmptyFilters(): RetailerFilterValues {
  return {
    region: [],
    state: [],
    city: [],
    retailerType: [],
    minLocations: null,
    maxLocations: null,
    pricePoint: [],
    targetGender: [],
    targetAgeGroup: [],
    minRating: null,
    categories: [],
    minMSRP: null,
    maxMSRP: null,
    aesthetics: [],
    seasonality: [],
    minRevenue: null,
    maxRevenue: null,
    otbStrategy: [],
    minOrderSize: null,
    maxOrderSize: null,
    paymentTerms: [],
    ediRequired: null,
    dropshipEnabled: null
  };
}