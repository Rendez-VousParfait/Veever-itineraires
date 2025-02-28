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
  Grid
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

export interface Article {
  id: number;
  titre: string;
  description: string;
  image: string;
  tags: string[];
  lien: string;
}

interface BlogSectionProps {
  articles: Article[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ articles }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  // Extraire tous les tags uniques des articles
  useEffect(() => {
    const tags = Array.from(new Set(articles.flatMap(article => article.tags)));
    setAllTags(tags);
  }, [articles]);

  // Filtrer les articles en fonction du tag sélectionné
  useEffect(() => {
    if (selectedTag) {
      setFilteredArticles(articles.filter(article => article.tags.includes(selectedTag)));
    } else {
      setFilteredArticles(articles);
    }
  }, [selectedTag, articles]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const toggleExpandArticle = (id: number) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

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

          {/* Grid standard au lieu de Masonry */}
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 214, 198, 0.3)',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                '&:hover': {
                  borderColor: 'rgba(255, 214, 198, 0.5)',
                  background: 'rgba(255, 214, 198, 0.1)',
                  transform: 'translateY(-5px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Voir tous les articles
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BlogSection; 