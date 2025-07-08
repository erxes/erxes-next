import { Logo } from '@/auth/components/Logo';
import { Polygons } from './Polygons';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}
export const AuthenticationLayout = ({
  children,
}: AuthenticationLayoutProps) => {
  return (
    <div className="relative overflow-hidden lg:w-1/2 lg:flex-none flex-1 flex flex-col py-16 sm:px-6 xl:px-24 h-screen bg-[radial-gradient(#F0F1FE,#F7F8FA)]">
      <Polygons variant="light" />
      <div className="px-4 sm:mx-auto w-full sm:max-w-md z-30 py-4">
        <Logo className="h-10 mx-auto text-primary" />
        {children}
      </div>
      <p className="mt-auto mx-auto text-center text-muted-foreground inset-x-0 cursor-default z-30 pt-6">
        © 2024 erxes
      </p>
    </div>
  );
};
