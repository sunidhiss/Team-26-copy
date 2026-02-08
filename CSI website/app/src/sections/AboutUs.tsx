import { motion } from 'framer-motion';
import { MessageCircle, Volume2, Sparkles } from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';

export function AboutUs() {
  const features = [
    {
      icon: MessageCircle,
      title: 'Interactive Chat',
      description: 'Have real conversations with our friendly AI characters who respond with patience and encouragement.',
    },
    {
      icon: Volume2,
      title: 'Speak & Listen',
      description: 'Practice pronunciation by speaking to your AI buddy and hearing natural responses.',
    },
    {
      icon: Sparkles,
      title: 'Fun Stories',
      description: 'Learn through engaging stories, games, and activities designed to make English learning enjoyable.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28">
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
              About Us
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-3xl sm:text-4xl text-white mt-6 mb-4"
          >
            Learn English with{' '}
            <span className="text-mint-300">3D Friends</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          >
            We're a magical website where students can interact with friendly 3D chatbots to learn English in a fun, stress-free environment.
          </motion.p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
