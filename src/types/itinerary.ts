interface Step {
  name: string;
  description: string;
  icon: React.ReactNode;
  details?: {
    title: string;
    description: string;
    image?: string;
    address?: string;
    price?: string;
  };
} 