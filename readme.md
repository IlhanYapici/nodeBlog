# Objectifs

Sujet du projet : Création d'un BLOG headless  
Type de rendu : Sources du projet (sans node_modules)  
Date de rendu : 07/01/2022

# Cahier des charges
## 1. Description du projet

Le but du projet est de monter la partie API d'une gestion de blog simplifié.
Le scope du projet est le suivant :
- Gestion des utilisateurs
- Gestion des articles
- Gestion des commentaires  

L'API doit suivre les règles d'une API RESTFULL (comme vu en cours)

## 2. Gestion des utilisateurs (/users)

Chaque utilisateur doit pouvoir :

- Créer un compte
- Se connecter
- Récupérer ses informations
- Modifier ses propres informations  

Inscription : Un utilisateur s'inscrit avec un **lastname**, un **firstname**, un **email**, un **password**
Connexion : Un utilisateur se connecte avec un **email** et un **password**  

Un profil utilisateur contient :
- lastname STRING NOT NULL
- firstname STRING NOT NULL
- email STRING NOT NULL (doit être un email)
- password STRING NOT NULL (encodé en bcrypt)
- createdAt DATETIME NOT NULL
- updatedAt DATETIME NOT NULL
- isAdmin BOOLEAN NOT NULL default false  

Quand un utilisateur est listé ou accédé, tous les champs doivent être affichés sauf **password**. Un champ **articles** doit contenir le titre des deux derniers articles de l'auteur.

Règles de sécurité :

Utilisateur classique
- Editer uniquement son profil sauf le champ isAdmin
- Ne lister que son profil

Utilisateur Admin
- Éditer n'importe quel profil tous les champs
- Lister tous les profils

## 3. Gestion des articles (/articles)

Un article contient
- title
- content
- tags
- authorId
- createdAt
- updatedAt
- deletedAt

Quand un article est listé ou accédé, tous les champs doivent être affichés **sauf deletedAt**. Un champ **author** doit contenir les **lastname** et **firstname** de l'auteur.

Règles de sécurité :
- Chaque utilisateur doit pouvoir lister, accéder et créer un article.
- Mis à part les administrateurs, seul le créateur de l'article peut éditer ou supprimer son article.
- Un soft delete doit être mis en place, les articles ne sont pas réellement supprimés, les administrateurs
doivent pouvoir voir les articles supprimés.
- Un article doit pouvoir être recherché via son titre et ses tags.

## 4. Les commentaires (/comments)

Un commentaire contient :

- content
- authorId
- articleId
- createdAt
- updatedAt
- deletedAt

Quand un commentaire est listé ou accédé, tous les champs doivent être affichés **sauf deletedAt**. Un champ **author** doit contenir les **lastname** et **firstname** de l'auteur. Un champ **article** doit contenir le **title** de l'article.

Règles de sécurité :

- Chaque utilisateur doit pouvoir lister, accéder et créer un commentaire.
- Mis à part les administrateurs, seul le créateur du commentaire peut éditer ou supprimer son
commentaire.
- Un soft delete doit être mis en place, les commentaires ne sont pas réellement supprimés, les
administrateurs doivent pouvoir voir les commentaires supprimés.
- Un article doit pouvoir être recherché par l'authorId et son articleId

## Contributing
Ilhan YAPICI  
Simon LELLOUCHE  
Victor BONNIN  
Joris CASADAVANT  