CREATE DATABASE MokkivarausFirma;
USE MokkivarausFirma;

DROP TABLE IF EXISTS kirjanpito;
DROP TABLE IF EXISTS Varaukset;
DROP TABLE IF EXISTS Cabin;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
Asiakas_id INT AUTO_INCREMENT NOT NULL,
Etunimi VARCHAR(12) NOT NULL,
Sukunimi VARCHAR(20) NOT NULL,
Email VARCHAR(50) NOT NULL,
Puhelinnumero INT NOT NULL,
PRIMARY KEY (Asiakas_id)
);

CREATE TABLE Cabin (
Cabin VARCHAR(25) NOT NULL,
Hinta_per_tunti DECIMAL(5, 2) NOT NULL,
Vapaana BOOLEAN DEFAULT TRUE,
PRIMARY KEY (Cabin)
);

CREATE TABLE Varaukset (
Varaus_id INT AUTO_INCREMENT NOT NULL,
Asiakas_id INT NOT NULL,
Cabin VARCHAR(20) NOT NULL,
Alkuaika DATETIME NOT NULL,
Loppuaika DATETIME NOT NULL,
PRIMARY KEY (Varaus_id),
FOREIGN KEY (Asiakas_id) REFERENCES Users(Asiakas_id),
FOREIGN KEY (Cabin) REFERENCES Cabin(Cabin)
);

CREATE TABLE Kirjanpito (
lasku_id INT AUTO_INCREMENT NOT NULL,
Asiakas_id INT NOT NULL,
Varaus_id INT NOT NULL,
maksu_€ DECIMAL(10,2) NOT NULL,
maksettu BOOLEAN NOT NULL,
PRIMARY KEY (lasku_id),
FOREIGN KEY (Varaus_id) REFERENCES Varaukset(Varaus_id),
FOREIGN KEY (Asiakas_id) REFERENCES Users(Asiakas_id)
);

