# Sécurité du Projet Veever Itinéraires

Ce document décrit les mesures de sécurité mises en place pour protéger les données sensibles du projet Veever Itinéraires.

## Variables d'Environnement

Les informations sensibles de configuration Firebase sont stockées dans des variables d'environnement et non exposées directement dans le code source :

- Les clés API et identifiants Firebase sont stockés dans un fichier `.env.local`
- Ce fichier est ignoré par Git via `.gitignore` et ne sera jamais commité dans le dépôt

## Journalisation (Logging)

Pour éviter l'exposition d'informations sensibles dans les logs :

- Les logs détaillés sont uniquement activés en mode développement via `VITE_DEV_MODE="true"` dans `.env.local`
- Les logs contenant des informations sensibles (emails, tokens, etc.) ont été supprimés ou conditionnés
- Les erreurs sont toujours enregistrées mais sans détails sensibles

## Accès à Firebase

Protégez votre projet Firebase en suivant ces bonnes pratiques :

1. Utilisez des règles de sécurité strictes dans Firebase
2. Limitez l'accès aux collections Firestore avec des règles basées sur l'authentification
3. Activez l'authentification à deux facteurs pour l'accès à la console Firebase

## Gestion du Fichier .env.local

Pour les développeurs travaillant sur ce projet :

1. Ne partagez jamais le fichier `.env.local` par email ou messagerie
2. Pour les nouveaux développeurs, créez un fichier `.env.example` sans les vraies valeurs
3. Changez régulièrement les clés API si nécessaire

## Mise à Jour de Sécurité

Maintenez la sécurité du projet :

1. Mettez à jour régulièrement les dépendances avec `npm audit fix`
2. Vérifiez régulièrement les vulnérabilités avec `npm audit`
3. Suivez les meilleures pratiques de sécurité pour Firebase et React 