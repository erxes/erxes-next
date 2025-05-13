export interface CatProdInput {
    categoryId: string;
    productId: string;
  }
  
  export interface GroupInput {
    _id?: string;
    name: string;
    description?: string;
    products?: string[];
  }
  
  export interface SlotInput {
    _id?: string;
    name: string;
    description?: string;
  }
  
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
    paymentTypes?: any[]; 
    isOnline?: boolean;
    onServer?: boolean;
    branchId?: string;
    departmentId?: string;
    allowBranchIds?: string[];
    beginNumber?: string;
    maxSkipNumber?: number;
    kitchenScreen?: any; 
    waitingScreen?: any; 
    kioskMachine?: any; 
    uiOptions?: any; 
    ebarimtConfig?: any; 
    erkhetConfig?: any; 
    cardsConfig?: any; 
    catProdMappings?: CatProdInput[];
    initialCategoryIds?: string[];
    kioskExcludeCategoryIds?: string[];
    kioskExcludeProductIds?: string[];
    deliveryConfig?: any; 
    checkRemainder?: boolean;
    permissionConfig?: any; 
    allowTypes?: string[];
    isCheckRemainder?: boolean;
    checkExcludeCategoryIds?: string[];
    banFractions?: boolean;
  }