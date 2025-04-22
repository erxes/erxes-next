import { Logo } from '@/auth/components/Logo';
import { Polygons } from './Polygons';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}
export const AuthenticationLayout = ({
  children,
}: AuthenticationLayoutProps) => {
  return (
    <div className="relative overflow-hidden lg:w-1/2 lg:flex-none flex-1 flex flex-col py-12 sm:px-6 lg:px-20 xl:px-24 h-screen bg-[radial-gradient(#F0F1FE,#F7F8FA)]">
      <Polygons variant="light" />
      <div className="px-4 sm:mx-auto w-full sm:max-w-sm lg:w-96 my-auto z-30">
        <Logo className="h-10 mx-auto" />
      {children}
      </div>
      <p className="absolute bottom-4 mx-auto text-center text-muted-foreground inset-x-0 cursor-default z-30">
        © 2024 erxes
      </p>
    </div>
  );
};
