"use client"
import { CollapsibleSection } from "./collapsibleSection"
import { TagsManager } from "./tagsManager"

export  function ProductProperties() {
  return (
    <div className="mx-auto w-full  bg-white">
      <CollapsibleSection title="Hotels">
        <div className="text-gray-600">
          <p>...</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Tags" defaultOpen={true}>
        <TagsManager
          initialTags={[
            "UFC",
            "Joe Rogan Podcast",
            "Ultimate Fighter",
            "SpaceX",
            "Amie",
            "Notion",
            "ElevenLabs",
            "Clerk",
            "Whop",
            "Supabase",
          ]}
        />
      </CollapsibleSection>
    </div>
  )
}

