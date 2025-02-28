import React from 'react';
import { Typography, Box } from '@mui/material';
import { blogArticles } from '../../data/blogArticles';
import BlogArticle from '../BlogArticle';

const TopInsolite: React.FC = () => {
  const article = blogArticles.find(a => a.id === 1);
  
  if (!article) return null;
  
  const content = (
    <>
      <Typography variant="body1" paragraph>
        Lyon regorge de trésors cachés et d'expériences inattendues qui sortent des sentiers battus. 
        Si vous cherchez à pimenter votre week-end avec des activités originales, voici notre sélection 
        des 5 expériences les plus insolites à découvrir dans la capitale des Gaules.
      </Typography>
      
      <Typography variant="h2">1. Exploration urbaine souterraine des "arêtes de poisson"</Typography>
      
      <Typography variant="body1" paragraph>
        Saviez-vous que Lyon cache sous ses rues un réseau mystérieux de galeries souterraines ? 
        Les "arêtes de poisson" constituent un labyrinthe souterrain datant de la Renaissance, 
        dont la fonction exacte reste encore mystérieuse aujourd'hui.
      </Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1504376379689-8d54347b26c6?q=80&w=1200" alt="Galeries souterraines" />
      
      <Typography variant="body1" paragraph>
        Accompagné d'un guide spécialisé, vous pourrez explorer ces passages secrets, 
        découvrir les théories sur leur origine et ressentir l'atmosphère unique de ce lieu chargé d'histoire. 
        Une expérience qui vous plonge littéralement dans les entrailles de la ville !
      </Typography>
      
      <div className="highlight-box">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#F59E3F' }}>
          Conseil Veever
        </Typography>
        <Typography variant="body2">
          Prévoyez des vêtements que vous n'avez pas peur de salir et des chaussures robustes. 
          La température y est constante (environ 14°C), pensez donc à emporter une petite laine même en été.
        </Typography>
      </div>
      
      <Typography variant="h2">2. Dîner dans le noir complet</Typography>
      
      <Typography variant="body1" paragraph>
        Imaginez déguster un repas gastronomique dans l'obscurité totale, guidé uniquement par vos sens du goût, 
        de l'odorat et du toucher. C'est l'expérience unique que propose le concept "Dans le Noir" à Lyon.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Servis par des guides malvoyants, vous vivrez une expérience sensorielle incomparable qui bouleverse 
        les perceptions habituelles et intensifie les saveurs. Un moment convivial qui change radicalement 
        notre rapport à la nourriture et aux autres.
      </Typography>
      
      <Typography variant="h2">3. Escape game dans un véritable bunker de la Seconde Guerre mondiale</Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1200" alt="Bunker" />
      
      <Typography variant="body1" paragraph>
        Pour les amateurs de sensations fortes et d'histoire, cet escape game se déroule dans un authentique 
        bunker datant de la Seconde Guerre mondiale. L'immersion est totale : vous devrez résoudre des énigmes 
        inspirées de faits historiques réels dans un décor d'époque parfaitement conservé.
      </Typography>
      
      <Typography variant="body1" paragraph>
        L'atmosphère unique du lieu, combinée à des énigmes ingénieuses et une narration captivante, 
        en fait une expérience inoubliable, bien différente des escape games classiques.
      </Typography>
      
      <Typography variant="h2">4. Balade en gyropode sur les berges du Rhône</Typography>
      
      <Typography variant="body1" paragraph>
        Redécouvrez Lyon sous un angle nouveau en parcourant les berges du Rhône en gyropode Segway. 
        Cette balade originale vous permet d'explorer facilement les 5 km de berges aménagées, 
        du parc de la Tête d'Or jusqu'au confluent.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Après une courte formation pour maîtriser l'engin, vous glisserez silencieusement le long du fleuve, 
        découvrant des points de vue imprenables sur la ville. Une façon ludique et écologique de visiter Lyon !
      </Typography>
      
      <div className="highlight-box">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#F59E3F' }}>
          Bon à savoir
        </Typography>
        <Typography variant="body2">
          Aucune expérience préalable n'est nécessaire, et l'activité est accessible dès 12 ans. 
          Les balades sont proposées de jour comme de nuit (version illuminations).
        </Typography>
      </div>
      
      <Typography variant="h2">5. Atelier de soufflage de verre dans un ancien atelier de canuts</Typography>
      
      <Box component="img" src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1200" alt="Soufflage de verre" />
      
      <Typography variant="body1" paragraph>
        Dans le quartier historique de la Croix-Rousse, un maître verrier vous initie à l'art ancestral 
        du soufflage de verre dans un authentique atelier de canuts réaménagé. Vous apprendrez les techniques 
        de base et repartirez avec votre propre création.
      </Typography>
      
      <Typography variant="body1" paragraph>
        La magie opère lorsque vous voyez le verre en fusion se transformer sous vos yeux en une pièce unique. 
        Une expérience créative fascinante qui vous connecte avec le riche passé artisanal de Lyon.
      </Typography>
      
      <Typography variant="h2">Conclusion</Typography>
      
      <Typography variant="body1" paragraph>
        Lyon ne se résume pas à ses traboules et sa gastronomie. La ville offre une multitude d'expériences 
        insolites qui permettent de la découvrir sous un jour nouveau. Ces activités originales sont parfaites 
        pour sortir de votre zone de confort, créer des souvenirs mémorables et impressionner vos amis avec 
        des anecdotes peu communes.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Alors, laquelle de ces expériences vous tente le plus pour votre prochain week-end lyonnais ?
      </Typography>
      
      <blockquote>
        "Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, 
        mais à avoir de nouveaux yeux." - Marcel Proust
      </blockquote>
    </>
  );
  
  return <BlogArticle article={article} content={content} blogArticles={blogArticles} />;
};

export default TopInsolite; 