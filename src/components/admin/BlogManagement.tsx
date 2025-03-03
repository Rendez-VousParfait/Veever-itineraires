import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { migrateOldArticles } from '../../firebase/blogService';

interface BlogArticle {
  id: string;
  titre: string;
  description: string;
  image: string;
  tags: string[];
  lien: string;
  contenu: string;
  datePublication: Date;
}

const BlogManagement = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState<Partial<BlogArticle>>({
    titre: '',
    description: '',
    image: '',
    tags: [],
    lien: '',
    contenu: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const articlesCollection = collection(db, 'articles');
      const articlesSnapshot = await getDocs(articlesCollection);
      const articlesData = articlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        datePublication: doc.data().datePublication?.toDate(),
      })) as BlogArticle[];
      setArticles(articlesData);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (article?: BlogArticle) => {
    if (article) {
      setSelectedArticle(article);
      setFormData(article);
    } else {
      setSelectedArticle(null);
      setFormData({
        titre: '',
        description: '',
        image: '',
        tags: [],
        lien: '',
        contenu: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArticle(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      setError('Erreur lors du téléchargement de l\'image');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const articleData = {
        ...formData,
        datePublication: new Date(),
      };

      if (selectedArticle) {
        await updateDoc(doc(db, 'articles', selectedArticle.id), articleData);
        setSuccess('Article mis à jour avec succès');
      } else {
        await addDoc(collection(db, 'articles'), articleData);
        setSuccess('Article créé avec succès');
      }

      handleCloseDialog();
      loadArticles();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'article');
      console.error(err);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteDoc(doc(db, 'articles', articleId));
        setSuccess('Article supprimé avec succès');
        loadArticles();
      } catch (err) {
        setError('Erreur lors de la suppression de l\'article');
        console.error(err);
      }
    }
  };

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      setError(null);
      await migrateOldArticles();
      setSuccess('Migration des anciens articles réussie');
      loadArticles();
    } catch (err) {
      setError('Erreur lors de la migration des articles');
      console.error(err);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Articles
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleMigration}
            disabled={isMigrating}
          >
            {isMigrating ? 'Migration en cours...' : 'Migrer les anciens articles'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouvel Article
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Date de publication</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.titre}</TableCell>
                  <TableCell>{article.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {article.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {article.datePublication?.toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(article)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(article.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedArticle ? 'Modifier l\'article' : 'Nouvel article'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                name="titre"
                value={formData.titre || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lien"
                name="lien"
                value={formData.lien || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenu"
                name="contenu"
                multiline
                rows={10}
                value={formData.contenu || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                  >
                    Télécharger une image
                  </Button>
                </label>
                {formData.image && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Ajouter un tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ mr: 1 }}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  Ajouter
                </Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedArticle ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagement; 