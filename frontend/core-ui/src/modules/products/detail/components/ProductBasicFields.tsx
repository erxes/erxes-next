import type React from "react";
import { Form, Input, Select, CurrencyField, Label, Button } from "erxes-ui";
import { PRODUCT_TYPE_OPTIONS } from "@/products/constants/ProductConstants";
import { SelectBrand, SelectCompany , SelectCategory } from "ui-modules";
import { Control } from "react-hook-form";
import { IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import { ProductFormValues } from "@/products/constants/formSchema";


interface UnitOfMeasurement {
  _id: string;
  name: string;
}

interface ProductBasicFieldsProps {
  control: Control<ProductFormValues>;
  uoms: UnitOfMeasurement[];
}

export const ProductBasicFields: React.FC<ProductBasicFieldsProps> = ({ 
  control, 
  uoms 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Form.Field
        control={control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              PRODUCT NAME
            </Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Enter product name" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="barcodes"
        render={({ field }) => {
          const barcodes = Array.isArray(field.value) && field.value.length > 0 
            ? field.value 
            : [""];

          return (
            <Form.Item>
              <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
                BARCODES
              </Form.Label>
              <div className="space-y-2">
                {barcodes.map((barcode: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={barcode}
                      onChange={(e) => {
                        const newBarcodes = [...barcodes];
                        newBarcodes[index] = e.target.value;
                        const filteredBarcodes = newBarcodes.filter(b => b.trim() !== "");
                        field.onChange(filteredBarcodes);
                      }}
                      placeholder="Enter barcode"
                      className="flex-1"
                    />
                    {barcodes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newBarcodes = barcodes.filter((_: string, i: number) => i !== index);
                          field.onChange(newBarcodes.length > 0 ? newBarcodes : []);
                        }}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentBarcodes = Array.isArray(field.value) ? field.value : [];
                    field.onChange([...currentBarcodes, ""]);
                  }}
                  className="w-full"
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Barcode
                </Button>
              </div>
              <Form.Message />
            </Form.Item>
          );
        }}
      />

      <Form.Field
        control={control}
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              CODE
            </Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Enter code" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              CATEGORY
            </Form.Label>
            <Form.Control className="h-8">
              <SelectCategory
                selected={field.value}
                onSelect={field.onChange}
                className="w-full border border-gray-300"
                size="lg"
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="unitPrice"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>UNIT PRICE</Form.Label>
            <Form.Control>
              <CurrencyField.ValueInput 
                value={field.value} 
                onChange={(value) => field.onChange(value)} 
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="status"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider">
              STATUS
            </Form.Label>
            <Form.Control>
              <Input {...field} disabled className="bg-gray-50" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="type"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              TYPE
            </Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger className="w-full border-gray-200 rounded-md">
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
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="uom"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              UNIT OF MEASUREMENTS
            </Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger className="w-full border-gray-200 rounded-md">
                <Select.Value placeholder="Select UOM" />
              </Select.Trigger>
              <Select.Content>
                {uoms.map((unit) => (
                  <Select.Item key={unit._id} value={unit._id}>
                    {unit.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Form.Message />
          </Form.Item>
        )}
      />

        <Form.Field
          control={control}
          name="scopeBrandIds"
          render={({ field }) => (
            <Form.Item className="">
              <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">BRAND</Form.Label>
              <Form.Control>
              <SelectBrand
                value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ''}
                onValueChange={(brandId) => {
                  field.onChange([brandId]);
                }}
              />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />

      <Form.Field
        control={control}
        name="vendorId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              VENDOR
            </Form.Label>
            <Form.Control>
              <SelectCompany value={field.value} onValueChange={field.onChange} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="shortName"
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
              SHORT NAME
            </Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Enter short name" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
            PDF
          </Label>
          <Button variant="outline" className="w-full justify-between h-8" type="button">
            Upload a PDF
            <IconUpload className="h-4 w-4" />
          </Button>
        </div>
    </div>
  );
};