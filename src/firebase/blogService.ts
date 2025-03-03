import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from './config';

export interface BlogArticle {
  id: string;
  titre: string;
  description: string;
  image: string;
  tags: string[];
  lien: string;
  contenu: string;
  datePublication: Date;
}

// Anciens articles à migrer
const oldArticles = [
  {
    id: '1',
    titre: "Top 5 des expériences insolites à Lyon",
    description: "Découvrez des sorties uniques pour pimenter vos week-ends ! Des activités originales qui sortent des sentiers battus pour créer des souvenirs mémorables.",
    image: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?q=80&w=1200",
    tags: ["Insolite", "Aventures"],
    lien: "/blog/top-insolite",
    contenu: `Lyon regorge de trésors cachés et d'expériences inattendues qui sortent des sentiers battus. 
    Si vous cherchez à pimenter votre week-end avec des activités originales, voici notre sélection 
    des 5 expériences les plus insolites à découvrir dans la capitale des Gaules.
    
    1. Exploration urbaine souterraine des "arêtes de poisson"
    
    Saviez-vous que Lyon cache sous ses rues un réseau mystérieux de galeries souterraines ? 
    Les "arêtes de poisson" constituent un labyrinthe souterrain datant de la Renaissance, 
    dont la fonction exacte reste encore mystérieuse aujourd'hui.
    
    Accompagné d'un guide spécialisé, vous pourrez explorer ces passages secrets, 
    découvrir les théories sur leur origine et ressentir l'atmosphère unique de ce lieu chargé d'histoire. 
    Une expérience qui vous plonge littéralement dans les entrailles de la ville !`,
    datePublication: new Date()
  },
  {
    id: '2',
    titre: "Les meilleurs rooftops pour un apéro entre amis",
    description: "Des vues imprenables et une ambiance chill pour vos soirées. Profitez des plus beaux panoramas de la ville tout en dégustant des cocktails créatifs.",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1200",
    tags: ["Food", "Sorties"],
    lien: "/blog/meilleurs-rooftops",
    contenu: `Quoi de mieux qu'un verre en hauteur avec une vue panoramique sur la ville pour profiter 
    d'une soirée entre amis ? Lyon, avec son architecture remarquable et ses deux fleuves, 
    offre des perspectives à couper le souffle depuis ses toits. Voici notre sélection des 
    meilleurs rooftops lyonnais pour un apéro mémorable.
    
    Le Rooftop de l'Hôtel Radisson Blu
    
    Situé au 8ème étage de l'hôtel Radisson Blu, ce rooftop offre une vue à 360° sur Lyon et ses alentours. 
    Avec la Part-Dieu d'un côté et le Vieux Lyon de l'autre, c'est l'endroit idéal pour admirer le coucher 
    de soleil sur la ville.
    
    La carte des cocktails est créative et élaborée, avec des créations originales aux saveurs locales. 
    L'ambiance y est chic mais décontractée, avec des DJ sets les vendredis et samedis soirs qui animent 
    l'espace sans être envahissants.`,
    datePublication: new Date()
  },
  {
    id: '3',
    titre: "Guide des spas et centres de bien-être",
    description: "Prenez soin de vous et offrez-vous une parenthèse de détente dans les meilleurs établissements de la région. Massages, soins du corps et rituels relaxants.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200",
    tags: ["Bien-être", "Détente"],
    lien: "/blog/guide-spa",
    contenu: `Dans notre quotidien effréné, prendre soin de soi est devenu une nécessité plutôt qu'un luxe. 
    Lyon, ville dynamique par excellence, regorge d'havres de paix où vous pourrez vous ressourcer 
    et vous offrir une parenthèse bien-être. Découvrez notre guide des meilleurs spas et centres 
    de bien-être de la région lyonnaise.
    
    Les bains romains contemporains
    
    Inspiré des thermes antiques, ce spa urbain propose un parcours aquatique complet avec bains 
    chauds, froids, hammam et sauna. L'architecture du lieu, mêlant pierre, mosaïques et lumières 
    tamisées, vous transporte instantanément dans l'univers des bains romains.`,
    datePublication: new Date()
  },
  {
    id: '4',
    titre: "Escapades romantiques pour couples",
    description: "Idées de week-ends et sorties pour raviver la flamme et partager des moments privilégiés à deux. Des expériences conçues pour les amoureux.",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1200",
    tags: ["Couples", "Romantique"],
    lien: "/blog/escapades-romantiques",
    contenu: `Envie de raviver la flamme ou simplement de partager un moment privilégié avec votre moitié ? 
    Lyon et ses environs regorgent de lieux et d'activités propices aux escapades romantiques. 
    Voici notre sélection d'idées pour créer des souvenirs à deux inoubliables.
    
    Balade nocturne dans le Vieux Lyon illuminé
    
    Quand la nuit tombe, le Vieux Lyon se pare de lumières qui mettent en valeur ses façades Renaissance 
    et ses traboules mystérieuses. Une promenade main dans la main dans ces ruelles pavées offre une 
    atmosphère particulièrement romantique.`,
    datePublication: new Date()
  }
];

export const migrateOldArticles = async (): Promise<void> => {
  try {
    console.log('Début de la migration des anciens articles...');
    const articlesRef = collection(db, 'articles');
    
    // Vérifier si les articles existent déjà
    const snapshot = await getDocs(articlesRef);
    if (snapshot.size > 0) {
      console.log('Des articles existent déjà dans la base de données');
      return;
    }
    
    // Ajouter les anciens articles
    for (const article of oldArticles) {
      const { id, ...articleData } = article;
      await addDoc(articlesRef, articleData);
      console.log(`Article migré: ${article.titre}`);
    }
    
    console.log('Migration terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la migration des articles:', error);
    throw error;
  }
};

export const getAllArticles = async (): Promise<BlogArticle[]> => {
  try {
    console.log('Tentative de récupération des articles depuis Firebase...');
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('datePublication', 'desc'));
    console.log('Requête Firebase préparée, exécution...');
    const snapshot = await getDocs(q);
    console.log('Nombre d\'articles trouvés:', snapshot.size);
    
    const articles = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Données brutes de l\'article:', data);
      return {
        id: doc.id,
        ...data,
        datePublication: data.datePublication?.toDate(),
      };
    }) as BlogArticle[];
    
    console.log('Articles transformés:', articles);
    return articles;
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des articles:', error);
    throw error;
  }
}; 