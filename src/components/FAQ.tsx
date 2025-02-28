import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ExpandMore } from '@mui/icons-material';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Peut-on modifier un itinéraire après la réservation ?',
    answer: 'Oui, vous pouvez modifier votre réservation jusqu\'à 48h avant le début de votre expérience. Contactez notre service client pour toute modification.'
  },
  {
    question: 'Y a-t-il des options végétariennes pour les restaurants ?',
    answer: 'Absolument ! Tous nos partenaires restaurants proposent des options végétariennes. Précisez vos préférences alimentaires lors de la réservation.'
  },
  {
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires. Le paiement est 100% sécurisé.'
  },
  {
    question: 'Que se passe-t-il en cas de mauvais temps ?',
    answer: 'Pour les activités en extérieur, nous proposons systématiquement une alternative en intérieur ou un report sans frais.'
  }
];

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      component="section"
      id="faq"
      sx={{
        py: { xs: 8, md: 12 },
        background: '#10192c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Favicon E en arrière-plan - style néon - position ajustée pour être entièrement visible */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '-10%', // Positionnement depuis la droite au lieu de la gauche
          transform: 'translateY(-50%)', // Simplifié pour un meilleur contrôle
          zIndex: 0,
          opacity: 1,
          mixBlendMode: 'lighten',
        }}
      >
        <Box
          component="img"
          src="/images/FAVICON E.png"
          alt="Veever Favicon E"
          sx={{
            width: { xs: '500px', md: '800px', lg: '1000px' }, // Légèrement réduit pour s'assurer qu'il s'affiche entièrement
            height: 'auto',
            filter: 'drop-shadow(0 0 15px rgba(247, 74, 161, 0.7))',
            transform: 'rotate(200deg)', // Rotation à 200 degrés
            maxWidth: '80vw', // Réduit pour éviter les débordements
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Questions fréquentes
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '800px', mx: 'auto', position: 'relative', zIndex: 1 }}
          >
            Tout ce que vous devez savoir sur Veever
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Accordion
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    sx={{
                      mb: 2,
                      background: 'rgba(30, 41, 59, 0.7)',
                      backdropFilter: 'blur(12px)',
                      border: '2px solid rgba(255, 214, 198, 0.3)',
                      borderRadius: '16px !important',
                      overflow: 'hidden',
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: '0 0 16px 0',
                        boxShadow: '0 8px 16px rgba(255, 214, 198, 0.2)',
                        border: '2px solid rgba(255, 214, 198, 0.5)',
                      },
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: '#F74AA1' }} />}
                      sx={{
                        borderRadius: '16px',
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
                        },
                      }}
                    >
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontWeight: 'bold',
                          color: expanded === `panel${index}` ? '#F74AA1' : 'white',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="#CBD5E1">
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FAQ; 