import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface TrustPillarProps {
  icon: LucideIcon;
  label: string;
  delay?: number;
}

export function TrustPillar({ icon: Icon, label, delay = 0 }: TrustPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col items-center gap-3 p-4"
    >
      <motion.div
        whileHover={{ scale: 1.1, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="w-12 h-12 rounded-xl bg-space-700/50 flex items-center justify-center border border-mint-300/20"
      >
        <Icon className="w-5 h-5 text-mint-300" />
      </motion.div>
      <span className="text-white font-medium text-sm text-center">{label}</span>
    </motion.div>
  );
}
