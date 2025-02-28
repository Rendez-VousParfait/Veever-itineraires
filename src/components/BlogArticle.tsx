import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Stack, 
  Button,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Article } from './BlogSection';
import { ArrowBack, AccessTime, Share } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface BlogArticleProps {
  article: Article;
  content: React.ReactNode;
  blogArticles: Article[];
}

const BlogArticle: React.FC<BlogArticleProps> = ({ article, content, blogArticles }) => {
  const navigate = useNavigate();
  
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 12, md: 16 },
        background: '#10192c',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator="›" 
          aria-label="breadcrumb"
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            '& .MuiBreadcrumbs-separator': {
              mx: 1
            }
          }}
        >
          <Link 
            color="inherit" 
            href="/" 
            sx={{ 
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' }
            }}
          >
            Accueil
          </Link>
          <Link 
            color="inherit" 
            href="/#blog" 
            sx={{ 
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' }
            }}
          >
            Blog
          </Link>
          <Typography color="text.primary">{article.titre}</Typography>
        </Breadcrumbs>
        
        {/* Bouton retour */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          Retour aux articles
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* En-tête de l'article */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {article.titre}
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <AccessTime sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">5 min de lecture</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Publié le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
            </Stack>
            
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              sx={{ mb: 4, gap: 1 }}
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
                />
              ))}
            </Stack>
          </Box>
          
          {/* Image principale */}
          <Box 
            component="img"
            src={article.image}
            alt={article.titre}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              mb: 6,
              objectFit: 'cover',
              maxHeight: '500px',
            }}
          />
          
          {/* Contenu de l'article */}
          <Box 
            sx={{ 
              typography: 'body1',
              color: 'text.primary',
              lineHeight: 1.8,
              '& h2': {
                color: '#F74AA1',
                mt: 6,
                mb: 3,
                fontWeight: 600,
              },
              '& h3': {
                color: '#F59E3F',
                mt: 4,
                mb: 2,
                fontWeight: 600,
              },
              '& p': {
                mb: 3,
              },
              '& img': {
                width: '100%',
                borderRadius: 2,
                my: 4,
              },
              '& ul, & ol': {
                pl: 4,
                mb: 3,
              },
              '& li': {
                mb: 1,
              },
              '& blockquote': {
                borderLeft: '4px solid #F59E3F',
                pl: 3,
                py: 1,
                my: 4,
                fontStyle: 'italic',
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '0 8px 8px 0',
              },
              '& .highlight-box': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(255, 214, 198, 0.2)',
                borderRadius: 2,
                p: 3,
                my: 4,
              },
            }}
          >
            {content}
          </Box>
          
          {/* Boutons de partage */}
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Partager cet article
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<Share />}
                sx={{
                  borderColor: 'rgba(255, 214, 198, 0.3)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: 'rgba(255, 214, 198, 0.5)',
                    background: 'rgba(255, 214, 198, 0.1)',
                  },
                }}
              >
                Partager
              </Button>
            </Stack>
          </Box>
          
          {/* Articles associés */}
          <Box sx={{ mt: 10, mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 'bold',
              mb: 4,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Articles similaires
            </Typography>
            
            <Grid container spacing={4}>
              {blogArticles
                .filter(a => a.id !== article.id && a.tags.some(tag => article.tags.includes(tag)))
                .slice(0, 2)
                .map(relatedArticle => (
                  <Grid item xs={12} sm={6} key={relatedArticle.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 214, 198, 0.2)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 214, 198, 0.4)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={relatedArticle.image}
                        alt={relatedArticle.titre}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          gutterBottom
                          sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                          {relatedArticle.titre}
                        </Typography>
                        <Button
                          component={RouterLink}
                          to={relatedArticle.lien}
                          sx={{
                            mt: 2,
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                component={RouterLink}
                to="/#blog"
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
                  },
                }}
              >
                Voir tous les articles
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BlogArticle; 