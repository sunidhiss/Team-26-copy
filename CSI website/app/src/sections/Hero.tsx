import { motion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import { CharacterBubble } from '../components/CharacterBubble';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-8 max-w-lg mx-auto lg:mx-0"
          >
            {/* Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Your AI English{' '}
              <span className="text-mint-300">Buddy</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-400 mb-6">
              Practice reading, speaking, and silly stories—no stress, just fun.
            </p>
            
            {/* Chat messages */}
            <div className="space-y-3 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-space-700/50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]"
              >
                <p className="text-white text-sm">
                  Hi! I'm Orbit. Ready to learn today?
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="bg-mint-300/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[60%] ml-auto border border-mint-300/30"
              >
                <p className="text-mint-300 text-sm">Yes! Let's go!</p>
              </motion.div>
            </div>
            
            {/* Input field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              className="flex items-center gap-3"
            >
              <button className="w-10 h-10 rounded-full bg-space-700 flex items-center justify-center text-mint-300 hover:bg-space-600 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="w-full bg-space-700/50 border border-mint-300/20 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-mint-300/50 transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-mint-300 flex items-center justify-center text-space-900 hover:shadow-glow-sm transition-shadow"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Right: Character Bubbles */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="flex items-end gap-4 sm:gap-6">
              {/* Bunny - Left */}
              <div className="mb-8">
                <CharacterBubble
                  image="/images/bunny.png"
                  name="Bunny"
                  size="md"
                  delay={0}
                  floatDuration={4}
                />
              </div>
              
              {/* Robot - Center (larger) */}
              <div>
                <CharacterBubble
                  image="/images/robot.png"
                  name="Robot"
                  size="lg"
                  delay={0.15}
                  floatDuration={5}
                />
              </div>
              
              {/* Alien - Right */}
              <div className="mb-8">
                <CharacterBubble
                  image="/images/alien.png"
                  name="Alien"
                  size="md"
                  delay={0.3}
                  floatDuration={4.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
