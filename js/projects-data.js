/* ==========================================================
   PROJECTS-DATA.JS | Le seul fichier à modifier pour ajouter ou changer un projet

   AJOUTER UN PROJET : copie un bloc dans PROJECTS, change l'id et les textes.
   Garde les projets d'une même section côte à côte (voir SECTIONS).

   Champs d'un projet
   id          numéro affiché ("17")
   category    "externe" | "iut" | "stage" | "perso" | "photo"
   topLabel    petit texte en haut de la carte
   aspect      ex. "16:9 // FICTION" (la partie avant // est affichée sur la carte)
   title       titre de la carte         modalTitle  titre dans la fiche (facultatif)
   roleBadge   rôle court (carte)        roleFull    rôle complet (fiche)
   upcoming    true si pas encore sorti (badge orange, vidéo "bientôt disponible")
   status      texte au-dessus du titre de la fiche (facultatif, utile si upcoming)
   cover       image de la carte (facultatif). Sinon : miniature YouTube ou 1re photo de la série
   coverPos    cadrage de la cover, ex. "50% 10%"  (horizontal vertical)
   type        "video" | "video-collection" | "gallery"
   media       video : lien YouTube, ou null si pas encore dispo
               gallery : liste de chemins d'images
   videos      (video-collection) liste de { title, media, cover }
   isVertical  true pour du 9:16
   span        (facultatif) force la largeur de la carte (4 à 12), sinon calcul via SECTIONS
   shortDesc   texte court (carte)       fullDesc    texte complet en HTML (fiche)
   tags        mots-clés (les 3 premiers s'affichent sur la carte)
   ========================================================== */

/* Options de cover : coverStyle: "logo" (fond blanc, image entière) et coverPad: "3rem 5rem" (marge autour du logo : plus elle est grande, plus le logo est petit) */
window.PORTFOLIO = {

    /* Blocs de la page Projets. Chaque section a son titre et son rythme de grille :
       pattern = largeurs successives des cartes (sur 12 colonnes), répétées en boucle. */
    SECTIONS: [
        { id: "video", title: "Productions Vidéo, Audiovisuel & Motion", meta: "FILMS, COURTS MÉTRAGES & PROJETS IUT", categories: ["externe", "iut"], pattern: [8, 4, 6, 6, 7, 5, 4, 8, 7, 5, 6, 6] },
        { id: "stage", title: "Réalisations en Stage (Entreprise)", meta: "PRODUCTIONS EN ENTREPRISE", categories: ["stage"], pattern: [6, 6] },
        { id: "photo", title: "Séries Photographiques & Plateau", meta: "PHOTOGRAPHIE", categories: ["photo"], pattern: [4, 4] }
        // Pour la catégorie "perso", ajoute une section ici (sinon ses projets tombent dans un bloc "Autres projets").
    ],

    /* Boutons de filtre. Un filtre sans projet est masqué automatiquement. */
    FILTERS: [
        { id: "all", label: "Tout voir" },
        { id: "externe", label: "Fictions & Festivals (Externe)" },
        { id: "iut", label: "Projets IUT" },
        { id: "stage", label: "Stage (Entreprise)" },
        { id: "perso", label: "Créations Perso" },
        { id: "photo", label: "Photographie" }
    ],

    /* Largeurs des cartes quand un filtre est actif */
    FILTERED_PATTERN: [8, 4, 6, 6, 7, 5, 12],

    /* Bande démo (bouton du hero). Mets le lien YouTube dans media quand elle est prête. */
    SHOWREEL: {
        title: "Bande Démo 2026",
        modalTitle: "Bande Démo 2026",
        roleFull: "Réalisation • Cadrage • Lumière • Montage • VFX",
        status: "SHOWREEL EN PRÉPARATION • SORTIE FIN D'ANNÉE",
        type: "video",
        media: null,
        fullDesc: "<p>Compilation de mes meilleurs travaux en réalisation, cadrage, lumière, prise de son, montage et effets visuels.</p>",
        tags: ["Showreel", "Audiovisuel", "Motion Design", "VFX"]
    },

    PROJECTS: [
        /* ---------- Fictions & Festivals (externe) ---------- */
        {
            id: "01", category: "externe",
            topLabel: "NIKON FILM FESTIVAL 2026", aspect: "16:9 // COURT MÉTRAGE",
            title: "Café sans sucre", modalTitle: "Café sans sucre — Nikon Film Festival 2026",
            roleBadge: "Chef Lumière", roleFull: "Rôle : Chef Lumière",
            coverPos: "50% 10%",
            type: "video", media: "https://youtu.be/UqNOgpvuaUI?si=7VhSYRAUTWJfU_a1",
            shortDesc: "Création de l'ambiance lumineuse du café avec le réalisateur, mise en place technique de l'« effet Ratatouille » et coordination de l'équipe lumière.",
            fullDesc: "<p>Sur ce court métrage réalisé pour le <strong>Nikon Film Festival 2026</strong>, j'ai occupé le poste de <strong>Chef Lumière</strong>.</p><p>En étroite collaboration avec le réalisateur, Nathan Bagnard, j'ai défini et composé l'ambiance lumineuse du café.</p>",
            tags: ["Nikon 2026", "Chef Lumière"]
        },
        {
            id: "02", category: "externe",
            topLabel: "FESTIVAL 3M", aspect: "16:9 // FICTION",
            title: "À sa place", modalTitle: "À sa place — Festival 3M",
            roleBadge: "Lumière & Son", roleFull: "Rôle : Technicien Lumière & Son",
            type: "video", media: "https://youtu.be/3f48psQdnBw?si=qUCtI423I3t9TGjH",
            shortDesc: "Technicien lumière et son sur ce court métrage pour le Festival 3M : installation des spots d'éclairage et prise de son réelle.",
            fullDesc: "<p>Dans le cadre du court métrage <strong>À sa place</strong>, réalisé par Nathan Bagnard pour le <strong>Festival 3M</strong>, je suis intervenu en tant que <strong>Technicien lumière et son</strong>.</p>",
            tags: ["Lumière", "Prise de son réelle", "Festival 3M"]
        },
        {
            id: "03", category: "externe", upcoming: true,
            topLabel: "MOYEN MÉTRAGE // SORTIE PROCHAINE", aspect: "16:9 // POST-PROD",
            title: "L'été prochain - Bientôt sur vos écrans !", modalTitle: "Moyen métrage : L'été prochain",
            roleBadge: "Son & Aide Lumière", roleFull: "Rôle : Ingénieur son (remplacement) & assistant lumière",
            status: "FILM EN POST-PRODUCTION • SORTIE PROCHAINE",
            type: "video", media: null,
            shortDesc: "Renfort sur 2 jours de tournage : remplacement de l'ingénieur son le 1er jour, puis aide à la lumière avec le chef opérateur.",
            fullDesc: "<p>Initialement non prévu au planning de ce moyen métrage indépendant, j'ai rejoint le plateau pour épauler Nathan Bagnard et l'équipe technique.</p>",
            tags: ["Perche & Son", "Assistant lumière", "Moyen métrage"]
        },
        {
            id: "04", category: "externe", upcoming: true,
            topLabel: "COURT MÉTRAGE // EN MONTAGE", aspect: "16:9 // POST-PROD",
            title: "La colocation du bonheur", modalTitle: "Court métrage : La colocation du bonheur",
            roleBadge: "Perchiste son", roleFull: "Rôle : Ingénieur & Technicien Son",
            status: "EN ATTENTE DE MONTAGE • SORTIE PROCHAINE",
            type: "video", media: null,
            shortDesc: "Prise en charge de la prise de son directe sur le plateau pour pallier un manque de matériel.",
            fullDesc: "<p>Prise en charge de la prise de son directe sur le plateau pour ce court métrage indépendant.</p>",
            tags: ["Ingénieur Son", "Prise directe", "Court métrage"]
        },

        /* ---------- Projets IUT ---------- */
        {
            id: "05", category: "iut",
            topLabel: "PROJET IUT // ÉVÉNEMENTIEL", aspect: "16:9 // CAPTATION",
            title: "Festival Terres d'Alsace", modalTitle: "Festival Terres d'Alsace",
            roleBadge: "Cadre, son & montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            type: "video", media: "https://youtu.be/KyzGwZqRhIo",
            shortDesc: "Projet de groupe IUT : prise de vue / cadrage sur le terrain lors de l'événement et montage dynamique.",
            fullDesc: "<p>Réalisé en groupe dans le cadre de l'IUT, ce projet met en valeur le <strong>Festival Terres d'Alsace</strong>.</p>",
            tags: ["Cadrage", "Montage", "Événementiel", "Projet IUT"]
        },
        {
            id: "06", category: "iut",
            topLabel: "PROJET IUT // PATRIMOINE", aspect: "16:9 // DOCU",
            title: "Le Château d'Andlau", modalTitle: "Le Château d'Andlau",
            roleBadge: "Montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            type: "video", media: "https://youtu.be/wzjWxmttxSY",
            shortDesc: "Valorisation vidéo du patrimoine alsacien en groupe.",
            fullDesc: "<p>Ce projet de groupe réalisé à l'IUT est consacré au <strong>Château d'Andlau</strong>.</p>",
            tags: ["Cadrage", "Montage", "Patrimoine", "Projet IUT"]
        },
        {
            id: "07", category: "iut",
            topLabel: "PROJET IUT // FICTION", aspect: "16:9 // FICTION",
            title: "La flûte enchantée", modalTitle: "Court métrage : La flûte enchantée",
            roleBadge: "Cadre, son & montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            type: "video", media: "https://youtu.be/JSIiT-n3Ikg",
            shortDesc: "Court métrage réalisé en groupe à l'IUT.",
            fullDesc: "<p>Exercice de fiction à l'IUT, <strong>La flûte enchantée</strong>.</p>",
            tags: ["Cadrage", "Montage", "Fiction", "Projet IUT"]
        },
        {
            id: "08", category: "iut",
            topLabel: "PROJET IUT // INTERVIEW", aspect: "16:9 // PORTRAIT",
            title: "Pépite ETENA x Émilie Mathis", modalTitle: "Pépite ETENA x Émilie Mathis",
            roleBadge: "Cadre, son & montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            coverPos: "50% 0%",
            type: "video", media: "https://youtu.be/CYhiVOYagxE?si=0S7v1gJtKh0VbVFp",
            shortDesc: "Portrait d'entrepreneure en groupe pour Pépite ETENA.",
            fullDesc: "<p>Portrait vidéo réalisé en partenariat avec <strong>Pépite ETENA</strong>.</p>",
            tags: ["Cadrage", "Montage", "Interview", "Projet IUT"]
        },
        {
            id: "09", category: "iut",
            topLabel: "PROJET IUT // REPORTAGE", aspect: "16:9 // TERRAIN",
            title: "Reportage Restos du Cœur", modalTitle: "Reportage : Les Restos du Cœur",
            roleBadge: "Cadre, son & montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            coverPos: "50% 60%",
            type: "video", media: "https://youtu.be/DAiLXDxhzC0",
            shortDesc: "Reportage de terrain réalisé en groupe pour les Restos du Cœur.",
            fullDesc: "<p>Reportage de terrain réalisé en groupe avec l'IUT.</p>",
            tags: ["Cadrage", "Montage", "Reportage", "Projet IUT"]
        },
        {
            id: "10", category: "iut",
            topLabel: "PROJET IUT // CONCOURS", aspect: "16:9 // CAPSULE",
            title: "Je filme ma formation", modalTitle: "Je filme ma formation",
            roleBadge: "Cadre, son & assistant montage", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            type: "video", media: "https://youtu.be/4NZXdPVdRss",
            shortDesc: "Concours national « Je filme ma formation ».",
            fullDesc: "<p>Concours national <strong>Je filme ma formation</strong>.</p>",
            tags: ["Cadrage", "Montage", "Concours", "Projet IUT"]
        },
        {
            id: "11", category: "iut",
            topLabel: "PROJET IUT // TUTORIEL", aspect: "16:9 // STUDIO",
            title: "Tuto : Lumix GH5", modalTitle: "Tuto : Panasonic Lumix GH5",
            roleBadge: "Cadre, montage & voix-off", roleFull: "Rôle : Cadreur & Monteur (Projet de groupe IUT)",
            type: "video", media: "https://youtu.be/OQcB5sWREcg",
            shortDesc: "Capsule pédagogique en groupe sur l'utilisation du boîtier Panasonic Lumix GH5.",
            fullDesc: "<p>Tutoriel autour du boîtier <strong>Panasonic Lumix GH5</strong>.</p>",
            tags: ["Cadrage", "Montage", "Tutoriel", "Lumix GH5"]
        },
        {
            id: "12", category: "iut",
            topLabel: "PROJET IUT // MOTION & VFX", aspect: "16:9 // COMPOSITING",
            title: "Agir pour demain", modalTitle: "Motion Design : Agir pour demain",
            roleBadge: "Motion Design", roleFull: "Rôle : Motion Designer",
            type: "video", media: "https://youtu.be/DxdlnD8Y3vE",
            shortDesc: "Création d'une vidéo en motion design pour informer sur la pollution des océans.",
            fullDesc: "<p>Vidéo en motion design réalisée avec des dessins de <a href='https://www.instagram.com/swarile24/' target='_blank' rel='noopener' class='inline-social-link'>Laurie Schmitt (@swarile24) ↗</a>.</p>",
            tags: ["Motion Design", "VFX", "Projet IUT"]
        },

        /* ---------- Stage (entreprise) ---------- */
        {
            id: "13", category: "stage",
            topLabel: "STAGE ENTREPRISE // COLLECTION YOUTUBE", aspect: "16:9 // MULTI-VIDÉOS",
            title: "Productions YouTube (Stage)", modalTitle: "Stage : Productions YouTube (16:9)",
            roleBadge: "Stage • Vidéaste", roleFull: "Rôle : Cadrage, Montage & Habillage (Stage)",
            cover: "assets/images/cover-orisae.png", coverStyle: "logo", coverPad: "3rem 5rem",
            type: "video-collection", isVertical: false,
            videos: [
                { title: "Kéfir de fruit", media: "https://youtu.be/mLmsmlmwro0?si=6SKYl0u4jNknkqZV" },
                { title: "Kombucha", media: "https://youtu.be/TBTcgDIIg20?si=uImxBo9jKdUD9E-L" },
                { title: "Kéfir de lait", media: "https://youtu.be/WP8DdC-_lCw?si=BB2G34tL5fuu_D44" },
                { title: "Réhydration des grains", media: "https://youtu.be/YLGq493CEcs?si=8gaXbNc0CdUJ9GiZ" }
            ],
            shortDesc: "Tutoriels vidéo de préparation de kéfir et de kombucha.",
            fullDesc: "<p>Durant le stage, j'ai eu à charge de créer des vidéos tutoriels à destination du site internet pour apprendre à faire son propre kéfir et/ou kombucha.</p><p><strong>1ère vidéo :</strong> Préparation du kéfir de fruit</p><p><strong>2ème vidéo :</strong> Préparation du kombucha</p><p><strong>3ème vidéo :</strong> Préparation du kéfir de lait</p><p><strong>4ème vidéo :</strong> Réhydratation des grains de kéfir de fruit</p>",
            tags: ["Stage", "YouTube", "16:9", "Montage"]
        },
        {
            id: "14", category: "stage",
            topLabel: "STAGE ENTREPRISE // COLLECTION REELS", aspect: "9:16 // MULTI-REELS",
            title: "Reels Instagram (Stage)", modalTitle: "Stage : Reels & Formats Verticaux (9:16)",
            roleBadge: "Stage • Reels 9:16", roleFull: "Rôle : Cadrage Vertical, Montage & Motion (Stage)",
            cover: "assets/images/cover-myscoby.svg", coverStyle: "logo", coverPad: "3rem 5rem",
            type: "video-collection", isVertical: true,
            instaAccountUrl: "https://www.instagram.com/myscoby/",
            videos: [
                { title: "Reel Instagram #01", media: "https://www.instagram.com/reel/DXcUI70td5v/", cover: "assets/images/reels/reel-01-kombucha.png" },
                { title: "Reel Instagram #02", media: "https://www.instagram.com/reel/DXrtWE4tU13/", cover: "assets/images/reels/reel-02-explosion.png" },
                { title: "Reel Instagram #03", media: "https://www.instagram.com/reel/DXzU-62t9_y/", cover: "assets/images/reels/reel-03-fraise.png" },
                { title: "Reel Instagram #04", media: "https://www.instagram.com/reel/DYAQaM7NwB9/", cover: "assets/images/reels/reel-04-bienfaits.png" },
                { title: "Reel Instagram #05", media: "https://www.instagram.com/reel/DYKSZhrtSyf/", cover: "assets/images/reels/reel-05-annonce.png" },
                { title: "Reel Instagram #06", media: "https://www.instagram.com/reel/DYSOfw8tVIv/", cover: "assets/images/reels/reel-06-bebe.png" },
                { title: "Reel Instagram #07", media: "https://www.instagram.com/reel/DYm01fdtM5q/", cover: "assets/images/reels/reel-07-foire.png" },
                { title: "Reel Instagram #08", media: "https://www.instagram.com/reel/DYujL9mtn_K/", cover: "assets/images/reels/reel-08-sureau.png" },
                { title: "Reel Instagram #09", media: "https://www.instagram.com/reel/DY42cHbNKjw/", cover: "assets/images/reels/reel-09-acacia.png" },
                { title: "Reel Instagram #10", media: "https://www.instagram.com/reel/DZK3_hmNy0f/", cover: "assets/images/reels/reel-10-glace.png" }
            ],
            shortDesc: "Vidéos verticales 9:16 conçues pour le compte Instagram de l'entreprise.",
            fullDesc: "<p>Ensemble des Reels et formats verticaux (9:16) imaginés, cadrés et montés en stage.</p>",
            tags: ["Stage", "Instagram Reels", "Format 9:16", "Social Media"]
        },

        /* ---------- Photographie ---------- */
        {
            id: "15", category: "photo",
            topLabel: "PHOTOGRAPHIE // SPORT", aspect: "3:2 // RAW",
            title: "Formule 1", modalTitle: "Série photo : Grand Prix de Spa-Francorchamps 2026",
            roleBadge: "Photographie", roleFull: "Rôle : Photographe",
            type: "gallery",
            media: [
                "assets/photos/f1-spa-01.jpg",
                "assets/photos/f1-spa-02.jpg",
                "assets/photos/f1-spa-03.jpg",
                "assets/photos/f1-spa-04.jpg",
                "assets/photos/f1-spa-05.jpg"
            ],
            shortDesc: "Quelques prises de vue lors du Grand Prix de Spa-Francorchamps.",
            fullDesc: "<p>Série photographique dédiée au Grand Prix de Spa-Francorchamps.</p>",
            tags: ["F1", "Grand Prix", "Edition", "ZVE10 M2"]
        },
        {
            id: "16", category: "photo",
            topLabel: "PHOTOGRAPHIE // SHOOTING", aspect: "3:2 // REPORTAGE",
            title: "Ammer's Wackes", modalTitle: "Série Photo : Shooting Ammer's Wackes",
            roleBadge: "Photographie", roleFull: "Rôle : Photographe",
            cover: "assets/photos/ammers-wackes-05.jpg", coverPos: "50% 35%",
            type: "gallery",
            media: [
                "assets/photos/ammers-wackes-01.jpg",
                "assets/photos/ammers-wackes-02.jpg",
                "assets/photos/ammers-wackes-03.jpg",
                "assets/photos/ammers-wackes-04.jpg",
                "assets/photos/ammers-wackes-05.jpg",
                "assets/photos/ammers-wackes-06.jpg"
            ],
            shortDesc: "Réalisation d'un shooting photo avec les musiciens du groupe Ammer's Wackes.",
            fullDesc: "<p>Shooting photo du groupe avec <strong>Louis Ruhlmann</strong> au tuba, <strong>Mathieu Habold</strong> et <strong>Hélène Hohlmann</strong> à l'euphonium, <strong>Axel Bohn</strong> au saxophone ainsi que <strong>Louis Vattement</strong> à la batterie.</p>",
            tags: ["Cadrage", "Photo", "Edition", "Panasonic FZ-300"]
        }
    ]
};