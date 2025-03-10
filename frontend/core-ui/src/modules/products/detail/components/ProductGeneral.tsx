import { Upload } from "lucide-react"
import { useProductDetail } from "../hooks/useProductDetail"
import { Skeleton, Label, Input, Select, Button } from "erxes-ui/components"
import { useProductsEdit } from "@/products/hooks/useProductsEdit"
import { PRODUCT_TYPE_OPTIONS } from "@/products/constants/ProductConstants"
import { IconCurrencyDollar } from "@tabler/icons-react"
import { CurrencyDisplay } from "erxes-ui/display"
import { CurrencyCode } from "erxes-ui/types/CurrencyCode"
import { CurrencyInput } from "erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput"
import { useState, useEffect } from "react"
import { useApolloClient } from '@apollo/client';
import { SelectCategory } from "@/products/product-category/components/SelectCategory"
import { useUom } from "@/products/hooks/useUom";
import { BrandField } from "@/products/add-products/components/BrandField"
import { VendorField } from "@/products/add-products/components/vendorField"
import { ProductDetail, ProductGeneralProps } from "../types/detailTypes"
import { DescriptionInput } from "./DescriptionInput"

export const ProductGeneral = ({ form }: ProductGeneralProps) => {
  const { productDetail, loading: productLoading } = useProductDetail()
  const { productsEdit } = useProductsEdit()
  const [priceValue, setPriceValue] = useState<number>(0)
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false)
  const client = useApolloClient();
  const { uoms } = useUom({}); 
  
  const loading = productLoading
  
  useEffect(() => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice)
    }
  }, [productDetail])
  
  useEffect(() => {
    if (productDetail && form) {
      if (productDetail.scopeBrandIds && form.setValue) {
        form.setValue("scopeBrandIds", productDetail.scopeBrandIds);
      }
      if (productDetail.vendorId && form.setValue) {
        form.setValue("vendorId", productDetail.vendorId);
      }
    }
  }, [productDetail, form]);
  
  if (loading) {
    return <Skeleton className="w-full h-full" />
  }
  
  const { 
    _id, 
    name, 
    barcodeDescription,
    description, 
    categoryId, 
    type, 
    code, 
    status, 
    attachment, 
    barcodes, 
    shortName,
    uom,
    vendorId,
    scopeBrandIds
  } = productDetail || {} as ProductDetail

  const handleInputChange = (field: keyof ProductDetail, value: any) => {
    if (_id) {
      productsEdit({
        variables: {
          _id,
          [field]: value,
          uom,
        },
      })
    }
  }
  
  const handleSavePrice = async () => {
    if (_id) {
      productsEdit({
        variables: {
          _id,
          unitPrice: priceValue,
          uom,
        },
      })
      await client.refetchQueries({
        include: ['productDetail'],
      });
      setIsEditingPrice(false)
    }
  }

  const handleCancelPriceEdit = () => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice)
    }
    setIsEditingPrice(false)
  }
  
  const handleSaveDescription = (value: string) => {
    handleInputChange('description', value);
  }
  
  const handleSaveBarcodeDescription = (value: string) => {
    handleInputChange('barcodeDescription', value);
  }

  return (
    <div className="space-y-54 p-6 overflow-y-auto h-[900px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="product-name">PRODUCT NAME</Label>
          <Input 
            id="product-name" 
            defaultValue={name} 
            placeholder="Enter product name"
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcodes">BARCODES</Label>
          <Input 
            id="barcodes" 
            defaultValue={barcodes} 
            onChange={(e) => handleInputChange('barcodes', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">CODE</Label>
          <Input 
            id="code" 
            defaultValue={code}
            onChange={(e) => handleInputChange('code', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">CATEGORY</Label>
          <SelectCategory
            selected={categoryId}
            onSelect={(value) => {
              if (_id) {
                productsEdit({
                  variables: {
                    _id,
                    categoryId: value,
                    uom,
                  },
                })
              }
            }}
            className="w-full border border-gray-300"
            size="lg"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4" />
            <Label htmlFor="unit-price">UNIT PRICE</Label>
          </div>
          {isEditingPrice ? (
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <CurrencyInput
                  value={priceValue}
                  onChange={(value: number) => setPriceValue(value)}
                />
              </div>
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  
                  onClick={handleSavePrice}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelPriceEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => setIsEditingPrice(true)}
            >
              <CurrencyDisplay
                currencyValue={{
                  currencyCode: CurrencyCode.USD,
                  amountMicros: priceValue * 1000000,
                }}
              />
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingPrice(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">TYPE</Label>
          <Select 
            defaultValue={type}
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Choose type" />
            </Select.Trigger>
            <Select.Content>
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <Select.Item value={type.value} key={type.value}>
                  {type.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-display">STATUS</Label>
          <Input 
            id="category-display" 
            value={status} 
            disabled 
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uom">UNIT OF MEASUREMENTS</Label>
          <Select
            value={uom}
            onValueChange={(value) => handleInputChange("uom", value)}
          >
            <Select.Trigger className="w-full border rounded-md h-8">
              <Select.Value>
                {uom || "Select UOM"}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              {uoms.map((unit) => (
                <Select.Item key={unit._id} value={unit._id}>
                  {unit.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">BRAND</Label>
          <BrandField
            values={scopeBrandIds || ['']}
            onChange={(value) => handleInputChange('scopeBrandIds', value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">VENDOR</Label>
          <VendorField
            value={vendorId || ""}
            onChange={(value) => handleInputChange('vendorId', value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short-name">SHORT NAME</Label>
          <Input 
            id="short-name" 
            defaultValue={shortName} 
            onChange={(e) => handleInputChange('shortName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>PDF</Label>
          <Button variant="outline" className="w-full justify-between">
            Upload a PDF
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">DESCRIPTION</Label>
        <div className="h-60 border rounded-md overflow-hidden">
          <DescriptionInput 
            initialContent={description}
            onSave={handleSaveDescription}
            placeholder={description}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode-description">BARCODE DESCRIPTION</Label>
        <div className="h-60 border rounded-md overflow-hidden">
          <DescriptionInput 
            initialContent={barcodeDescription}
            onSave={handleSaveBarcodeDescription}
            placeholder={barcodeDescription}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>FEATURED IMAGE</Label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          {attachment ? (
            <div className="flex flex-col items-center">
              <img 
                src={attachment.url} 
                alt={name || "Product"} 
                className="max-h-40 mb-2"
              />
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          ) : (
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>SECONDARY IMAGES</Label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>
    </div>
  )
}