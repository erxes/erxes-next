import {
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconUsers,
  IconSettings,
  IconMailFilled,
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconArrowRight,
} from '@tabler/icons-react';
import { WelcomeMessageBackground } from './WelcomeMessageBackground';
import { currentUserState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { Button, cn } from 'erxes-ui';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

type SocialItem = {
  icon: React.ReactNode;
  url: string;
};
type OnboardingStepItem = {
  icon: React.ReactNode;
  title: string;
  forOwner?: boolean;
  description: string;
  action: {
    label: string;
    to: string;
  };
};

const Socials: SocialItem[] = [
  {
    icon: <IconMailFilled className="size-5" />,
    url: 'https://www.instagram.com/erxes/',
  },
  {
    icon: <IconBrandInstagramFilled className="size-5" />,
    url: 'https://www.instagram.com/erxes/',
  },
  {
    icon: <IconBrandLinkedinFilled className="size-5" />,
    url: 'https://www.linkedin.com/company/erxes/',
  },
  {
    icon: <IconBrandGithubFilled className="size-5" />,
    url: 'https://github.com/erxes',
  },
  {
    icon: <IconBrandDiscordFilled className="size-5" />,
    url: 'https://discord.gg/erxes',
  },
];

const OnboardingSteps: OnboardingStepItem[] = [
  {
    icon: <IconUsers className="size-5" />,
    title: 'Invite Your Team',
    description:
      'Collaborate better by inviting team members to join your workspace and start working together.',
    action: {
      label: 'Invite Team Member',
      to: '/settings/team-member',
    },
  },
  {
    icon: <IconSettings className="size-5" />,
    title: 'Customize Your Workspace',
    forOwner: true,
    description:
      'Tailor your workspace to your preferences with customizable settings.',
    action: {
      label: 'Customize Workspace',
      to: '/settings/workspace',
    },
  },
  {
    icon: <IconSettings className="size-5" />,
    title: 'Customize Your Workspace',
    forOwner: true,
    description:
      'Tailor your workspace to your preferences with customizable settings.',
    action: {
      label: 'Customize Workspace',
      to: '/settings/workspace',
    },
  },
];

const SocialSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.0 }}
  >
    <h3 className="text-base font-medium text-muted-foreground text-center mb-4">
      Contact Us:
    </h3>
    <div className="flex flex-wrap justify-center gap-2">
      {Socials.map((item) => {
        return (
          <Link to={item.url}>
            <div className="bg-muted text-muted-foreground  rounded-sm p-[6px]">
              {item.icon}
            </div>
          </Link>
        );
      })}
    </div>
  </motion.div>
);

const OnboardingStepsSection = ({ isOwner }: { isOwner: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className=" max-w-3xl w-full items-center mx-auto"
    >
      <h2 className="text-xl font-semibold text-center mb-6">Get Started</h2>
      <div className="p-2 rounded-3xl flex flex-col sm:flex-row lg:grid lg:grid-cols-2 border bg-muted gap-2">
        {OnboardingSteps.map((item, index) => {
          if (item.forOwner && !isOwner) {
            return null;
          }
          return (
            <div
              className={cn(
                'border rounded-2xl p-3 flex flex-col gap-3 bg-background flex-1 min-w-0',
                index === 2 &&
                  OnboardingSteps.length === 3 &&
                  'lg:col-span-2 col-span-2 sm:col-span-1',
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="p-[10px] rounded-md text-primary bg-primary/10 w-min">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-primary text-lg break-words">
                  {item.title}
                </h3>
                <p className="text-base text-muted-foreground break-words">
                  {item.description}
                </p>
              </div>
              <Button asChild size="sm" variant="ghost" className="self-start">
                <Link to={item.action.to} className="hover:bg-background">
                  <span className="text-primary font-semibold text-base flex items-center gap-1 break-words">
                    <span className="truncate">{item.action.label}</span>
                    <IconArrowRight className="size-4 flex-shrink-0" />
                  </span>
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const LazyVideo = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video border border-foreground/10  overflow-hidden bg-foreground/10 p-3 rounded-[20px]"
    >
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}  
          <video
            src={src}
            controls
            className={`w-full h-full object-cover transition-opacity duration-300 bg-background rounded-md border border-foreground/10 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => setIsLoaded(true)}
            preload="metadata"
          />
        </>
      )}
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Video will load when visible
        </div>
      )}
    </div>
  );
};

export const WelcomeMessageNotificationContent = () => {
  const currentUser = useAtomValue(currentUserState);
  return (
    <div className="container px-4 sm:px-8 md:px-20 py-12 lg:px-4 xl:px-12 relative">
      <WelcomeMessageBackground className="absolute inset-0 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl min-w-0 mx-auto space-y-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to erxes
          </h1>
          <p className="text-base text-muted-foreground">
            A New Experience Begins!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the power of unified customer experience management. Get
            started with our comprehensive platform designed to streamline your
            business operations and enhance customer relationships.
          </p>
        </motion.div>

        <div className="space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <LazyVideo src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
          </motion.div>
          <OnboardingStepsSection isOwner={currentUser?.isOwner || false} />
          <SocialSection />
        </div>
      </motion.div>
    </div>
  );
};
