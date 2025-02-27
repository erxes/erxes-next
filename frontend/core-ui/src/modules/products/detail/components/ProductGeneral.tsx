import { Upload } from "lucide-react"
import { useProductDetail } from "../hooks/useProductDetail"
import { Skeleton, Label, Input, Select, Button } from "erxes-ui/components"
import { useProductsEdit } from "@/products/hooks/useProductsEdit"
import { useProductCategories } from "@/products/product-category/hooks/useProductCategories"
import { PRODUCT_TYPE_OPTIONS } from "@/products/constants/ProductConstants"
import { IconCurrencyDollar } from "@tabler/icons-react"
import { CurrencyDisplay } from "erxes-ui/display"
import { CurrencyCode } from "erxes-ui/types/CurrencyCode"
import { CurrencyInput } from "erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput"
import { useState, useEffect } from "react"
import { useApolloClient } from '@apollo/client';
import { SelectCategory } from "@/products/product-category/components/SelectCategory"


export const ProductGeneral = () => {
  const { productDetail, loading: productLoading } = useProductDetail()
  const { productCategories, loading: categoriesLoading } = useProductCategories()
  const { productsEdit } = useProductsEdit()
  const [priceValue, setPriceValue] = useState(0)
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const client = useApolloClient();
  
  const loading = productLoading || categoriesLoading
  useEffect(() => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice)
    }
  }, [productDetail])
  
  if (loading) {
    return <Skeleton className="w-full h-full" />
  }
  
  const { 
    _id, 
    name, 
    unitPrice, 
    barcodeDescription,
    description, 
    categoryId, 
    type, 
    code, 
    status, 
    attachment, 
    barcodes, 
    shortName,
    brand,
    uom,
    vendor
  } = productDetail || {}

  const handleInputChange = (field, value) => {
    productsEdit({
      variables: {
        _id,
        [field]: value,
        uom,
      },
    })
  }
  
  const handleSavePrice = async () => {
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

  const handleCancelPriceEdit = () => {
    if (productDetail && productDetail.unitPrice !== undefined) {
      setPriceValue(productDetail.unitPrice)
    }
    setIsEditingPrice(false)
  }

  return (
    <div className="space-y-8 p-6">
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
      productsEdit({
        variables: {
          _id,
          categoryId: value,
          uom,
        },
      })
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
                  onChange={setPriceValue}
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
          <Label htmlFor="short-name">SHORT NAME</Label>
          <Input 
            id="short-name" 
            defaultValue={shortName} 
            onChange={(e) => handleInputChange('shortName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">BRAND</Label>
          <Select
            defaultValue={brand}
            onValueChange={(value) => handleInputChange('brand', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Choose brands" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="brand1">Brand 1</Select.Item>
              <Select.Item value="brand2">Brand 2</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">VENDOR</Label>
          <Select
            defaultValue={vendor}
            onValueChange={(value) => handleInputChange('vendor', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Choose vendor" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={vendor}>{vendor}</Select.Item>
              <Select.Item value="vendor1">Vendor 1</Select.Item>
              <Select.Item value="vendor2">Vendor 2</Select.Item>
            </Select.Content>
          </Select>
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
        <Input 
            id="product-description" 
            defaultValue={description} 
            placeholder="Enter product description"
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode-description">BARCODE DESCRIPTION</Label>
        <Input 
            id="product-barcodeDescription" 
            defaultValue={barcodeDescription} 
            placeholder="Enter product barcodeDescription"
            onChange={(e) => handleInputChange('barcodeDescription', e.target.value)}
          />
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