"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"

interface TagsManagerProps {
  initialTags?: string[]
}

export function TagsManager({ initialTags = [] }: TagsManagerProps) {
  const [tags, setTags] = React.useState<string[]>(initialTags)
  const [newTag, setNewTag] = React.useState("")
  const [isInputVisible, setIsInputVisible] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => {
            setIsInputVisible(true)
            inputRef.current?.focus()
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add tags</span>
        </button>
        {isInputVisible && (
          <input
            ref={inputRef}
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
            className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
            placeholder="Add a tag"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
            <span className="text-sm font-medium">{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
