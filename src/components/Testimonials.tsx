import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  IconButton,
  Rating,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
  rating: number;
  type: 'couple' | 'group';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marie & Thomas',
    image: '/testimonials/couple1.jpg',
    text: 'Une organisation parfaite, on a adoré chaque moment ! La surprise finale était magique.',
    rating: 5,
    type: 'couple'
  },
  {
    id: 2,
    name: 'Groupe de Julie',
    image: '/testimonials/group1.jpg',
    text: 'Super soirée entre amis, les activités étaient top et bien rythmées. On recommande !',
    rating: 5,
    type: 'group'
  },
  {
    id: 3,
    name: 'Sophie & Lucas',
    image: '/testimonials/couple2.jpg',
    text: 'Une soirée mémorable et romantique, merci Veever pour cette belle découverte.',
    rating: 4,
    type: 'couple'
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => 
        current === testimonials.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrevious = () => {
    setActiveIndex((current) => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => 
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  return (
    <Box
      component="section"
      sx={{
        py: 12,
        background: '#10192c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ils ont vécu l'expérience Veever
          </Typography>
        </motion.div>

        <Box sx={{ position: 'relative', maxWidth: 'md', mx: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 214, 198, 0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  p: 4,
                }}
              >
                <Stack spacing={4} alignItems="center">
                  <Avatar
                    src={testimonials[activeIndex].image}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid',
                      borderColor: 'primary.main',
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                    }}
                  />
                  <Rating
                    value={testimonials[activeIndex].rating}
                    readOnly
                    sx={{
                      '& .MuiRating-icon': {
                        color: '#6366f1',
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      fontSize: '1.25rem',
                      fontStyle: 'italic',
                      color: 'text.secondary',
                    }}
                  >
                    "{testimonials[activeIndex].text}"
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {testimonials[activeIndex].name}
                  </Typography>
                </Stack>
              </Card>
            </motion.div>
          </AnimatePresence>

          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: index === activeIndex ? 24 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: index === activeIndex ? 'primary.main' : 'primary.dark',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Testimonials; 