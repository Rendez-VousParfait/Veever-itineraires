import React from 'react';
import { Box, Card, Typography, IconButton } from '@mui/material';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

interface SwipeOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
  image?: string;
}

interface SwipeCardProps {
  options: SwipeOption[];
  onSwipe: (id: string, direction: 'left' | 'right') => void;
  onComplete: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ options, onSwipe, onComplete }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const background = useTransform(
    x,
    [-200, 0, 200],
    [
      'linear-gradient(45deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
      'none',
      'linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))',
    ]
  );

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      await controls.start({ x: 200, opacity: 0 });
      handleSwipe('right');
    } else if (offset < -100 || velocity < -500) {
      await controls.start({ x: -200, opacity: 0 });
      handleSwipe('left');
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < options.length) {
      onSwipe(options[currentIndex].id, direction);
      if (currentIndex === options.length - 1) {
        onComplete();
      } else {
        setCurrentIndex(currentIndex + 1);
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
      }
    }
  };

  const currentOption = options[currentIndex];
  if (!currentOption) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        height: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          x,
          rotate,
          opacity,
          background,
          width: '100%',
          position: 'absolute',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <Card
          sx={{
            height: 400,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
          }}
        >
          {currentOption.image && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                backgroundImage: `url(${currentOption.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2, textAlign: 'center' }}>
              {currentOption.icon}
            </Typography>
            <Typography variant="h6" gutterBottom align="center">
              {currentOption.label}
            </Typography>
            {currentOption.description && (
              <Typography variant="body2" color="text.secondary" align="center">
                {currentOption.description}
              </Typography>
            )}
          </Box>
        </Card>
      </motion.div>

      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <IconButton
          onClick={() => handleSwipe('left')}
          sx={{
            background: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid #f44336',
            '&:hover': {
              background: 'rgba(244, 67, 54, 0.2)',
            },
          }}
        >
          <CloseIcon sx={{ color: '#f44336', fontSize: '2rem' }} />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe('right')}
          sx={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid #4caf50',
            '&:hover': {
              background: 'rgba(76, 175, 80, 0.2)',
            },
          }}
        >
          <FavoriteIcon sx={{ color: '#4caf50', fontSize: '2rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SwipeCard; 