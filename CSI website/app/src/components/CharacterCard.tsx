import { motion } from 'framer-motion';

interface CharacterCardProps {
  image: string;
  name: string;
  trait: string;
  isActive?: boolean;
  buttonText: string;
  onClick?: () => void;
  delay?: number;
}

export function CharacterCard({
  image,
  name,
  trait,
  isActive = false,
  buttonText,
  onClick,
  delay = 0,
}: CharacterCardProps) {
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
      whileHover={{ y: -6 }}
      className="glass-card p-8 flex flex-col items-center transition-all duration-300 hover:border-mint-300/40 hover:shadow-card"
    >
      {/* Character image */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative w-32 h-32 mb-6"
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-mint-300/30"
          style={{
            boxShadow: '0 0 25px rgba(134, 239, 172, 0.2), inset 0 0 25px rgba(134, 239, 172, 0.05)',
          }}
        />
        <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-space-700 to-space-800">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      
      {/* Name */}
      <h3 className="font-display font-semibold text-xl text-white mb-1">
        {name}
      </h3>
      
      {/* Trait */}
      <p className="text-gray-400 text-sm mb-6">{trait}</p>
      
      {/* Button */}
      {isActive ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          className="btn-primary text-sm w-full"
        >
          {buttonText}
        </motion.button>
      ) : (
        <button
          disabled
          className="w-full py-2.5 px-4 rounded-full bg-space-700 text-gray-500 text-sm font-medium cursor-not-allowed"
        >
          {buttonText}
        </button>
      )}
    </motion.div>
  );
}
