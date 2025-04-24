import { atom } from "jotai";

export const posCategoryAtom = atom<string>('ecommerce')

export interface PermissionSettings {
    adminPrintTempBill: boolean
    adminDirectSales: boolean
    adminDirectDiscountLimit: string
    adminTeamMember: string
  }
  export interface cashierSettings{
    cashierPrintTempBill: boolean
    cashierDirectSales: boolean
    cashierDirectDiscountLimit: string
    cashierTeamMember: string
  }
  
  export const permissionSettingsAtom = atom<PermissionSettings>({
    adminPrintTempBill: false,
    adminDirectSales: false,
    adminDirectDiscountLimit: "",
    adminTeamMember: "",
  })
  export const cashierSettingsAtom = atom<cashierSettings>({
    cashierPrintTempBill: false,
    cashierDirectSales: false,
    cashierDirectDiscountLimit: "",
    cashierTeamMember: "",
  })

  export interface ProductGroup {
    name: string
    description: string
    productCategory: string
    excludeProductCategory: string
    excludeProducts: string
  }
  
  export interface ProductServiceSettings {
    productGroups: ProductGroup[]
    initialProductCategory: string
    kioskExcludeCategories: string
    kioskExcludeProducts: string
    remainderConfigEnabled: boolean
    excludeCategories: string
    banFractions: boolean
  }
  
  export const productServiceSettingsAtom = atom<ProductServiceSettings>({
    productGroups: [],
    initialProductCategory: "",
    kioskExcludeCategories: "",
    kioskExcludeProducts: "",
    remainderConfigEnabled: false,
    excludeCategories: "",
    banFractions: false,
  })
  export const paymentMethodsAtom = atom<
  Array<{
    type: string
    title: string
    icon: string
    config: string
  }>
>([])

export interface ScreenConfigSettings {
  kitchenScreenEnabled: boolean
  showTypes: string
  statusChange: string
  watchingScreenEnabled: boolean
  changeType: string
  changeCount: string
  contentUrl: string
  printEnabled: boolean
}

export const screenConfigSettingsAtom = atom<ScreenConfigSettings>({
  kitchenScreenEnabled: false,
  showTypes: "defined",
  statusChange: "",
  watchingScreenEnabled: false,
  changeType: "",
  changeCount: "",
  contentUrl: "",
  printEnabled: false,
})

export interface EbarimtConfigSettings {
  companyName: string
  ebarimtUrl: string
  checkTaxpayerUrl: string
  companyRd: string
  merchantin: string
  posno: string
  districtCode: string
  branchNo: string
  defaultGsCode: string
  hasVat: boolean
  vatPercent: string
  hasUbCityTax: boolean
  ubCityTaxPercent: string
  anotherRuleOfProductsOnCityTax: string
  headerText: string
  footerText: string
  hasCopy: boolean
}

export const ebarimtConfigSettingsAtom = atom<EbarimtConfigSettings>({
  companyName: "Kiosk",
  ebarimtUrl: "Kiosk",
  checkTaxpayerUrl: "Kiosk",
  companyRd: "Kiosk",
  merchantin: "Kiosk",
  posno: "Kiosk",
  districtCode: "Kiosk",
  branchNo: "Kiosk",
  defaultGsCode: "Kiosk",
  hasVat: true,
  vatPercent: "0",
  hasUbCityTax: true,
  ubCityTaxPercent: "0",
  anotherRuleOfProductsOnCityTax: "reserveCtaxRules",
  headerText: "0",
  footerText: "0",
  hasCopy: true,
})

export interface DeliveryConfigSettings {
  board: string
  pipeline: string
  stage: string
  watchedUsers: string
  assignedUsers: string
  deliveryProduct: string
}

export const deliveryConfigSettingsAtom = atom<DeliveryConfigSettings>({
  board: "",
  pipeline: "",
  stage: "",
  watchedUsers: "",
  assignedUsers: "",
  deliveryProduct: "",
})

export interface SyncCardConfig {
  title: string
  brunch: string
  stageBoard: string
  pipeline: string
  stage: string
  assignedUsers: string
  mapField: string
}

export interface SyncCardSettings {
  showNewConfig: boolean
  configs: SyncCardConfig[]
  currentConfig: SyncCardConfig
}

export const syncCardSettingsAtom = atom<SyncCardSettings>({
  showNewConfig: false,
  configs: [],
  currentConfig: {
    title: "",
    brunch: "",
    stageBoard: "",
    pipeline: "",
    stage: "",
    assignedUsers: "",
    mapField: "",
  },
})

export interface FinanceConfigSettings {
  isSyncErkhet: boolean
  checkErkhet: boolean
  checkInventories: boolean
  userEmail: string
  beginBillNumber: string
  defaultPay: string
  account: string
  location: string
}

export const financeConfigSettingsAtom = atom<FinanceConfigSettings>({
  isSyncErkhet: false,
  checkErkhet: false,
  checkInventories: false,
  userEmail: "",
  beginBillNumber: "",
  defaultPay: "",
  account: "",
  location: "",
})