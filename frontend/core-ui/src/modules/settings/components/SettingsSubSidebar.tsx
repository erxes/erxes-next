import { motion } from 'framer-motion';

export function SettingsSubSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex h-full w-full flex-col"
    ></motion.div>
  );
}
