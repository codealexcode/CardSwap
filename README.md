# EVENT DRIVEN ASYNC PROGRAMMING - PROJET

## EQUIPE:
* Alexis MOULIN
* Gaëtan LE MEUR
* Fares EL KHOULY

## SUJET:
Création d'une plate-forme de mise en relation de joueurs de cartes MTG et YUGIOH
afin de permettre l'achat, l'échange ou la vente.

## Il faut donc pouvoir gérer:
- les utilisateurs:
	- authentification
	- "vitrine" de cartes

- les cartes:
	- requêtes sur les APIs MTG et YUGIOH
	  (recherche de carte par nom, type etc...)

- la mise en relation de plusieurs utilisateurs:
	- chat potentiel
	- service de vente potentiel

## PLANNING:
* Définir le model de donnée.
* Recherche de cartes via les APIs.
* Ajout de cartes dans la "vitrine".
* Recherche de cartes dans l'application.
* Messages entre utilisateurs. 

## CONCEPTION:

POC:

Etape 1 : requête sur les APIs
- texte pour renseigner le nom d'une carte
- bouton "envoyer" -> envoie le texte au serveur
- serveur requête sur l'API
- retourne le JSON au client

Etape 2 - Instantiation BDD
- Créer les tables (USER, SHOP, CARDS)
- Gérer les transactions (ajout d'utilisateur, de cartes etc...)

Etape 3 : Recherche de carte 
- texte pour renseigner le nom d'une carte
- bouton "envoyer" -> envoie le texte au serveur
- Recherche dans BDD des profils utilisiteurs et magasins correspondants 

Etape 4 : Transaction entre utilisateur
- Mise en relation (chat ?)
- Historique des transaction (stats ?)

Etape 5 : Favoris et notification
- Pouvoir renseigner des favoris (cartes voulues)
- système de notification dès lors qu'un favori devient disponible dans la zone 



## PROTOTYPE:
















