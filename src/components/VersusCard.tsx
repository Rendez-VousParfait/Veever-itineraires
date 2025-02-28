import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface VersusOption {
  value: string;
  label: string;
  icon: string;
  description?: string;
}

interface VersusCardProps {
  option1: VersusOption;
  option2: VersusOption;
  selectedValue: string;
  onChange: (value: string) => void;
}

const VersusCard: React.FC<VersusCardProps> = ({
  option1,
  option2,
  selectedValue,
  onChange,
}) => {
  const theme = useTheme();

  const CardOption = ({ option, isSelected }: { option: VersusOption; isSelected: boolean }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ flex: 1, cursor: 'pointer' }}
    >
      <Card
        onClick={() => onChange(option.value)}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: isSelected
            ? 'linear-gradient(45deg, rgba(245, 158, 63, 0.15), rgba(247, 74, 161, 0.15))'
            : 'rgba(30, 41, 59, 0.7)',
          border: isSelected ? '2px solid #F59E3F' : '1px solid rgba(99, 102, 241, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isSelected
              ? 'linear-gradient(45deg, rgba(245, 158, 63, 0.2), rgba(247, 74, 161, 0.2))'
              : 'rgba(30, 41, 59, 0.8)',
            borderColor: '#F59E3F',
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: '3rem',
            mb: 2,
          }}
        >
          {option.icon}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: isSelected ? '#F59E3F' : 'inherit',
            background: isSelected ? 'linear-gradient(45deg, #F59E3F, #F74AA1)' : 'none',
            WebkitBackgroundClip: isSelected ? 'text' : 'none',
            WebkitTextFillColor: isSelected ? 'transparent' : 'inherit',
          }}
        >
          {option.label}
        </Typography>
        {option.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {option.description}
          </Typography>
        )}
      </Card>
    </motion.div>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        position: 'relative',
        width: '100%',
        mb: 4,
      }}
    >
      <CardOption
        option={option1}
        isSelected={selectedValue === option1.value}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          VS
        </Typography>
      </Box>
      <CardOption
        option={option2}
        isSelected={selectedValue === option2.value}
      />
    </Box>
  );
};

export default VersusCard; 