import { motion } from 'framer-motion';

interface CharacterBubbleProps {
  image: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  floatDuration?: number;
}

export function CharacterBubble({
  image,
  name,
  size = 'md',
  delay = 0,
  floatDuration = 4,
}: CharacterBubbleProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const ringSizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.6 + delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{ scale: 1.08 }}
      className="relative flex items-center justify-center"
    >
      {/* Glow ring */}
      <motion.div
        className={`absolute ${ringSizes[size]} rounded-full border-2 border-mint-300/40`}
        style={{
          boxShadow: '0 0 30px rgba(134, 239, 172, 0.3), inset 0 0 30px rgba(134, 239, 172, 0.1)',
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Character image */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-space-700 to-space-800`}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
