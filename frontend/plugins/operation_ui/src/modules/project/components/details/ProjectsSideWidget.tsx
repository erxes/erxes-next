import { IconCaretRightFilled, IconChartHistogram } from '@tabler/icons-react';
import { Button, SideMenu, Collapsible } from 'erxes-ui';
import { ProgressChart } from '@/project/components/details/ProgressChart';
import { Progress } from '@/project/components/details/Progress';
import { ProgressByMember } from '@/project/components/details/ProgressByMember';
import { ProgressByTeam } from '@/project/components/details/ProgressByTeam';
export const ProjectsSideWidget = ({ projectId }: { projectId: string }) => {
  return (
    <SideMenu defaultValue="project">
      <SideMenu.Content value="project">
        <SideMenu.Header Icon={IconChartHistogram} label="Project Report" />
        <>
          <div className="p-4 border-b">
            <Collapsible className="group/collapsible-menu" defaultOpen>
              <Collapsible.Trigger asChild>
                <Button
                  variant="secondary"
                  className="w-min text-accent-foreground justify-start text-left"
                  size="sm"
                >
                  <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
                  Progress
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Progress projectId={projectId} />
                <ProgressChart projectId={projectId} />
              </Collapsible.Content>
            </Collapsible>
          </div>
          <ProgressByMember projectId={projectId} />
          <ProgressByTeam projectId={projectId} />
        </>
      </SideMenu.Content>
      <SideMenu.Sidebar>
        <SideMenu.Trigger
          value="project"
          label="Project Report"
          Icon={IconChartHistogram}
        />
      </SideMenu.Sidebar>
    </SideMenu>
  );
};
