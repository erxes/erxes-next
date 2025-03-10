import * as React from "react"
import { Plus, X } from "lucide-react"
import { useProductTags } from "@/products/hooks/useProductTags"
import { Button, Dialog, Input, Label, Select } from "erxes-ui/components"
import { DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"

interface TagsManagerProps {
  initialTags?: string[]
}

export function TagsManager({ initialTags = [] }: TagsManagerProps) {
  const { tags: availableTags } = useProductTags()
  const [tags, setTags] = React.useState<string[]>(initialTags)
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    type: "default",
    colorCode: "#CCCCCC",
    parentId: "",
  })
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setShowDeleteConfirmation(tagToRemove)
  }

  const confirmDelete = () => {
    setTags(tags.filter((tag) => tag !== showDeleteConfirmation))
    setShowDeleteConfirmation(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirmation(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (tags.includes(formData.name)) {
      alert("Tag already exists!")
      return
    }

    setTags((prevTags) => [...prevTags, formData.name])
    setOpen(false) 
    setFormData({
      name: "",
      type: "default",
      colorCode: "#CCCCCC",
      parentId: "",
    })
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            <span>Add tags</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Add New Tag</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={handleSelectChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="colorCode" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="colorCode"
                    name="colorCode"
                    type="color"
                    value={formData.colorCode}
                    onChange={handleInputChange}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    name="colorCode"
                    value={formData.colorCode}
                    onChange={(e) => {
                      if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
                        handleInputChange(e);
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentId" className="text-right">
                  Parent ID
                </Label>
                <Input
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="(Optional)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {availableTags?.map((tag) => (
          <div key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
            <span className="text-sm font-medium">{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
              title="Remove tag"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </div>
        ))}
      </div>

      {showDeleteConfirmation && (
        <Dialog open={true} onOpenChange={() => setShowDeleteConfirmation(null)}>
          <DialogContent className="sm:max-w-[300px]">
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{showDeleteConfirmation}"?
            </DialogDescription>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmDelete}>
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
