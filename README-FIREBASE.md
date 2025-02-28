# Configuration de Firebase pour l'authentification

Ce document explique comment configurer Firebase pour l'authentification dans votre application Veever Itinéraires.

## Étapes de configuration

1. **Créer un projet Firebase**
   - Rendez-vous sur [Firebase Console](https://console.firebase.google.com/)
   - Cliquez sur "Ajouter un projet"
   - Suivez les étapes pour créer votre projet

2. **Activer l'authentification par email/mot de passe**
   - Dans la console Firebase, allez dans "Authentication" > "Sign-in method"
   - Activez la méthode "Email/Mot de passe"

3. **Enregistrer votre application web**
   - Dans la console Firebase, cliquez sur l'icône "</>" (Ajouter une application web)
   - Donnez un nom à votre application et enregistrez-la
   - Firebase vous fournira une configuration comme celle-ci :

   ```javascript
   const firebaseConfig = {
     apiKey: "VOTRE_API_KEY",
     authDomain: "VOTRE_AUTH_DOMAIN",
     projectId: "VOTRE_PROJECT_ID",
     storageBucket: "VOTRE_STORAGE_BUCKET",
     messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
     appId: "VOTRE_APP_ID"
   };
   ```

4. **Mettre à jour le fichier de configuration Firebase**
   - Ouvrez le fichier `src/firebase/config.ts`
   - Remplacez les valeurs par défaut par celles fournies par Firebase

## Utilisation dans l'application

L'authentification est déjà intégrée dans l'application. Voici comment elle fonctionne :

- Le contexte `AuthContext` gère l'état d'authentification
- Les composants `Login` et `Register` permettent aux utilisateurs de se connecter et de s'inscrire
- Le composant `UserMenu` affiche les informations de l'utilisateur connecté et permet de se déconnecter
- Le composant `AuthModal` affiche les formulaires d'authentification dans une fenêtre modale

## Fonctionnalités disponibles

- Inscription avec email et mot de passe
- Connexion avec email et mot de passe
- Déconnexion
- Réinitialisation du mot de passe
- Mise à jour du profil utilisateur

## Sécurité

N'oubliez pas de configurer les règles de sécurité Firebase pour protéger vos données. Par défaut, Firebase requiert une authentification pour accéder aux données.

## Ressources utiles

- [Documentation Firebase Authentication](https://firebase.google.com/docs/auth)
- [Guide d'authentification React avec Firebase](https://firebase.google.com/docs/auth/web/start) 