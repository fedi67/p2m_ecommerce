-- -----------------------------------------------------
-- 1. NETTOYAGE FORCÉ
-- -----------------------------------------------------
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
-- -----------------------------------------------------

-- -----------------------------------------------------
-- 2. TABLE PARENT : Produits
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    image_url TEXT,
    attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------------
-- 3. TABLE ENFANT : Variantes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20),
    color VARCHAR(50),
    color_hex VARCHAR(7),
    price DECIMAL(10, 2) NOT NULL,
    promo_price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(50) UNIQUE
);

-- -----------------------------------------------------
-- 4. INDEX
-- -----------------------------------------------------
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

-- -----------------------------------------------------
-- 5. JEU DE DONNÉES NETTOYÉ (36 Produits)
-- -----------------------------------------------------

-- PRODUIT 1 : Robe
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(1, 'Robe Fleurie Bohème', 'Mango', 'Robe', 'Une robe légère parfaite pour les journées ensoleillées.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', '{ "style": "Bohème", "saison": "Eté", "motif": "Fleurs", "longueur": "Mi-longue", "matiere": "Viscose" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(1, 'S', 'Rouge Corail', '#FF7F50', 49.99, 5, 'MNGO-ROBE-S'), (1, 'M', 'Rouge Corail', '#FF7F50', 49.99, 12, 'MNGO-ROBE-M'), (1, 'L', 'Rouge Corail', '#FF7F50', 49.99, 20, 'MNGO-ROBE-L');

-- PRODUIT 2 : Parka (Image corrigée : Manteau d'hiver)
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(2, 'Parka Grand Froid', 'North Face', 'Manteau', 'Protection extrême pour les hivers rigoureux.', 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500', '{ "style": "Sport", "saison": "Hiver", "temperature": "Extreme", "impermeable": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(2, 'L', 'Noir', '#000000', 299.00, 250.00, 3, 'NF-PARKA-BLK-L'), (2, 'XL', 'Kaki', '#556B2F', 299.00, NULL, 8, 'NF-PARKA-GRN-XL');

-- PRODUIT 3 : Costume
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(3, 'Costume Slim Fit Bleu Nuit*', 'Hugo Boss', 'Costume', 'Élégance moderne pour le bureau ou les cérémonies.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500', '{ "style": "Chic", "occasion": ["Travail", "Mariage"], "coupe": "Cintrée", "matiere": "Laine Vierge" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(3, '50', 'Bleu Nuit', '#191970', 450.00, 2, 'HB-SUIT-BLU-50'), (3, '52', 'Bleu Nuit', '#191970', 450.00, 5, 'HB-SUIT-BLU-52');

-- PRODUIT 4 : Sneakers
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(4, 'Air Jordan 1 High Retro', 'Nike', 'Chaussures', 'La basket iconique du style urbain.', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500', '{ "style": "Streetwear", "type": "Basket Montante", "collection": "Retro", "materiau": "Cuir" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(4, '42', 'Rouge/Blanc', '#FF0000', 180.00, 15, 'NK-JD1-RED-42'), (4, '43', 'Rouge/Blanc', '#FF0000', 180.00, 10, 'NK-JD1-RED-43');

-- PRODUIT 5 : Sac
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(5, 'Sac Cabas Classique', 'Gucci', 'Accessoires', 'Un sac intemporel en cuir véritable.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', '{ "style": "Luxe", "genre": "Femme", "matiere": "Cuir", "taille": "Grand" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(5, 'Unique', 'Marron', '#8B4513', 1200.00, 2, 'GCC-BAG-BRN');

-- PRODUIT 6 : Hoodie One Piece
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(6, 'Hoodie One Piece Crew', 'AnimeWear', 'Homme', 'Sweat à capuche confortable avec imprimé manga.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', '{ "style": "Streetwear", "motif": "Manga", "anime": "One Piece", "capuche": true, "saison": "Mi-saison" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(6, 'L', 'Noir', '#000000', 55.00, 20, 'OP-HOODIE-BLK-L'), (6, 'XL', 'Noir', '#000000', 55.00, 14, 'OP-HOODIE-BLK-XL');

-- PRODUIT 7 : Robe de Soirée
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(7, 'Robe de Cocktail Satinée', 'Zara', 'Femme', 'Robe mi-longue en satin, idéale pour les soirées élégantes.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', '{ "style": "Glamour", "occasion": ["Soirée", "Cocktail", "Date"], "matiere": "Satin", "longueur": "Mi-longue", "saison": "Toutes" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(7, 'S', 'Vert Émeraude', '#50C878', 89.90, 8, 'ZARA-SATIN-GRN-S'), (7, 'M', 'Vert Émeraude', '#50C878', 89.90, 2, 'ZARA-SATIN-GRN-M');

-- PRODUIT 8 : Robe Pull
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(8, 'Robe Pull en Maille', 'H&M', 'Femme', 'Chaude et confortable, avec un col roulé pour l''hiver.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500', '{ "style": "Casual", "saison": "Hiver", "matiere": "Laine", "col": "Roulé", "confort": "Maximum" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(8, 'M', 'Beige', '#F5F5DC', 39.99, 20, 'HM-KNIT-BEI-M'), (8, 'L', 'Beige', '#F5F5DC', 39.99, 15, 'HM-KNIT-BEI-L');

-- PRODUIT 9 : Robe Chemise
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(9, 'Robe Chemise Ceinturée', 'Massimo Dutti', 'Femme', 'Une coupe structurée parfaite pour le bureau.', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500', '{ "style": "Business Casual", "occasion": "Bureau", "coupe": "Cintrée", "matiere": "Coton" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(9, '38', 'Bleu Ciel', '#87CEEB', 79.00, 5, 'MD-SHIRT-BLU-38');

-- PRODUIT 10 : Jean Slim
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(10, 'Jean Slim Brut', 'Levis', 'Homme', 'Le jean indémodable qui va avec tout.', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500', '{ "style": "Casual", "coupe": "Slim", "matiere": "Denim", "extensible": "Non" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(10, '32', 'Indigo', '#4B0082', 99.00, 79.00, 30, 'LVS-JEAN-IND-32');

-- PRODUIT 11 : Legging de Yoga
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(11, 'Legging Haute Performance', 'Lululemon', 'Sport', 'Tissu respirant pour le yoga et le fitness.', 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500', '{ "style": "Sport", "activite": ["Yoga", "Gym", "Running"], "matiere": "Elasthanne", "respirant": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(11, 'S', 'Noir', '#000000', 88.00, 10, 'LULU-LEG-BLK-S');

-- PRODUIT 12 : Veste en Jean
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(12, 'Veste Denim Vintage', 'VintageStore', 'Mixte', 'Veste en jean délavée style années 90.', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', '{ "style": "Vintage", "saison": "Mi-saison", "matiere": "Denim", "coupe": "Oversize" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(12, 'L', 'Bleu Délavé', '#ADD8E6', 65.00, 1, 'VINT-JKT-BLU-L');

-- PRODUIT 13 : Montre Connectée
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(13, 'SmartWatch Series 5', 'TechBrand', 'Accessoires', 'Suivez votre santé et vos notifications.', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', '{ "style": "Tech", "genre": "Mixte", "fonction": ["Santé", "GPS"], "couleur": "Noir" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(13, 'Unique', 'Noir Mat', '#2F4F4F', 250.00, 50, 'TECH-WATCH-BLK');

-- PRODUIT 14 : Bottines en Cuir
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(14, 'Chelsea Boots Cuir', 'Dr. Martens', 'Chaussures', 'Bottines robustes et élégantes pour l''automne/hiver.', 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=500', '{ "style": "Rock/Chic", "saison": ["Automne", "Hiver"], "matiere": "Cuir", "type": "Boots" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(14, '43', 'Marron Foncé', '#654321', 140.00, 6, 'DOC-BOOT-BRN-43');

-- PRODUIT 15 : T-shirt Basique Blanc
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(15, 'T-Shirt Coton Bio', 'Uniqlo', 'Homme', 'Le basique indispensable, 100% coton.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', '{ "style": "Basique", "matiere": "Coton Bio", "col": "Rond", "saison": "Eté" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(15, 'L', 'Blanc', '#FFFFFF', 15.00, 100, 'UNI-TEE-WHT-L');

-- PRODUIT 16 : Casquette
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(16, 'Casquette NY', 'New Era', 'Accessoires', 'Casquette officielle style urbain.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', '{ "style": "Streetwear", "type": "Casquette", "logo": "Brode", "reglable": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(16, 'Unique', 'Bleu Marine', '#000080', 25.00, 15, 'NY-CAP-NAVY');

-- PRODUIT 17 : Chemise en Lin
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(17, 'Chemise Légère en Lin', 'Ralph Lauren', 'Homme', 'La chemise respirante indispensable pour l''été.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', '{ "style": "Casual Chic", "saison": "Eté", "matiere": "Lin", "occasion": ["Mariage", "Plage", "Bureau"] }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(17, 'L', 'Blanc', '#FFFFFF', 89.00, 15, 'RL-LINEN-WHT-L');

-- PRODUIT 18 : Trench Coat
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(18, 'Trench Coat Beige Classique', 'Burberry', 'Femme', 'L''icône de la mi-saison, imperméable et élégant.', 'https://images.unsplash.com/photo-1620137158758-d4469a473e3a?w=500', '{ "style": "Classique", "saison": ["Automne", "Printemps"], "impermeable": true, "ceinture": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(18, 'M', 'Beige', '#F5F5DC', 850.00, 3, 'BUR-TRCH-BEI-M');

-- PRODUIT 19 : Short de Sport
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(19, 'Short Running DryFit', 'Nike', 'Sport', 'Short léger pour la course à pied et le cardio.', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', '{ "style": "Sport", "activite": ["Running", "Fitness"], "respirant": true, "longueur": "Court" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(19, 'L', 'Gris', '#808080', 35.00, 25.00, 50, 'NK-RUN-GRY-L');

-- PRODUIT 20 : Lunettes de Soleil
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(20, 'Lunettes Aviator', 'Ray-Ban', 'Accessoires', 'Style pilote intemporel avec protection UV400.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', '{ "style": "Vintage", "protection": "UV400", "forme": "Aviateur", "genre": "Mixte" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(20, 'Unique', 'Doré', '#FFD700', 140.00, 10, 'RB-AVIATOR-GLD');

-- PRODUIT 21 : Blazer Femme (Image corrigée : Blazer)
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(21, 'Blazer Cintré Noir', 'Zara', 'Femme', 'Une coupe ajustée pour un look professionnel immédiat.', 'https://images.unsplash.com/photo-1548624313-0396c75e4e1a?w=500', '{ "style": "Business", "occasion": ["Bureau", "Entretien"], "coupe": "Cintrée", "couleur": "Noir" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(21, '38', 'Noir', '#000000', 59.95, 20, 'ZARA-BLZ-BLK-38');

-- PRODUIT 22 : Maillot de Bain
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(22, 'Maillot Une Pièce Sculptant', 'Etam', 'Femme', 'Maillot de bain élégant pour la plage ou la piscine.', 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?w=500', '{ "style": "Plage", "saison": "Eté", "type": "Maillot 1 pièce", "sechage_rapide": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(22, 'M', 'Bleu Marine', '#000080', 45.00, 0, 'ETAM-SWIM-NAV-M');

-- PRODUIT 23 : Bonnet en Laine
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(23, 'Bonnet Côtelé Merino', 'Patagonia', 'Accessoires', 'Chaleur et douceur pour les jours froids.', 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', '{ "style": "Casual", "saison": "Hiver", "matiere": "Laine Mérinos", "genre": "Mixte" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(23, 'Unique', 'Gris Chiné', '#A9A9A9', 29.00, 100, 'PAT-BEANIE-GRY');

-- PRODUIT 24 : Escarpins
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(24, 'Escarpins Vernis', 'Louboutin', 'Chaussures', 'L''élégance ultime pour vos soirées de gala.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', '{ "style": "Glamour", "occasion": "Soirée", "talon": "Haut", "matiere": "Cuir Vernis" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(24, '38', 'Rouge', '#FF0000', 650.00, 2, 'LOU-PUMP-RED-38');

-- PRODUIT 25 : Polo Homme
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(25, 'Polo Piqué Classique', 'Lacoste', 'Homme', 'Le polo iconique en petit piqué de coton.', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', '{ "style": "Sport Chic", "occasion": ["Golf", "Week-end"], "matiere": "Coton", "manches": "Courtes" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(25, 'L', 'Vert', '#008000', 95.00, 15, 'LAC-POLO-GRN-L');

-- PRODUIT 26 : Sac à Dos
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(26, 'Sac à Dos Laptop', 'Herschel', 'Accessoires', 'Compartiment rembourré pour ordinateur 15 pouces.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', '{ "style": "Urbain", "fonction": "Travail", "ordinateur": true, "volume": "20L" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(26, 'Unique', 'Gris', '#808080', 75.00, 8, 'HER-BAG-GRY');

-- PRODUIT 27 : Pyjama Soie
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(27, 'Ensemble Pyjama Satin', 'Victoria Secret', 'Femme', 'Douceur et confort pour vos nuits.', 'https://images.unsplash.com/photo-1594803730799-75a85c889a74?w=500', '{ "style": "Cocooning", "usage": "Nuit", "matiere": "Satin", "saison": "Toutes" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(27, 'M', 'Rose Poudré', '#FFC0CB', 65.00, 12, 'VS-PJ-PNK-M');

-- PRODUIT 28 : Blouson Bomber (Image corrigée : Bomber jacket)
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(28, 'Bomber Jacket Aviator', 'Alpha Industries', 'Homme', 'Le blouson militaire revisité pour la ville.', 'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500', '{ "style": "Streetwear", "saison": "Mi-saison", "coupe": "Oversize", "fermeture": "Zip" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(28, 'L', 'Kaki', '#556B2F', 149.00, 6, 'ALP-BOMB-GRN-L');

-- PRODUIT 29 : Ceinture Cuir
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(29, 'Ceinture Cuir Pleine Fleur', 'Timberland', 'Accessoires', 'Robuste et élégante, va avec tout.', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500', '{ "style": "Casual", "matiere": "Cuir", "genre": "Homme", "largeur": "4cm" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(29, '100cm', 'Marron', '#8B4513', 45.00, 20, 'TIM-BELT-BRN');

-- PRODUIT 30 : Jupe Plissée
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(30, 'Jupe Midi Plissée', 'Uniqlo', 'Femme', 'Élégance fluide, parfaite avec un pull ou une chemise.', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', '{ "style": "Chic", "longueur": "Midi", "motif": "Uni", "saison": "Printemps" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(30, 'M', 'Bleu Nuit', '#191970', 39.90, 8, 'UNI-SKIRT-BLU-M');

-- PRODUIT 31 : Sweat à Capuche Gym
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(31, 'Hoodie Crop Top', 'Gymshark', 'Sport', 'Coupe courte tendance pour l''échauffement.', 'https://images.unsplash.com/photo-1556906781-9a412961d28c?w=500', '{ "style": "Sport", "coupe": "Crop", "saison": "Toutes", "activite": "Gym" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(31, 'S', 'Lavande', '#E6E6FA', 45.00, 15, 'GYM-HOOD-PUR-S');

-- PRODUIT 32 : Chino
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(32, 'Pantalon Chino Stretch', 'Dockers', 'Homme', 'L''alternative confortable au jean pour le bureau.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', '{ "style": "Smart Casual", "occasion": "Travail", "coupe": "Slim", "matiere": "Coton" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(32, '32', 'Sable', '#F4A460', 79.00, 59.00, 10, 'DOC-CHINO-SND-32');

-- PRODUIT 33 : Écharpe Cachemire
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(33, 'Écharpe 100% Cachemire', 'Burberry', 'Accessoires', 'Luxe et chaleur ultime.', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', '{ "style": "Luxe", "saison": "Hiver", "matiere": "Cachemire", "motif": "Carreaux" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(33, 'Unique', 'Beige Check', '#F5F5DC', 350.00, 4, 'BUR-SCARF-CHK');

-- PRODUIT 34 : Sandales Cuir (Image corrigée : Sandales)
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(34, 'Sandales Spartiates', 'Tropezienne', 'Chaussures', 'Sandales en cuir idéales pour les vacances.', 'https://images.unsplash.com/photo-1560343776-9aa8f24b2bb9?w=500', '{ "style": "Bohème", "saison": "Eté", "matiere": "Cuir", "type": "Plat" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(34, '39', 'Or', '#FFD700', 55.00, 10, 'TRP-SAND-GLD-39');

-- PRODUIT 35 : Cravate Soie
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(35, 'Cravate Soie Unie', 'Hermès', 'Accessoires', 'La touche finale pour vos costumes.', 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500', '{ "style": "Formal", "occasion": ["Travail", "Mariage"], "matiere": "Soie", "largeur": "7cm" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(35, 'Unique', 'Bleu Roi', '#4169E1', 180.00, 5, 'HER-TIE-BLU');

-- PRODUIT 36 : Doudoune Sans Manches (Image corrigée : Doudoune)
INSERT INTO products (id, name, brand, category, description, image_url, attributes) VALUES 
(36, 'Gilet Matelassé Ultraléger', 'Uniqlo', 'Homme', 'Chaud mais compact, se porte sous un manteau.', 'https://images.unsplash.com/photo-1555274175-75f4056dc6ed?w=500', '{ "style": "Casual", "saison": ["Automne", "Hiver"], "fonction": "Thermique", "compact": true }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(36, 'M', 'Bleu Marine', '#000080', 49.90, 25, 'UNI-VEST-NAV-M');

-- Mettre à jour les séquences pour éviter les erreurs lors des futurs ajouts manuels
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));

SELECT '36 Produits nettoyés et chargés avec succès !' as status;