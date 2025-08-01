import { useGetTeam } from '@/team/hooks/useGetTeam';
import { UpdateTeamForm } from './UpdateTeamForm';

export const TeamDetails = () => {
  const { team, loading, refetch } = useGetTeam();
  if (loading) return null;
  if (!team) return <div>Not found</div>;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-semibold">{team.name}</h1>

      <div className="mt-4 w-full border border-muted-foreground/15 rounded-md">
        <section className="w-full p-4">
          {team && <UpdateTeamForm team={team} refetch={refetch} />}
        </section>
      </div>
    </div>
  );
};
