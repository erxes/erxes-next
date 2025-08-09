import { useGetTeam } from '@/team/hooks/useGetTeam';
import { MemberSection } from '@/team/components/team-details/MemberSection';
import { UpdateTeamForm } from '@/team/components/team-details/UpdateTeamForm';
import { EstimateSection } from '@/team/components/team-details/EstimateSection';
import { StatusSection } from '@/team/components/team-details/SatusSection';
import { CycleSection } from '@/team/components/team-details/CycleSection';
import { IconTrash } from '@tabler/icons-react';
import { Button, useToast } from 'erxes-ui';
import { useRemoveTeam } from '@/team/hooks/useRemoveTeam';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
export const TeamDetails = () => {
  const { id: teamId } = useParams();
  const { team, loading } = useGetTeam({ variables: { _id: teamId } });
  const { removeTeam } = useRemoveTeam();
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleRemoveTeam = () => {
    removeTeam({
      variables: {
        id: team?._id,
      },
      onCompleted: () => {
        navigate('/operation/team');
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to remove team',
          variant: 'destructive',
        });
      },
    });
  };

  if (loading) return null;
  if (!team) return <div>Not found</div>;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16">
      <span className="flex justify-between">
        <h1 className="text-2xl font-semibold">{team.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/20"
          onClick={handleRemoveTeam}
        >
          <IconTrash />
        </Button>
      </span>
      <div className="mt-4 w-full border border-muted-foreground/15 rounded-md">
        <section className="w-full p-4">
          {team && <UpdateTeamForm team={team} />}
        </section>
      </div>
      <MemberSection team={team} />
      <EstimateSection team={team} />
      <StatusSection team={team} />
      <CycleSection />
    </div>
  );
};
