import { motion } from 'framer-motion';
import { Heart, Star, Shield, Zap } from 'lucide-react';
import { TrustPillar } from '../components/TrustPillar';

export function TrustSection() {
  const pillars = [
    { icon: Heart, label: 'No Punishment' },
    { icon: Star, label: 'No Scoring Pressure' },
    { icon: Shield, label: 'Safe Environment' },
    { icon: Zap, label: 'Learn at Your Own Pace' },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-8 sm:p-12 max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-mint-300/10 text-mint-300 text-sm font-medium border border-mint-300/20">
                Safe Space
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-2xl sm:text-3xl text-white mb-4"
            >
              A Safe Space to{' '}
              <span className="text-mint-300">Learn & Grow</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 max-w-xl mx-auto"
            >
              We believe learning happens best when kids feel safe, supported, and free to make mistakes.
            </motion.p>
          </div>
          
          {/* Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pillars.map((pillar, index) => (
              <TrustPillar
                key={pillar.label}
                icon={pillar.icon}
                label={pillar.label}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
