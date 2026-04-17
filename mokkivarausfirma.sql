CREATE DATABASE MokkivarausFirma;
USE MokkivarausFirma;

DROP TABLE IF EXISTS kirjanpito;
DROP TABLE IF EXISTS Varaukset;
DROP TABLE IF EXISTS Mökit;
DROP TABLE IF EXISTS Rekisteröidyt;

CREATE TABLE Rekisteröidyt (
Asiakas_id INT AUTO_INCREMENT NOT NULL,
Etunimi VARCHAR(12) NOT NULL,
Sukunimi VARCHAR(20) NOT NULL,
Sähköposti VARCHAR(50) NOT NULL,
Puhelinnumero INT NOT NULL,
PRIMARY KEY (Asiakas_id)
);

CREATE TABLE Mökit (
Mökki VARCHAR(25) NOT NULL,
Hinta_per_tunti DECIMAL(5, 2) NOT NULL,
Vapaana BOOLEAN DEFAULT TRUE,
PRIMARY KEY (Mökki)
);

CREATE TABLE Varaukset (
Varaus_id INT AUTO_INCREMENT NOT NULL,
Asiakas_id INT NOT NULL,
Mökki VARCHAR(20) NOT NULL,
Alkuaika DATETIME NOT NULL,
Loppuaika DATETIME NOT NULL,
PRIMARY KEY (Varaus_id),
FOREIGN KEY (Asiakas_id) REFERENCES Rekisteröidyt(Asiakas_id),
FOREIGN KEY (Mökki) REFERENCES Mökit(Mökki)
);

CREATE TABLE Kirjanpito (
lasku_id INT AUTO_INCREMENT NOT NULL,
Asiakas_id INT NOT NULL,
Varaus_id INT NOT NULL,
maksu_€ DECIMAL(10,2) NOT NULL,
maksettu BOOLEAN NOT NULL,
PRIMARY KEY (lasku_id),
FOREIGN KEY (Varaus_id) REFERENCES Varaukset(Varaus_id),
FOREIGN KEY (Asiakas_id) REFERENCES Rekisteröidyt(Asiakas_id)
);

#Esimerkki transaktiosta
START TRANSACTION;

INSERT INTO rekisteröidyt (Etunimi, Sukunimi, Sähköposti, Puhelinnumero)
VALUES ('Anna', 'Korhonen', 'anna.korhonen@example.com', '0501234567');

COMMIT;

#Toinen esimerkki transaktiosta
START TRANSACTION;

INSERT INTO Mökit (Mökki, Hinta_per_tunti)
VALUES
('Rantatie 10, kuusamo', 10.50);

COMMIT;

#Kolmas esimerkki transaktiosta
START TRANSACTION;

INSERT INTO varaukset (Asiakas_id, `Mökki`, Alkuaika, Loppuaika)
VALUES (1, 'Rantatie 10, Kuusamo', '2026-06-01 15:00:00', '2026-06-05 12:00:00');

COMMIT;

#TRIGGER: Estetään varaus varattuun mökkiin
DELIMITER $$

DROP TRIGGER IF EXISTS tuplavarauksenEsto$$
CREATE TRIGGER tuplavarauksenEsto

BEFORE INSERT ON Varaukset
FOR EACH ROW
BEGIN
IF NOT EXISTS (
SELECT Mökki FROM Mökit WHERE Mökki = NEW.Mökki AND Vapaana = TRUE
) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mökki ei ole valittavissa';
END IF;
END $$

DELIMITER ;

#TRIGGER: Muuttaa varatun mökin statuksen vapaasta varatuksi
DELIMITER $$

DROP TRIGGER IF EXISTS varattu$$
CREATE TRIGGER varattu

AFTER INSERT ON Varaukset
FOR EACH ROW
BEGIN
UPDATE Mökit SET Vapaana = FALSE WHERE Mökki = NEW.Mökki;
END $$

DELIMITER ;

#TRIGGER: Laskee hinnan varauksen keston perusteella
DELIMITER $$

DROP TRIGGER IF EXISTS hintalaskuri$$
CREATE TRIGGER hintalaskuri

AFTER INSERT ON Varaukset
FOR EACH ROW
BEGIN
DECLARE tunnit DECIMAL(10,2);
DECLARE summa DECIMAL(10,2);
DECLARE hinta DECIMAL (10,2);
SELECT Hinta_per_tunti INTO hinta FROM Mökit WHERE Mökki = NEW.Mökki;
SET tunnit = timestampdiff(MINUTE, NEW.Alkuaika, NEW.Loppuaika) / 60;
SET summa = tunnit * hinta;
INSERT INTO kirjanpito (Asiakas_id, Varaus_id, maksu_€, maksettu)
	VALUES (NEW.Asiakas_id, NEW.Varaus_id, summa, FALSE);

END $$

DELIMITER ;