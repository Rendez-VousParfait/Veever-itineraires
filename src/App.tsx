import { useState } from 'react'
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Button, IconButton, Box, Typography, Stack, Container } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Menu as MenuIcon } from '@mui/icons-material'
import Hero from './components/Hero'
import WhyChooseVeever from './components/WhyChooseVeever'
import Itineraries from './components/Itineraries'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import MobileMenu from './components/MobileMenu'
import BookingPage from './components/BookingPage'
import { theme } from './theme'
import BlogSection from './components/BlogSection'
import { blogArticles } from './data/blogArticles'
import TopInsolite from './components/blog/TopInsolite'
import MeilleursRooftops from './components/blog/MeilleursRooftops'
import GuideSpa from './components/blog/GuideSpa'
import EscapadesRomantiques from './components/blog/EscapadesRomantiques'
import PersonalityForm from './components/PersonalityForm'
import SurpriseMe from './components/SurpriseMe'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileTabProvider } from './contexts/ProfileTabContext'
import AuthModal from './components/auth/AuthModal'
import UserMenu from './components/auth/UserMenu'
import { useAuth } from './contexts/AuthContext'
import DebugAuth from './components/auth/DebugAuth'
import UserManagement from './components/admin/UserManagement'
import CreateAdminUser from './components/admin/CreateAdminUser'
import ItineraryManagement from './components/admin/ItineraryManagement'
import PartnerManagement from './components/admin/PartnerManagement'
import { ProtectedRoute } from './utils/authUtils'
import UserProfile from './components/auth/UserProfile'
import UserFavoritesPage from './components/auth/UserFavoritesPage'
import UserOrdersPage from './components/auth/UserOrdersPage'
import UserCustomExperiences from './components/user/UserCustomExperiences'
import FirebaseErrorHandler from './components/FirebaseErrorHandler'
import NotFound from './components/NotFound'
import AdminCustomExperiences from './components/admin/AdminCustomExperiences'
import ItineraryDetail from './components/ItineraryDetail'

// Composant pour la page d'accueil
const HomePage = () => (
  <>
    <main className="pt-20">
      <Hero />
      <WhyChooseVeever />
      <HowItWorks />
      <Itineraries />
      <PersonalityForm />
      <SurpriseMe />
      <BlogSection articles={blogArticles} />
      <Testimonials />
      <FAQ />
    </main>
    <Footer />
  </>
);

// Composant pour le layout avec la navigation
interface LayoutProps {
  children: React.ReactNode;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalView: 'login' | 'register';
  handleOpenAuthModal: (view: 'login' | 'register') => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  mobileMenuOpen,
  setMobileMenuOpen,
  authModalOpen,
  setAuthModalOpen,
  authModalView,
  handleOpenAuthModal
}) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <>
      <AppBar 
        position="fixed" 
        color="transparent" 
        elevation={0} 
        sx={{ 
          backdropFilter: 'blur(10px)', 
          background: 'rgba(15, 23, 42, 0.8)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box 
            component="img" 
            src="/images/logo-veever.png" 
            alt="Veever Logo" 
            sx={{ 
              height: 50,
              cursor: 'pointer',
            }}
            onClick={() => window.location.href = '/'}
          />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button 
              color="inherit" 
              href="/#itineraires"
              sx={{ 
                color: location.hash === '#itineraires' ? 'primary.main' : 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Itinéraires
            </Button>
            <Button 
              color="inherit" 
              href="/#creer"
              sx={{ 
                color: location.hash === '#creer' ? 'primary.main' : 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Sur Mesure
            </Button>
            <Button 
              color="inherit" 
              href="/#surprise"
              sx={{ 
                color: location.hash === '#surprise' ? 'primary.main' : 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Surprise Me
            </Button>
            <Button 
              color="inherit" 
              href="/#blog"
              sx={{ 
                color: location.hash === '#blog' ? 'primary.main' : 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Blog
            </Button>
            <Button 
              color="inherit" 
              href="/#faq"
              sx={{ 
                color: location.hash === '#faq' ? 'primary.main' : 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              F.A.Q
            </Button>
            
            {currentUser ? (
              <UserMenu />
            ) : (
              <>
                <Button 
                  color="inherit"
                  onClick={() => handleOpenAuthModal('login')}
                  sx={{
                    ml: 2,
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Connexion
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => handleOpenAuthModal('register')}
                  sx={{
                    background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                      opacity: 0.9
                    },
                  }}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </Box>
          
          <IconButton 
            color="inherit" 
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onOpenAuth={handleOpenAuthModal}
      />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialView={authModalView}
      />
      
      <Box component="main" sx={{ minHeight: '100vh', pt: 8 }}>
        {children}
      </Box>
    </>
  );
};

// Composant wrapper pour la page de réservation
const BookingPageWrapper = () => {
  const location = useLocation();
  return <BookingPage itinerary={location.state?.itinerary} />;
};

// Composant pour la navigation admin
const AdminNav = () => {
  const location = useLocation();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant={location.pathname === '/admin/users' ? 'contained' : 'outlined'}
          component="a"
          href="/admin/users"
        >
          Gestion des utilisateurs
        </Button>
        <Button
          variant={location.pathname === '/admin/itineraries' ? 'contained' : 'outlined'}
          component="a"
          href="/admin/itineraries"
        >
          Gestion des itinéraires
        </Button>
        <Button
          variant={location.pathname === '/admin/partners' ? 'contained' : 'outlined'}
          component="a"
          href="/admin/partners"
        >
          Gestion des partenaires
        </Button>
        <Button
          variant={location.pathname === '/admin/experiences' ? 'contained' : 'outlined'}
          component="a"
          href="/admin/experiences"
        >
          Expériences personnalisées
        </Button>
        <Button
          variant={location.pathname === '/admin/create' ? 'contained' : 'outlined'}
          component="a"
          href="/admin/create"
        >
          Créer un admin
        </Button>
      </Stack>
    </Box>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

  const handleOpenAuthModal = (view: 'login' | 'register') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProfileTabProvider>
          <Router>
            <FirebaseErrorHandler>
              <Layout
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                authModalOpen={authModalOpen}
                setAuthModalOpen={setAuthModalOpen}
                authModalView={authModalView}
                handleOpenAuthModal={handleOpenAuthModal}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/booking" element={<BookingPageWrapper />} />
                  <Route path="/blog/top-insolite" element={<TopInsolite />} />
                  <Route path="/blog/meilleurs-rooftops" element={<MeilleursRooftops />} />
                  <Route path="/blog/guide-spa" element={<GuideSpa />} />
                  <Route path="/blog/escapades-romantiques" element={<EscapadesRomantiques />} />
                  
                  {/* Routes protégées */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <UserFavoritesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <UserOrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/custom-experiences" element={
                    <ProtectedRoute>
                      <UserCustomExperiences />
                    </ProtectedRoute>
                  } />
                  <Route path="/custom-experiences/edit/:id" element={
                    <ProtectedRoute>
                      <PersonalityForm mode="edit" />
                    </ProtectedRoute>
                  } />
                  <Route path="/itinerary/:id" element={<ItineraryDetail />} />
                  
                  {/* Routes admin */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <Navigate to="/admin/users" replace />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requireAdmin>
                      <AdminNav />
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/itineraries" element={
                    <ProtectedRoute requireAdmin>
                      <AdminNav />
                      <ItineraryManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/partners" element={
                    <ProtectedRoute requireAdmin>
                      <AdminNav />
                      <PartnerManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/experiences" element={
                    <ProtectedRoute requireAdmin>
                      <AdminNav />
                      <AdminCustomExperiences />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/create" element={
                    <ProtectedRoute requireAdmin>
                      <AdminNav />
                      <CreateAdminUser />
                    </ProtectedRoute>
                  } />
                  
                  {/* Route 404 - doit être la dernière */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </FirebaseErrorHandler>
          </Router>
        </ProfileTabProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
