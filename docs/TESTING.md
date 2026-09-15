# Plan de certification v0.1

## Contrôles automatiques

- présence des fichiers nécessaires ;
- syntaxe JavaScript ;
- absence d’API réseau dans le moteur ;
- présence des mentions de confidentialité et de SynthID ;
- métadonnées essentielles de la page.

## Matrice d’images

Pour chaque fichier de référence Gemini :

1. relever le format, les dimensions et la taille ;
2. mesurer la boîte englobante du watermark ;
3. vérifier la détection sans faux positif hors de la zone attendue ;
4. exporter à la résolution d’origine ;
5. comparer visuellement l’original et le résultat à 100 % et 400 % ;
6. confirmer qu’aucune requête réseau ne contient le média ;
7. consigner le résultat : réussi, partiel ou refus conservateur.

## Cas négatifs

- image sans watermark ;
- watermark déplacé ou redimensionné ;
- image recompressée ;
- fichier non pris en charge ;
- fichier supérieur à 25 Mo ;
- fichier corrompu.

## Condition de fusion

La PR v0.1 ne doit être fusionnée qu’après réussite du workflow, certification sur les images de référence et mise à jour de Notion.
