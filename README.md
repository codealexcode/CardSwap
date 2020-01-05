# EVENT DRIVEN ASYNC PROGRAMMING - PROJET

## EQUIPE:
* Alexis MOULIN
* Gaëtan LE MEUR
* Fares EL KHOULY

# I) ANALYSE

## SUJET:

Création d'une plate-forme de mise en relation de joueurs de cartes MTG et YUGIOH afin de leur permettre l'achat, la vente ou l'échange de cartes

## BUTS PRINCIPAUX:

- Les joueurs de cartes MTG et YUGIOH pourront sur la plate-forme (e-commerce):

	1) Se connecter et se déconnecter avec un profil paramétré
	2) Rechercher des cartes qu'ils souhaitent acheter, vendre ou échanger
	3) Consulter les magasins (shops) des utilisateurs
	4) Contacter des utilisateurs 
	5) Etre notifié (messages, transactions)

## SOUS-BUT PRINCIPAUX:

- Il faudra donc pouvoir gérer:

	1) Connection, déconnection, profil
		- Page accueil utilisateur 
		- Création de profil utilisateur
		- Authentification (utilisateur, mot de passe) sécurisée (cryptée) 
		- Mise en place d'une BDD utilisateurs 
	2) Rechercher cartes
		- Page recherche de cartes (par nom) 
		- Mise en place d'une BDD cartes MTG et YUGIOH
		- Utiliser les APIs MTG et YUGIOH (requêtes) 
	3) Magasins cartes utilisateur (constitués d'annonces, "j'achète", "je vends")
		- Page magasin de cartes (par annonces achats ou ventes)
		- Mise en place d'une BDD magasin et annonces
		- Permettre création ou suppréssion d'une annonce
	4) Contacter les utilisteurs
		- Page? Module?
		- Enregistrement des messages? BDD? 
	5) Notifications
		- ?
		
# II) CONCEPTION

## POC:

- Par étape, permettre :

	1) La connexion sécurisée utilisateur
		- création des routes
		- instantiation BDD avec phpMyAdmin
		- création d'une view "page de connexion", Bootstrap 

	2) La recherche d'une carte
		- Texte pour renseigner le nom d'une carte
		- Bouton "Envoyer" -> envoie le texte au serveur
		- Serveur requête sur l'API et retourne le JSON au client

	3) L'enregistrement d'annonces achat ou vente de cartes en magasin
		- Créer les tables (USER, SHOP, CARDS, ANNONCES)
		- Gérer les transactions (ajout de cartes/annonces, suppression etc..)

	4) La transaction entre utilisateur
		- Mise en relation (chat ?)
		- Historique des transaction (stats ?)

	5) Favoris et notification
		- Pouvoir renseigner des favoris (cartes voulues)
		- système de notification dès lors qu'un favori devient disponible dans la zone 

## PLANNING:
* Définir le model de donnée.
* Recherche de cartes via les APIs.
* Ajout de cartes dans la "vitrine".
* Recherche de cartes dans l'application.
* Messages entre utilisateurs. 

## PROTOTYPE:
















