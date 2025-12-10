# Rendu BDD SQL

## Requêtes SQL pour le rendu

### Requête 1
```sql
SELECT * FROM produits p INNER JOIN marques m ON p.marque_id = m.marque_id ORDER BY p.prix DESC LIMIT 5;
```

### Requête 2
```sql
SELECT c.email, SUM(cmd.montant_total) AS chiffre_affaires_total, COUNT(cmd.commande_id) AS nombre_commandes
FROM clients c INNER JOIN commandes cmd ON c.client_id = cmd.client_id 
GROUP BY c.email
ORDER BY chiffre_affaires_total DESC;
```

### Requête 3
```sql
SELECT nom_produit, prix AS prix_original, prix_promotion, ROUND(((prix - prix_promotion) / prix) * 100, 2) AS pourcentage_reduction
FROM produits
WHERE en_promotion = 1
ORDER BY pourcentage_reduction DESC;
```

### Requête 4
```sql
SELECT p.nom_produit, AVG(a.note) AS note_moyenne, COUNT(a.avis_id) AS nombre_avis
FROM produits p
INNER JOIN avis_clients a ON p.produit_id = a.produit_id
WHERE a.approuve = 1 GROUP BY p.produit_id, p.nom_produit HAVING COUNT(a.avis_id) >= 2
ORDER BY note_moyenne DESC;
```

### Requête 5
```sql
SELECT cmd.commande_id, c.nom, cmd.date_commande, cmd.statut, cmd.montant_total
FROM commandes cmd
INNER JOIN clients c ON cmd.client_id = c.client_id
WHERE YEAR(cmd.date_commande) = 2024
  AND MONTH(cmd.date_commande) = 3
ORDER BY cmd.date_commande;
```

### Requête 6
```sql
SELECT nom_produit, stock_quantite
FROM produits
WHERE stock_quantite < 10
ORDER BY stock_quantite ASC;
```

### Requête 7
```sql
SELECT m.nom_marque, COUNT(p.produit_id) AS nombre_produits
FROM marques m
LEFT JOIN produits p ON m.marque_id = p.marque_id
GROUP BY nom_marque
ORDER BY nombre_produits DESC;
```

### Requête 8
```sql
SELECT c.client_id, c.email, COUNT(cmd.commande_id) AS nombre_commandes
FROM clients c
INNER JOIN commandes cmd ON c.client_id = cmd.client_id
GROUP BY c.email
HAVING COUNT(cmd.commande_id) > 1
ORDER BY nombre_commandes DESC;
```

### Réponse 9
```sql
SELECT ROUND(AVG(montant_total), 2) AS panier_moyen
FROM commandes;
```

### Réponse 10
```sql
SELECT p.nom_produit,
       SUM(dc.quantite) AS quantite_totale_vendue,
       COUNT(DISTINCT dc.commande_id) AS nombre_commandes
FROM produits p
INNER JOIN details_commande dc ON p.produit_id = dc.produit_id
INNER JOIN marques m ON p.marque_id = m.marque_id
GROUP BY p.produit_id, p.nom_produit
ORDER BY quantite_totale_vendue DESC
LIMIT 3;
```

### Réponse 11
```sql
SELECT cmd.commande_id, c.email, cmd.date_commande,
       cmd.date_livraison_estimee, cmd.date_livraison_reelle,
       CASE WHEN cmd.date_livraison_reelle <= cmd.date_livraison_estimee
            THEN 'En avance ou à temps'
            ELSE 'En retard'
       END AS statut_livraison
FROM commandes cmd
INNER JOIN clients c ON cmd.client_id = c.client_id
WHERE cmd.statut = 'livree'
  AND cmd.date_livraison_reelle IS NOT NULL
ORDER BY cmd.statut;
```

### Réponse 12
```sql
SELECT cat.nom_categorie,
       COUNT(p.produit_id) AS nombre_produits,
       ROUND(AVG(p.prix), 2) AS prix_moyen
FROM categories cat
LEFT JOIN produits p ON cat.categorie_id = p.categorie_id
GROUP BY cat.categorie_id, cat.nom_categorie
ORDER BY nombre_produits DESC;
```

### Réponse 13
```sql
SELECT ville, COUNT(client_id) AS nombre_clients
FROM clients
GROUP BY ville
ORDER BY nombre_clients DESC;
```

### Réponse 14
```sql
SELECT p.produit_id, p.nom_produit
FROM produits p
LEFT JOIN avis_clients a ON p.produit_id = a.produit_id
WHERE a.avis_id IS NULL
ORDER BY p.date_ajout DESC;
```

### Réponse 15
```sql
SELECT YEAR(date_commande) AS annee,
       MONTH(date_commande) AS mois,
       DATE_FORMAT(date_commande, '%Y-%m') AS periode,
       ROUND(SUM(montant_total), 2) AS chiffre_affaires
FROM commandes
WHERE YEAR(date_commande) = 2024
GROUP BY YEAR(date_commande), MONTH(date_commande), DATE_FORMAT(date_commande, '%Y-%m')
ORDER BY annee, mois;
```

### Réponse 16
```sql
SELECT f.nom_fournisseur, COUNT(p.produit_id) AS nombre_produits
FROM fournisseurs f
INNER JOIN produits p ON f.fournisseur_id = p.fournisseur_id
GROUP BY f.nom_fournisseur
HAVING COUNT(p.produit_id) > 3
ORDER BY nombre_produits DESC;
```

### Réponse 17
```sql
SET @produit_ref = 1;
SET @prix_ref = (SELECT prix FROM produits WHERE produit_id = @produit_ref);

SELECT 
    p.nom_produit,
    p.prix,
    ROUND(((ABS(p.prix - @prix_ref) / @prix_ref) * 100), 2) AS pourcentage_difference
FROM produits p
WHERE p.categorie_id = (SELECT categorie_id FROM produits WHERE produit_id = @produit_ref)
  AND p.produit_id != @produit_ref
  AND p.prix BETWEEN (@prix_ref * 0.1) AND (@prix_ref * 2);
```

### Réponse 18
```sql
SELECT p.nom_produit, p.stock_quantite,
       COALESCE(SUM(dc.quantite), 0) AS quantite_vendue
FROM produits p
LEFT JOIN details_commande dc ON dc.produit_id = p.produit_id
GROUP BY p.produit_id
ORDER BY quantite_vendue DESC;
```

### Réponse 19
```sql
SELECT c.client_id, c.email, MAX(cmd.date_commande) AS derniere_commande
FROM clients c
LEFT JOIN commandes cmd ON c.client_id = cmd.client_id
GROUP BY c.client_id, c.email
HAVING MAX(cmd.date_commande) IS NULL
  OR MAX(cmd.date_commande) < DATE_SUB('2024-04-22', INTERVAL 1 MONTH)
ORDER BY derniere_commande ASC;
```

### Réponse 20
```sql
SELECT COUNT(*) as nombre_produits_en_promo,
       ROUND(AVG(prix), 2) AS prix_moyen,
       ROUND(AVG(prix_promotion), 2) AS prix_moyen_promotion,
       ROUND(AVG((prix - prix_promotion) / prix * 100), 2) AS taux_reduction_moyen
FROM produits
WHERE en_promotion = 1;
```