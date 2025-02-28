import React from 'react';
import { Typography, Box } from '@mui/material';
import { blogArticles } from '../../data/blogArticles';
import BlogArticle from '../BlogArticle';

const MeilleursRooftops: React.FC = () => {
  const article = blogArticles.find(a => a.id === 2);
  
  if (!article) return null;
  
  const content = (
    <>
      <Typography variant="body1" paragraph>
        Quoi de mieux qu'un verre en hauteur avec une vue panoramique sur la ville pour profiter 
        d'une soirée entre amis ? Lyon, avec son architecture remarquable et ses deux fleuves, 
        offre des perspectives à couper le souffle depuis ses toits. Voici notre sélection des 
        meilleurs rooftops lyonnais pour un apéro mémorable.
      </Typography>
      
      <Typography variant="h2">Le Rooftop de l'Hôtel Radisson Blu</Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1595470806946-c8b1d89652ab?q=80&w=1200" alt="Rooftop Radisson Blu" />
      
      <Typography variant="body1" paragraph>
        Situé au 8ème étage de l'hôtel Radisson Blu, ce rooftop offre une vue à 360° sur Lyon et ses alentours. 
        Avec la Part-Dieu d'un côté et le Vieux Lyon de l'autre, c'est l'endroit idéal pour admirer le coucher 
        de soleil sur la ville.
      </Typography>
      
      <Typography variant="body1" paragraph>
        La carte des cocktails est créative et élaborée, avec des créations originales aux saveurs locales. 
        L'ambiance y est chic mais décontractée, avec des DJ sets les vendredis et samedis soirs qui animent 
        l'espace sans être envahissants.
      </Typography>
      
      <div className="highlight-box">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#F59E3F' }}>
          Conseil Veever
        </Typography>
        <Typography variant="body2">
          Réservez votre table à l'avance, surtout le week-end. Pour profiter pleinement de la vue, 
          arrivez environ une heure avant le coucher du soleil.
        </Typography>
      </div>
      
      <Typography variant="h2">Le Sucre</Typography>
      
      <Typography variant="body1" paragraph>
        Perché sur le toit de la Sucrière dans le quartier de Confluence, Le Sucre est devenu un 
        incontournable de la vie nocturne lyonnaise. Ce lieu culturel hybride propose une terrasse 
        spacieuse avec vue sur la Saône et les nouveaux quartiers de Confluence.
      </Typography>
      
      <Typography variant="body1" paragraph>
        L'ambiance y est plus décontractée et alternative, avec une programmation musicale pointue. 
        C'est l'endroit parfait pour les amateurs de musique électronique qui souhaitent profiter 
        d'un cadre unique.
      </Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200" alt="Le Sucre" />
      
      <Typography variant="h2">Le Rooftop de l'Hôtel Intercontinental</Typography>
      
      <Typography variant="body1" paragraph>
        Pour une expérience plus luxueuse, le rooftop de l'Hôtel Intercontinental, situé en plein cœur 
        de la presqu'île, offre une vue imprenable sur la place Bellecour et le Vieux Lyon. 
        L'établissement, installé dans un ancien hôpital du XVIIIe siècle, ajoute une touche historique 
        à votre expérience.
      </Typography>
      
      <Typography variant="body1" paragraph>
        La carte des vins est exceptionnelle, avec une belle sélection de champagnes et de vins locaux. 
        Les planches de charcuterie et de fromages sont parfaites pour accompagner votre dégustation.
      </Typography>
      
      <Typography variant="h2">Mama Shelter</Typography>
      
      <Typography variant="body1" paragraph>
        Le rooftop du Mama Shelter, dans le 7ème arrondissement, est l'un des plus animés de la ville. 
        Avec son ambiance festive et décontractée, c'est l'endroit idéal pour commencer votre soirée.
      </Typography>
      
      <Typography variant="body1" paragraph>
        La décoration colorée et les nombreux jeux disponibles (baby-foot, ping-pong) en font un lieu 
        convivial où il fait bon passer du temps entre amis. La carte propose des cocktails originaux 
        et une cuisine de partage savoureuse.
      </Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200" alt="Mama Shelter" />
      
      <div className="highlight-box">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#F59E3F' }}>
          Bon à savoir
        </Typography>
        <Typography variant="body2">
          Le rooftop du Mama Shelter est couvert et chauffé en hiver, ce qui en fait une option 
          viable toute l'année.
        </Typography>
      </div>
      
      <Typography variant="h2">La Terrasse de l'Antiquaille</Typography>
      
      <Typography variant="body1" paragraph>
        Niché sur la colline de Fourvière, ce rooftop offre l'une des plus belles vues sur Lyon. 
        Installé dans l'ancien hôpital de l'Antiquaille, ce lieu combine patrimoine historique et 
        ambiance contemporaine.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Moins connu que les autres adresses, c'est un véritable joyau caché qui mérite le détour. 
        La carte des boissons met en avant les producteurs locaux, et les tapas sont délicieux.
      </Typography>
      
      <Typography variant="h2">Conclusion</Typography>
      
      <Typography variant="body1" paragraph>
        Lyon ne manque pas d'options pour profiter d'un apéro en hauteur avec une vue exceptionnelle. 
        Que vous recherchiez une ambiance chic, festive ou décontractée, il y a forcément un rooftop 
        qui correspondra à vos attentes.
      </Typography>
      
      <Typography variant="body1" paragraph>
        N'hésitez pas à varier les plaisirs en fonction des saisons et des occasions. Chaque rooftop 
        offre une perspective unique sur la ville et une expérience différente.
      </Typography>
      
      <blockquote>
        "La vie est comme un cocktail, c'est la façon dont vous la mélangez qui fait toute la différence."
      </blockquote>
    </>
  );
  
  return <BlogArticle article={article} content={content} blogArticles={blogArticles} />;
};

export default MeilleursRooftops; 