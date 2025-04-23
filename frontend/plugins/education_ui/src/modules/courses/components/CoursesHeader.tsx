import { IconUsers } from '@tabler/icons-react';
import { PluginHeader } from 'erxes-ui';
import { AddCourseForm } from '@/courses/add-course/AddCourseForm';

export const CoursesHeader = () => {
  return (
    <>
      <PluginHeader title="Courses" icon={IconUsers}>
        {/* <FilterDropdown filters={contactsFilters} /> */}
        <AddCourseForm />
      </PluginHeader>
      {/* <ContactsFilter /> */}
      {/* <ContactDateFilterDialog /> */}
    </>
  );
};
