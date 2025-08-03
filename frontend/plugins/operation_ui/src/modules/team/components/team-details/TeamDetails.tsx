import { useGetTeam } from '@/team/hooks/useGetTeam';
import { MemberSection } from '@/team/components/team-details/MemberSection';
import { UpdateTeamForm } from '@/team/components/team-details/UpdateTeamForm';
import { EstimateSection } from '@/team/components/team-details/EstimateSection';
import { StatusSection } from '@/team/components/team-details/SatusSection';
import { CycleSection } from '@/team/components/team-details/CycleSection';

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
      <MemberSection team={team} />
      <EstimateSection team={team} />
      <StatusSection team={team} />
      <CycleSection />
    </div>
  );
};
