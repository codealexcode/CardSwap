-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3308
-- Généré le :  lun. 06 jan. 2020 à 21:41
-- Version du serveur :  8.0.18
-- Version de PHP :  7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `cardswap`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonces`
--

DROP TABLE IF EXISTS `annonces`;
CREATE TABLE IF NOT EXISTS `annonces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` varchar(256) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `card`
--

DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `card_id` varchar(256) NOT NULL,
  `image_url` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `card`
--

INSERT INTO `card` (`id`, `game`, `name`, `card_id`, `image_url`) VALUES
(34, 'MTG', 'Goblin Warchief', '2cea421a-5e5e-538a-bf66-2b8fcb9e0ebe', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=157934&type=card'),
(35, 'MTG', 'Echoing Truth', '16f9e89d-220c-51e9-aa44-535588932766', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=405212&type=card'),
(33, 'MTG', 'Dross Golem', '091dbc08-352c-5f9f-afb8-2e225703947c', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=46157&type=card'),
(32, 'MTG', 'Llanowar Elves', '523f73f5-e2d9-54e0-a784-fbab2d9b97a1', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129626&type=card'),
(36, 'MTG', 'Lightning Bolt', '8ff0c52d-af61-57ac-a5ba-95496799c2a6', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=806&type=card'),
(37, 'YUGIOH', 'Tornado Dragon', '6983839', 'https://storage.googleapis.com/ygoprodeck.com/pics/6983839.jpg'),
(38, 'YUGIOH', 'Crass Clown', '93889755', 'https://storage.googleapis.com/ygoprodeck.com/pics/93889755.jpg'),
(39, 'MTG', 'Soulherder', 'c6a795bf-df14-5321-9c25-76d6b4ff8531', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=464163&type=card');

-- --------------------------------------------------------

--
-- Structure de la table `card_user`
--

DROP TABLE IF EXISTS `card_user`;
CREATE TABLE IF NOT EXISTS `card_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` varchar(256) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `adress` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `adress`) VALUES
(1, 'alexis', 'alexispwd', 'boulogne-billancourt'),
(2, 'user', 'pwd', 'Villejuif');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
