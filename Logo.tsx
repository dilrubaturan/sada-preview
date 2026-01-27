import { motion } from 'framer-motion'

export function Logo({ size = 40, showRipple = true }: { size?: number; showRipple?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="8" fill="currentColor" className="text-primary" />
        
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
          opacity="0.6"
        />
        
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-primary"
          opacity="0.4"
        />
        
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary"
          opacity="0.2"
        />
      </svg>
      
      {showRipple && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5
            }}
          />
        </>
      )}
    </div>
  )
}
