import { Resizable } from 'erxes-ui';
import { CourseDetailSheet } from './CourseDetailSheet';

export const CourseDetailLayout = ({
  actions,
}: {
  actions?: React.ReactNode;
}) => {
  return (
    <CourseDetailSheet>
      <div className="flex h-full flex-auto overflow-auto">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            {actions}
          </Resizable.PanelGroup>
        </div>
      </div>
    </CourseDetailSheet>
  );
};
