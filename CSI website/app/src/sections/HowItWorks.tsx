import { motion } from 'framer-motion';
import { Smile, MessageSquare, Zap } from 'lucide-react';
import { StepCard } from '../components/StepCard';

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Smile,
      title: 'Pick a Friend',
      description: 'Choose a character that makes you smile. Each buddy has a unique personality!',
    },
    {
      number: 2,
      icon: MessageSquare,
      title: 'Chat & Play',
      description: 'Read, type, and speak in fun mini-conversations. No pressure, just practice!',
    },
    {
      number: 3,
      icon: Zap,
      title: 'Learn at Your Pace',
      description: 'No scores, no stress—just gentle practice that adapts to your level.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-mint-300/10 text-mint-300 text-sm font-medium border border-mint-300/20">
              How It Works
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-3xl sm:text-4xl text-white mt-6 mb-4"
          >
            Three Simple Steps
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Start practicing English every day with our easy-to-follow learning journey.
          </motion.p>
        </div>
        
        {/* Step Cards */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
            />
          ))}
          
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-mint-300/30 to-transparent -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
