export interface Partner {
  id: string;
  type: 'hotel' | 'restaurant' | 'activity';
  name: string;
  description: string;
  address: string;
  price: string;
  images: string[];
  equipments?: string[];
  menu?: string[];
  schedule?: string;
  targetAudience: ('couples' | 'groups')[];
  reviews: {
    author: string;
    rating: number;
    comment: string;
  }[];
  duration?: string;
  level?: string;
} 