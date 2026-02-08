import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="glass-card p-8 transition-all duration-300 hover:border-mint-300/40 hover:shadow-card"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-mint-300/10 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-mint-300" />
      </div>
      
      {/* Title */}
      <h3 className="font-display font-semibold text-xl text-white mb-3">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
