import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Stack, 
  Card, 
  CardMedia, 
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { BlogArticle, getAllArticles } from '../firebase/blogService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const BlogSection: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        console.log('Vérification de la connexion Firebase...');
        const testCollection = collection(db, 'articles');
        await getDocs(testCollection);
        console.log('Connexion Firebase OK');
        setDebugInfo(prev => prev + '\nConnexion Firebase OK');
      } catch (err) {
        console.error('Erreur de connexion Firebase:', err);
        setDebugInfo(prev => prev + '\nErreur de connexion Firebase: ' + JSON.stringify(err));
        setError('Erreur de connexion à la base de données');
      }
    };

    checkFirebaseConnection();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        console.log('Début du chargement des articles...');
        setDebugInfo(prev => prev + '\nDébut du chargement des articles...');
        
        const articlesData = await getAllArticles();
        console.log('Articles récupérés:', articlesData);
        setDebugInfo(prev => prev + '\nArticles récupérés: ' + JSON.stringify(articlesData));
        
        if (articlesData.length === 0) {
          setDebugInfo(prev => prev + '\nAucun article trouvé dans la base de données');
        }
        
        setArticles(articlesData);
        const tags = Array.from(new Set(articlesData.flatMap(article => article.tags)));
        setAllTags(tags);
      } catch (err) {
        console.error('Erreur détaillée lors du chargement des articles:', err);
        setDebugInfo(prev => prev + '\nErreur de chargement: ' + JSON.stringify(err));
        setError('Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    console.log('Articles mis à jour:', articles);
    if (selectedTag) {
      const filtered = articles.filter(article => article.tags.includes(selectedTag));
      console.log('Articles filtrés par tag:', filtered);
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [selectedTag, articles]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: '#10192c',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Chargement des articles...
        </Typography>
        {import.meta.env.DEV && (
          <Alert severity="info" sx={{ mt: 2, maxWidth: '600px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {debugInfo}
            </pre>
          </Alert>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: '#10192c',
          color: 'error.main',
          gap: 2
        }}
      >
        <Typography variant="h6">{error}</Typography>
        {import.meta.env.DEV && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: '600px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {debugInfo}
            </pre>
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box 
      component="section" 
      id="blog"
      sx={{ 
        py: { xs: 8, md: 12 },
        background: '#10192c',
        position: 'relative',
      }}
    >
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
            }}
          >
            Notre Blog
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
          >
            Découvrez nos articles inspirants pour vos prochaines aventures
          </Typography>

          {/* Tags de filtrage */}
          <Stack 
            direction="row" 
            spacing={1.5} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ mb: 6, gap: 1.5 }}
          >
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                onClick={() => handleTagClick(tag)}
                sx={{
                  px: 2,
                  py: 2.5,
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 'medium',
                  background: selectedTag === tag 
                    ? 'linear-gradient(45deg, #F59E3F, #F74AA1)' 
                    : 'rgba(99, 102, 241, 0.1)',
                  color: selectedTag === tag ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: selectedTag === tag 
                    ? 'transparent' 
                    : 'rgba(255, 214, 198, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: selectedTag === tag 
                      ? 'linear-gradient(45deg, #F59E3F, #F74AA1)' 
                      : 'rgba(99, 102, 241, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                }}
              />
            ))}
          </Stack>

          {/* Grid des articles */}
          <Grid container spacing={4}>
            <AnimatePresence>
              {filteredArticles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        background: 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '2px solid rgba(255, 214, 198, 0.3)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(255, 214, 198, 0.2)',
                          border: '2px solid rgba(255, 214, 198, 0.5)',
                          '& .article-title-overlay': {
                            opacity: 1,
                            background: 'rgba(16, 25, 44, 0.85)',
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={article.image}
                          alt={article.titre}
                        />
                        <Box
                          className="article-title-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 3,
                            background: 'rgba(16, 25, 44, 0.6)',
                            opacity: 0.9,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="h3"
                            align="center"
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            {article.titre}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ 
                        flexGrow: 1, 
                        p: 3, 
                        display: 'flex', 
                        flexDirection: 'column',
                      }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            color="#CBD5E1"
                            sx={{
                              lineHeight: '1.6',
                              fontSize: '0.95rem',
                              mb: 1
                            }}
                          >
                            {article.description}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                          <Stack 
                            direction="row" 
                            spacing={1} 
                            flexWrap="wrap" 
                            sx={{ 
                              mb: 3, 
                              gap: 1
                            }}
                          >
                            {article.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  background: 'rgba(99, 102, 241, 0.1)',
                                  border: '1px solid rgba(255, 214, 198, 0.2)',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleTagClick(tag)}
                              />
                            ))}
                          </Stack>

                          <Button
                            component={RouterLink}
                            to={article.lien}
                            variant="outlined"
                            fullWidth
                            sx={{
                              borderColor: 'rgba(255, 214, 198, 0.3)',
                              color: '#fff',
                              '&:hover': {
                                borderColor: 'rgba(255, 214, 198, 0.5)',
                                background: 'rgba(255, 214, 198, 0.1)',
                              },
                            }}
                          >
                            Lire l'article
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BlogSection; 