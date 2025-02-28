import React from 'react';
import { Typography, Box } from '@mui/material';
import { blogArticles } from '../../data/blogArticles';
import BlogArticle from '../BlogArticle';

const EscapadesRomantiques: React.FC = () => {
  const article = blogArticles.find(a => a.id === 4);
  
  if (!article) return null;
  
  const content = (
    <>
      <Typography variant="body1" paragraph>
        Envie de raviver la flamme ou simplement de partager un moment privilégié avec votre moitié ? 
        Lyon et ses environs regorgent de lieux et d'activités propices aux escapades romantiques. 
        Voici notre sélection d'idées pour créer des souvenirs à deux inoubliables.
      </Typography>
      
      <Typography variant="h2">Balade nocturne dans le Vieux Lyon illuminé</Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1603796846097-bee99e4a601f?q=80&w=1200" alt="Vieux Lyon illuminé" />
      
      <Typography variant="body1" paragraph>
        Quand la nuit tombe, le Vieux Lyon se pare de lumières qui mettent en valeur ses façades Renaissance 
        et ses traboules mystérieuses. Une promenade main dans la main dans ces ruelles pavées offre une 
        atmosphère particulièrement romantique.
      </Typography>
      
      {/* Contenu complet de l'article... */}
      
      <Typography variant="h2">Conclusion</Typography>
      
      <Typography variant="body1" paragraph>
        Lyon offre un cadre idéal pour les couples en quête de moments complices et mémorables. 
        Que vous soyez adeptes d'expériences gastronomiques, culturelles, bien-être ou nature, 
        la région regorge d'opportunités pour créer des souvenirs à deux.
      </Typography>
      
      <Typography variant="body1" paragraph>
        N'oubliez pas que le plus important n'est pas tant la destination que le fait de partager 
        ces moments ensemble, loin du quotidien et des distractions habituelles.
      </Typography>
    </>
  );
  
  return <BlogArticle article={article} content={content} blogArticles={blogArticles} />;
};

export default EscapadesRomantiques; 