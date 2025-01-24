import { mailConfigHeader } from "@/settings/mail-config/constants/header"
import SettingsHeader from "@/settings/components/SettingsHeader"
import { ScrollArea } from "erxes-ui/components"
import MailServiceForm from "@/settings/mail-config/components/MailServiceForm"

export const MailConfigPage = () => {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <SettingsHeader breadcrumbs={mailConfigHeader} />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Mail config</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <MailServiceForm />
        </div>
        <div>
        </div>
      </section>
    </ScrollArea.Root>
  )
}