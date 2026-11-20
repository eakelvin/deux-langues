import { Note, Scene } from "./types";

export const TOPIC =
    "Le télétravail a-t-il vraiment amélioré la qualité de vie, ou a-t-il surtout brouillé la frontière entre le travail et la maison ? Donne ton avis, avec un exemple concret.";

export const SAMPLE = `Selon moi, le télétravail a beaucoup améliorer la qualité de vie.
Pourtant, la frontière entre le travail et la maison sont devenue trop mince.
Les gens répond à des messages tard le soir, sans vraiment décrocher.
Je crois qu'il faut des règles simples, sinon cette liberté nous épuise.`;

export const SAMPLE_CORRECTIONS = [
    {
        original:
            "Selon moi, le télétravail a beaucoup améliorer la qualité de vie.",
        corrected:
            "Selon moi, le télétravail a beaucoup amélioré la qualité de vie.",
        reason: "Après « a », le verbe se met au participe : amélioré.",
    },
    {
        original:
            "Pourtant, la frontière entre le travail et la maison sont devenue trop mince.",
        corrected:
            "Pourtant, la frontière entre le travail et la maison est devenue trop mince.",
        reason: "On parle d’une seule frontière, donc « est devenue ».",
    },
    {
        original:
            "Les gens répond à des messages tard le soir, sans vraiment décrocher.",
        corrected:
            "Les gens répondent à des messages tard le soir, sans vraiment décrocher.",
        reason: "« Les gens » demande le pluriel : répondent.",
    },
    {
        original:
            "Je crois qu'il faut des règles simples, sinon cette liberté nous épuise.",
        corrected:
            "Je crois qu'il faut des règles simples, sinon cette liberté nous épuise.",
        reason: "Rien à reprendre. C’est net.",
    },
];

export const FULL_CORRECTION =
    "Selon moi, le télétravail a beaucoup amélioré la qualité de vie. Pourtant, la frontière entre le travail et la maison est devenue trop mince. Les gens répondent à des messages tard le soir, sans vraiment décrocher. Je crois qu'il faut des règles simples, sinon cette liberté nous épuise.";

export const SCENES: Scene[] = [
    {
        id: "restaurant",
        label: "Restaurant",
        you: "the customer",
        partner: "the waiter",
        opening: "Bonsoir. Une table près de la fenêtre est libre.",
        turns: [
            {
                said: "Bonsoir, j'ai réserver une table pour deux au nom de Martin.",
                corrected: "Bonsoir, j'ai réservé une table pour deux au nom de Martin.",
                reason: "Après « ai », on met le participe passé : réservé.",
                reply: "La table est à vous. Je pose les cartes et une carafe d'eau.",
            },
            {
                said: "On va prendre le menu du soir, et les enfants est allergique aux noix.",
                corrected:
                    "On va prendre le menu du soir, et les enfants sont allergiques aux noix.",
                reason: "« Les enfants » est au pluriel : sont allergiques.",
                reply: "C'est noté pour les noix. Le menu arrive avec du pain.",
            },
            {
                said: "Parfait, on commence par les entrées.",
                corrected: "Parfait, on commence par les entrées.",
                reason: "Rien à reprendre. C'est net.",
                reply: "Je les envoie en cuisine. Prenez le temps.",
            },
        ],
    },
    {
        id: "shop",
        label: "Clothes shop",
        you: "the customer",
        partner: "the assistant",
        opening: "Bonjour. Les manteaux d'hiver sont sur la gauche.",
        turns: [
            {
                said: "Je cherche un manteau, mais je ne sais pas quel taille prendre.",
                corrected: "Je cherche un manteau, mais je ne sais pas quelle taille prendre.",
                reason: "« Taille » est féminin : quelle taille.",
                reply: "Les tailles vont du 36 au 44. Le bleu marine est doux et chaud.",
            },
            {
                said: "Celui-ci me plait, je le prend.",
                corrected: "Celui-ci me plaît, je le prends.",
                reason: "« Plaît » prend un accent, et avec « je » on dit prends.",
                reply: "Il vous va bien. Je le mets de côté pendant que vous regardez le reste.",
            },
        ],
    },
];

export const STARTER: Note[] = [
    {
        id: "reserve",
        phrase: "j'ai réserver",
        correction: "j'ai réservé",
        example: "J'ai réservé une table pour ce soir.",
        date: "Nov 18",
        practiced: 0,
        learned: false,
    },
    {
        id: "enfants",
        phrase: "les enfants est allergique",
        correction: "les enfants sont allergiques",
        example: "Les enfants sont allergiques aux noix.",
        date: "Nov 18",
        practiced: 1,
        learned: false,
    },
    {
        id: "taille",
        phrase: "quel taille",
        correction: "quelle taille",
        example: "Je ne sais pas quelle taille prendre.",
        date: "Nov 16",
        practiced: 2,
        learned: false,
    },
    {
        id: "prends",
        phrase: "je le prend",
        correction: "je le prends",
        example: "Celui-ci me plaît, je le prends.",
        date: "Nov 16",
        practiced: 0,
        learned: false,
    },
    {
        id: "ameliore",
        phrase: "beaucoup améliorer",
        correction: "beaucoup amélioré",
        example: "Le télétravail a beaucoup amélioré sa semaine.",
        date: "Nov 12",
        practiced: 3,
        learned: true,
    },
];

export const PASSAGE = `Depuis quelques années, le télétravail a cessé d'être une exception. Il est devenu une façon ordinaire d'organiser la semaine. On y gagne un temps précieux, autrefois perdu dans les transports, et une liberté nouvelle : choisir le silence du matin, ouvrir la fenêtre, déjeuner chez soi. Pourtant cette souplesse a un prix que l'on mesure trop tard. La journée ne se ferme plus vraiment. Un message arrive après le dîner, une réunion glisse vers vingt heures, et la maison, qui devrait rester un refuge, se transforme en annexe du bureau.

Le plus difficile n'est pas la technique. C'est la limite. Sans horaires clairs, la liberté se change en disponibilité permanente. On répond vite, pour se montrer sérieux, puis on n'arrive plus à décrocher. Les entreprises qui réussissent le télétravail ne sont pas celles qui offrent le plus de jours à distance. Ce sont celles qui protègent le droit de s'arrêter. Une règle simple suffit : le soir, le travail s'arrête, même si l'ordinateur reste allumé dans la pièce d'à côté.`;

export const EXPRESSIONS = [
    { phrase: "un refuge", meaning: "a place you can retreat to" },
    { phrase: "une annexe du bureau", meaning: "an extra room of the office" },
    { phrase: "se changer en", meaning: "to turn into" },
    { phrase: "décrocher", meaning: "to switch off from work" },
    { phrase: "à distance", meaning: "remotely" },
    { phrase: "le droit de s'arrêter", meaning: "the right to stop" },
];

export const POINTS = [
    { date: "Nov 4", rate: 14 },
    { date: "Nov 7", rate: 11 },
    { date: "Nov 10", rate: 9 },
    { date: "Nov 13", rate: 8 },
    { date: "Nov 17", rate: 5 },
];

export const FIRST = {
    date: "Nov 4",
    rate: 14,
    quote: "Euh, ben, je voulais dire que, tu vois, c’est compliqué. Enfin, bah, oui.",
};

export const LATEST = {
    date: "Nov 17",
    rate: 5,
    quote: "Je voulais dire que c’est encore un peu flou, euh, mais l’idée est là.",
};