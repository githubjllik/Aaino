const quotes = {
    '01-01': {
        text: "Que cette nouvelle année soit le début d'un nouveau chapitre rempli de rires, de succès et de moments inoubliables. Bonne année!",
        background: "linear-gradient(to right, #2193b0, #6dd5ed)"
    },
    '02-14': {
        text: "L'amour est la force la plus puissante de l'univers, celle qui nous fait avancer et nous rend meilleurs.",
        background: "linear-gradient(to right, #ff6b6b, #ff9999)"
    },
    '03-08': {
        text: "À toutes les femmes qui inspirent, qui créent, qui dirigent - votre force change le monde chaque jour.",
        background: "linear-gradient(to right, #ff9a9e, #fad0c4)"
    },
    '05-01': {
        text: "Le travail n'est pas seulement un moyen de gagner sa vie, c'est une façon de donner un sens à sa vie.",
        background: "linear-gradient(to right, #f2994a, #f2c94c)"
    },
    '06-21': {
        text: "La musique est la langue des émotions, elle unit les cœurs et transcende les frontières.",
        background: "linear-gradient(to right, #11998e, #38ef7d)"
    },
    '07-14': {
        text: "Liberté, Égalité, Fraternité - que ces valeurs continuent d'éclairer notre chemin.",
        background: "linear-gradient(to right, #2193b0, #6dd5ed)"
    },
    '10-31': {
        text: "Que cette nuit d'Halloween soit remplie de frissons, de bonbons et de souvenirs enchantés!",
        background: "linear-gradient(to right, #ff4e50, #2c3e50)"
    },
    '11-11': {
        text: "Se souvenir du passé pour construire un avenir de paix. N'oublions jamais.",
        background: "linear-gradient(to right, #536976, #292e49)"
    },
    '12-25': {
        text: "Que la magie de Noël illumine vos cœurs et apporte paix et joie dans vos foyers. Joyeux Noël!",
        background: "linear-gradient(to right, #c94b4b, #4b134f)"
    },
    '12-31': {
        text: "Que les derniers instants de cette année soient le prélude d'une nouvelle année exceptionnelle!",
        background: "linear-gradient(to right, #373B44, #4286f4)"
    },
    
    
    
        '02-04': {
        text: "La mission de Facebook est de donner aux gens le pouvoir de créer des communautés et de rapprocher le monde. - Mark Zuckerberg",
        background: "linear-gradient(to right, #3b5998, #192f6a)"
    },
    '03-11': {
        text: "Le véritable progrès ne consiste pas à remplacer l'ancien par le nouveau, mais à transformer l'ancien en nouveau. - Satya Nadella",
        background: "linear-gradient(to right, #00a4ef, #0078d4)"
    },
    '09-04': {
        text: "Notre mission est d'organiser les informations à l'échelle mondiale et de les rendre universellement accessibles et utiles. - Larry Page",
        background: "linear-gradient(to right, #4285f4, #34a853, #fbbc05, #ea4335)"
    },
    '09-20': {
        text: "Bytedance a pour objectif de capturer et présenter le monde de manière créative. - Zhang Yiming",
        background: "linear-gradient(to right, #ff0050, #00f2ea)"
    },
    '11-30': {
        text: "ChatGPT représente une étape vers la création d'une IA bénéfique pour l'humanité. - Sam Altman",
        background: "linear-gradient(to right, #74aa9c, #427f6a)"
    },
    '08-14': {
        text: "Pour que l'humanité devienne une civilisation spatiale, l'accès à l'espace doit être révolutionné. - Elon Musk",
        background: "linear-gradient(to right, #005288, #a7a9ac)"
    },
    '03-24': {
        text: "La messagerie doit être gratuite et accessible à tous. - Pavel Durov",
        background: "linear-gradient(to right, #0088cc, #00aced)"
    },
    
    
        '01-04': {
        text: "Le génie est fait d'un pour cent d'inspiration et de quatre-vingt-dix-neuf pour cent de transpiration. - Thomas Edison",
        background: "linear-gradient(to right, #4b6cb7, #182848)"
    },
    '02-11': {
        text: "Dans la vie, rien n'est à craindre, tout est à comprendre. - Marie Curie",
        background: "linear-gradient(to right, #8E2DE2, #4A00E0)"
    },
    '03-14': {
        text: "L'imagination est plus importante que le savoir. Car le savoir est limité, tandis que l'imagination englobe le monde entier. - Albert Einstein",
        background: "linear-gradient(to right, #304352, #d7d2cc)"
    },
    '06-23': {
        text: "Si vous pouvez le rêver, vous pouvez le faire. - Walt Disney",
        background: "linear-gradient(to right, #2193b0, #6dd5ed)"
    },
    '07-10': {
        text: "Si j'ai pu voir plus loin, c'est en montant sur les épaules des géants. - Nikola Tesla",
        background: "linear-gradient(to right, #141E30, #243B55)"
    },
    '09-27': {
        text: "Celui qui pense qu'il est trop petit pour faire une différence n'a jamais essayé de dormir avec un moustique. - Henry Ford",
        background: "linear-gradient(to right, #3C3B3F, #605C3C)"
    },
    '10-24': {
        text: "Ce que l'esprit peut concevoir et croire, il peut l'accomplir. - Bob Proctor",
        background: "linear-gradient(to right, #DA4453, #89216B)"
    },
        '12-17': [{
        text: "Une personne qui n'a jamais commis d'erreurs n'a jamais tenté d'innover. - Alan Turing",
        background: "linear-gradient(to right, #373B44, #4286f4)"
    },
    {
        text: "Si nous travaillons sur le marbre, il périra; si nous travaillons sur le métal, le temps l'effacera; mais si nous travaillons sur les âmes immortelles, nous graverons sur ces tablettes quelque chose qui brillera éternellement. - Les Frères Wright",
        background: "linear-gradient(to right, #0F2027, #203A43)"
    }]
};

const events = {
    '01-01': [
        {
            title: "Nouvel An",
            image: 'events/newyear2.jpg',
            description: "Le Nouvel An marque le début d'une nouvelle année dans le calendrier grégorien. C'est une célébration mondiale de renouveau et d'espoir."
        },
        {
            title: "Jour de la Paix Mondiale",
            image: 'events/newyearp.jpg',
            description: "Journée dédiée à la promotion de la paix dans le monde entier."
        }
    ],
    '02-14': [
        {
            title: "Saint-Valentin",
            image: 'events/saintvalentin.jpg',
            description: "Fête des amoureux célébrée dans de nombreux pays, symbolisant l'amour et l'affection."
        }
    ],
    '03-08': [
        {
            title: "Journée Internationale des Droits des Femmes",
            image: 'events/women.jpg',
            description: "Journée célébrant les droits des femmes et l'égalité des genres dans le monde entier."
        }
    ],
    '05-01': [
        {
            title: "Fête du Travail",
            image: 'events/work.jpg',
            description: "Journée internationale des travailleurs, célébrant les droits et acquis sociaux."
        }
    ],
    '06-21': [
        {
            title: "Fête de la Musique",
            image: 'events/musicfete.jpg',
            description: "Célébration mondiale de la musique, où amateurs et professionnels se produisent dans les rues."
        }
    ],
    '07-14': [
        {
            title: "Fête Nationale Française",
            image: 'events/bastille.jpg',
            description: "Célébration de la prise de la Bastille et des valeurs de la République française."
        }
    ],
    '10-31': [
        {
            title: "Halloween",
            image: 'events/halloween.jpg',
            description: "Fête d'origine celtique, aujourd'hui célébrée par des déguisements et des friandises."
        }
    ],
    '11-11': [
        {
            title: "Jour du Souvenir",
            image: 'events/remember.jpg',
            description: "Commémoration des victimes de guerre et célébration de la paix."
        }
    ],
    '12-25': [
        {
            title: "Noël",
            image: 'events/jesusnoel.jpg',
            description: "Fête chrétienne célébrant la naissance de Jésus-Christ, devenue une célébration culturelle mondiale de partage et de générosité."
        },
        {
            title: "Journée de la Famille",
            image: 'events/familynoel.jpg',
            description: "Un moment spécial pour se réunir en famille et partager des moments précieux."
        }
    ],
    '12-31': [
        {
            title: "Saint-Sylvestre",
            image: 'events/saintsylvestre.jpg',
            description: "Dernière soirée de l'année, célébrée par des festivités dans le monde entier."
        }
    ],
    
    
    '02-04': [
        {
            title: "Lancement de Facebook",
            image: 'events/facebookmark.jpg',
            description: "2004 - Création de \"TheFacebook\" par Mark Zuckerberg à Harvard, qui deviendra plus tard le plus grand réseau social au monde."
        }
    ],
    '03-11': [
        {
            title: "Fondation de Microsoft",
            image: 'events/microsoftbill.jpg',
            description: "1975 - Bill Gates et Paul Allen fondent Microsoft, qui révolutionnera l'industrie informatique avec Windows."
        }
    ],
    '09-04': [
        {
            title: "Création de Google",
            image: 'events/googlelarry2.png',
            description: "1998 - Larry Page et Sergey Brin fondent Google dans un garage de Californie, transformant à jamais notre façon d'accéder à l'information."
        }
    ],
    '09-20': [
        {
            title: "Lancement de TikTok",
            image: 'events/tiktokzhang.jpg',
            description: "2016 - ByteDance lance TikTok (initialement Musical.ly), qui deviendra l'application de partage de vidéos courtes la plus populaire au monde."
        }
    ],
    '11-30': [
        {
            title: "Lancement de ChatGPT",
            image: 'events/chatgptsam.jpg',
            description: "2022 - OpenAI lance ChatGPT, marquant une révolution dans l'intelligence artificielle conversationnelle."
        }
    ],
    '08-14': [
        {
            title: "Fondation de SpaceX",
            image: 'events/spacexelon.jpg',
            description: "2002 - Elon Musk fonde SpaceX, entreprise révolutionnant l'exploration spatiale avec ses fusées réutilisables."
        }
    ],
    '03-24': [
        {
            title: "Création de Telegram",
            image: 'events/telegrampavel.jpg',
            description: "2013 - Pavel Durov lance Telegram, une application de messagerie sécurisée qui deviendra l'une des plus populaires au monde."
        }
    ],
    
    
    
    '01-04': [
        {
            title: "Premier Succès de l'Ampoule Électrique",
            image: 'events/edisonampoule.jpg',
            description: "En 1880, Thomas Edison présente sa première ampoule électrique commercialement viable, illuminant l'ère moderne."
        }
    ],
    '02-11': [
        {
            title: "Découverte du Radium",
            image: 'events/radiummarie.jpg',
            description: "En 1898, Marie et Pierre Curie découvrent le radium, révolutionnant notre compréhension de la radioactivité."
        }
    ],
    '03-14': [
        {
            title: "Publication de la Théorie de la Relativité",
            image: 'events/einsteinmc2.jpg',
            description: "En 1905, Einstein publie sa théorie de la relativité restreinte, transformant notre compréhension de l'univers."
        }
    ],
    '06-23': [
        {
            title: "Création de Walt Disney Productions",
            image: 'events/disneywalt.jpg',
            description: "En 1923, Walt Disney fonde son studio, donnant naissance à un empire du divertissement qui enchante encore le monde aujourd'hui."
        }
    ],
    '07-10': [
        {
            title: "Invention du Courant Alternatif",
            image: 'events/currenttesla.jpg',
            description: "En 1888, Tesla présente son système révolutionnaire de distribution électrique par courant alternatif."
        }
    ],
    '09-27': [
        {
            title: "Première Ligne d'Assemblage Automobile",
            image: 'events/mobileford.jpg',
            description: "En 1908, Henry Ford révolutionne l'industrie avec la première ligne d'assemblage mobile pour la Ford Model T."
        }
    ],
    '10-24': [
        {
            title: "Publication de 'La Science de l'Enrichissement'",
            image: 'events/bobproctor2.jpg',
            description: "Bob Proctor popularise les principes de la Loi de l'Attraction et du développement personnel, inspirant des millions de personnes à travers le monde."
        }
    ],
    '12-17': [
        {
            title: "Premier Vol Motorisé",
            image: 'events/volwright.jpg',
            description: "En 1903, les frères Wright réalisent le premier vol motorisé contrôlé à Kitty Hawk, Caroline du Nord."
        },
        {
            title: "La Machine de Turing",
            image: 'events/machineturing.jpg',
            description: "En 1936, Alan Turing présente son concept de machine universelle, posant les bases de l'informatique moderne."
        }
    ]
};
