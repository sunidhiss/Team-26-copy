import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { CharacterCard } from '../components/CharacterCard';

export function ChooseBuddy() {
  const characters = [
    {
      image: '/images/bunny.png',
      name: 'Bunny',
      trait: 'Gentle and patient',
      isActive: true,
      buttonText: 'Start Learning!',
    },
    {
      image: '/images/robot.png',
      name: 'Robot',
      trait: 'Smart and helpful',
      isActive: false,
      buttonText: 'Coming Soon',
    },
    {
      image: '/images/alien.png',
      name: 'Alien',
      trait: 'Playful and fun',
      isActive: false,
      buttonText: 'Coming Soon',
    },
  ];

  const handleBunnyClick = () => {
    // Redirect to the bunny interface (GitHub page)
    window.location.href = 'https://annika-k.github.io/ai-english-bunny/';
  };

  return (
    <section id="buddies" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display font-bold text-3xl sm:text-4xl text-white mb-4"
          >
            Choose Your{' '}
            <span className="text-mint-300">Learning Buddy</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Pick a friend to start your English learning adventure. Each character is ready to help you learn!
          </motion.p>
        </div>
        
        {/* Character Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {characters.map((character, index) => (
            <CharacterCard
              key={character.name}
              {...character}
              onClick={character.isActive ? handleBunnyClick : undefined}
              delay={index * 0.15}
            />
          ))}
        </div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBunnyClick}
            className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2 animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5" />
            Start Learning with Me!
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">No signup required to try</p>
        </motion.div>
      </div>
    </section>
  );
}
