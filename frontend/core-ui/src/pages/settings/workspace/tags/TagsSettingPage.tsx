import { PageContainer, PageSubHeader } from 'erxes-ui';
import { SettingsHeader } from 'ui-modules';
import { TagsSettingBreadcrumb } from '@/settings/tags/components/TagsSettingBreadcrumb';
import { TagsSidebar } from '@/settings/tags/components/TagsSidebar';
import { TagsRecordTable } from '@/settings/tags/components/TagsRecordTable';

export const TagsSettingPage = () => {
  return (
    <PageContainer title="Tags">
      <SettingsHeader breadcrumbs={<TagsSettingBreadcrumb />} />
      <div className="flex flex-auto overflow-hidden">
        <TagsSidebar />
        <div className="flex flex-col h-full overflow-hidden flex-1">
          <PageSubHeader></PageSubHeader>
          <TagsRecordTable />
        </div>
      </div>
    </PageContainer>
  );
};
