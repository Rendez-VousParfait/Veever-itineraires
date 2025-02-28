import React from 'react';
import { Typography, Box } from '@mui/material';
import { blogArticles } from '../../data/blogArticles';
import BlogArticle from '../BlogArticle';

const GuideSpa: React.FC = () => {
  const article = blogArticles.find(a => a.id === 3);
  
  if (!article) return null;
  
  const content = (
    <>
      <Typography variant="body1" paragraph>
        Dans notre quotidien effréné, prendre soin de soi est devenu une nécessité plutôt qu'un luxe. 
        Lyon, ville dynamique par excellence, regorge d'havres de paix où vous pourrez vous ressourcer 
        et vous offrir une parenthèse bien-être. Découvrez notre guide des meilleurs spas et centres 
        de bien-être de la région lyonnaise.
      </Typography>
      
      <Typography variant="h2">Les bains romains contemporains</Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1531112998834-e6e4e7e79761?q=80&w=1200" alt="Bains romains" />
      
      <Typography variant="body1" paragraph>
        Inspiré des thermes antiques, ce spa urbain propose un parcours aquatique complet avec bains 
        chauds, froids, hammam et sauna. L'architecture du lieu, mêlant pierre, mosaïques et lumières 
        tamisées, vous transporte instantanément dans l'univers des bains romains.
      </Typography>
      
      {/* Contenu complet de l'article... */}
      
      <Typography variant="h2">Conclusion</Typography>
      
      <Typography variant="body1" paragraph>
        Lyon et ses environs offrent une diversité remarquable d'espaces dédiés au bien-être, adaptés 
        à tous les goûts et budgets. Que vous préfériez une approche traditionnelle, luxueuse, holistique 
        ou naturelle, vous trouverez forcément un établissement qui répondra à vos attentes.
      </Typography>
      
      <Typography variant="body1" paragraph>
        N'oubliez pas que prendre soin de soi n'est pas un luxe mais une nécessité pour maintenir 
        un équilibre physique et mental. Alors, offrez-vous régulièrement ces parenthèses de bien-être 
        pour recharger vos batteries.
      </Typography>
    </>
  );
  
  return <BlogArticle article={article} content={content} blogArticles={blogArticles} />;
};

export default GuideSpa; 