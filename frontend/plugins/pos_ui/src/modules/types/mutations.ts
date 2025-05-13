export interface CatProdInput {
    categoryId: string;
    productId: string;
  }
  
  export interface GroupInput {
    _id?: string;
    name: string;
    description?: string;
    products?: string[];
    // Add other fields as needed
  }
  
  export interface SlotInput {
    _id?: string;
    name: string;
    description?: string;
    // Add other fields as needed
  }
  
  // Define common fields as a TypeScript type
  export interface PosCommonFieldsInput {
    name?: string;
    description?: string;
    orderPassword?: string;
    scopeBrandIds?: string[];
    pdomain?: string;
    erxesAppToken?: string;
    productDetails?: string[];
    adminIds?: string[];
    cashierIds?: string[];
    paymentIds?: string[];
    paymentTypes?: any[]; // JSON type
    isOnline?: boolean;
    onServer?: boolean;
    branchId?: string;
    departmentId?: string;
    allowBranchIds?: string[];
    beginNumber?: string;
    maxSkipNumber?: number;
    kitchenScreen?: any; // JSON type
    waitingScreen?: any; // JSON type
    kioskMachine?: any; // JSON type
    uiOptions?: any; // JSON type
    ebarimtConfig?: any; // JSON type
    erkhetConfig?: any; // JSON type
    cardsConfig?: any; // JSON type
    catProdMappings?: CatProdInput[];
    initialCategoryIds?: string[];
    kioskExcludeCategoryIds?: string[];
    kioskExcludeProductIds?: string[];
    deliveryConfig?: any; // JSON type
    checkRemainder?: boolean;
    permissionConfig?: any; // JSON type
    allowTypes?: string[];
    isCheckRemainder?: boolean;
    checkExcludeCategoryIds?: string[];
    banFractions?: boolean;
  }