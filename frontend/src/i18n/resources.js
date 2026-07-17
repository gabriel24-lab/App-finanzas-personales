export const RESOURCES = [
  {
    slug: "como-crear-presupuesto",
    image: "/resources/como-crear-presupuesto.webp",
    color: "#1d4ed8",
  },
  {
    slug: "regla-50-30-20",
    image: "/resources/regla-50-30-20.webp",
    color: "#7c3aed",
  },
  {
    slug: "como-ahorrar-dinero",
    image: "/resources/como-ahorrar-dinero.webp",
    color: "#059669",
  },
  {
    slug: "fondo-de-emergencia",
    image: "/resources/fondo-de-emergencia.webp",
    color: "#d97706",
  },
  {
    slug: "como-eliminar-deudas",
    image: "/resources/como-eliminar-deudas.webp",
    color: "#dc2626",
  },
  {
    slug: "errores-financieros",
    image: "/resources/errores-financieros.webp",
    color: "#ea580c",
  },
  {
    slug: "educacion-financiera-estudiantes",
    image: "/resources/educacion-financiera-estudiantes.webp",
    color: "#0891b2",
  },
  {
    slug: "gastos-hormiga",
    image: "/resources/gastos-hormiga.webp",
    color: "#65a30d",
  },
  {
    slug: "metodos-de-ahorro",
    image: "/resources/metodos-de-ahorro.webp",
    color: "#9333ea",
  },
  {
    slug: "glosario-financiero",
    image: "/resources/glosario-financiero.webp",
    color: "#0f766e",
  },
];

export const RESOURCE_DETAIL_CONTENT = {
  en: {
    "como-crear-presupuesto": {
      readTime: "6 min",
      category: "Budget",
      intro:
        "A budget is a practical way to turn financial chaos into clarity and make every dollar intentional.",
      sections: [
        {
          title: "Why it matters",
          body:
            "A budget helps you anticipate future needs instead of reacting to money at the last minute.",
        },
        {
          title: "Start with a simple routine",
          body:
            "Track your income and expenses for a month, then assign every peso a purpose before the next month begins.",
        },
      ],
      tips: [
        "Review your budget weekly.",
        "Leave room for unexpected expenses.",
        "Adjust the plan when your life changes.",
      ],
    },
    "regla-50-30-20": {
      readTime: "5 min",
      category: "Budget",
      intro:
        "The 50/30/20 rule gives you an easy framework to balance essentials, enjoyment, and the future.",
      sections: [
        {
          title: "How it works",
          body:
            "Split your income into 50% needs, 30% wants, and 20% saving and debt payments.",
        },
        {
          title: "Why it still helps",
          body:
            "It creates a simple structure that helps you decide clearly without overcomplicating your finances.",
        },
      ],
      tips: [
        "Base the calculation on your net income.",
        "Review your split every few months.",
        "Automate savings on payday.",
      ],
    },
    "como-ahorrar-dinero": {
      readTime: "7 min",
      category: "Savings",
      intro:
        "Saving becomes easier when it is treated as a habit and not as a sacrifice.",
      sections: [
        {
          title: "Pay yourself first",
          body:
            "Transfer a portion of your income to savings right away, before spending on anything else.",
        },
        {
          title: "Use automation",
          body:
            "Automatic transfers make saving more reliable than relying on willpower alone.",
        },
      ],
      tips: [
        "Start small and increase gradually.",
        "Use a separate account for savings.",
        "Link saving to a concrete goal.",
      ],
    },
    "fondo-de-emergencia": {
      readTime: "6 min",
      category: "Savings",
      intro:
        "An emergency fund protects you from unexpected events and reduces the risk of falling into debt.",
      sections: [
        {
          title: "What it is for",
          body:
            "It helps cover surprise expenses without forcing you to use high-interest debt.",
        },
        {
          title: "How to build it",
          body:
            "Start with a small target and grow it steadily until it covers several months of essential expenses.",
        },
      ],
      tips: [
        "Keep it in a liquid and safe account.",
        "Do not invest it in volatile products.",
        "Restore it quickly after using it.",
      ],
    },
    "como-eliminar-deudas": {
      readTime: "8 min",
      category: "Debt",
      intro:
        "Getting out of debt requires strategy, discipline, and a plan you can actually sustain.",
      sections: [
        {
          title: "List everything first",
          body:
            "Write down all your debts and organize them by balance so you can attack them in order.",
        },
        {
          title: "Create momentum",
          body:
            "Use any extra money to pay the smallest debt first and build confidence as you progress.",
        },
      ],
      tips: [
        "Avoid taking on new debt while paying off old ones.",
        "Celebrate each small win.",
        "Negotiate before the debt grows larger.",
      ],
    },
    "errores-financieros": {
      readTime: "6 min",
      category: "Education",
      intro:
        "Many financial mistakes come from habits that look harmless until they quietly damage your stability.",
      sections: [
        {
          title: "Lifestyle inflation",
          body:
            "When your expenses grow as fast as your income, you may feel richer while saving less.",
        },
        {
          title: "Emotional decisions",
          body:
            "Buying impulsively or using credit under stress can create problems that last much longer than the purchase itself.",
        },
      ],
      tips: [
        "Review your expenses monthly.",
        "Wait 24 hours before large purchases.",
        "Keep your goals in sight.",
      ],
    },
    "educacion-financiera-estudiantes": {
      readTime: "7 min",
      category: "Education",
      intro:
        "Financial education gives students a strong base for making better decisions before bigger responsibilities arrive.",
      sections: [
        {
          title: "Use this stage well",
          body:
            "Student years are the perfect time to build habits that will protect your future freedom.",
        },
        {
          title: "Learn the basics",
          body:
            "Understanding income, expenses, debt, and interest makes your decisions calmer and more effective.",
        },
      ],
      tips: [
        "Track your spending for a month.",
        "Avoid unnecessary debt.",
        "Keep learning continuously.",
      ],
    },
    "gastos-hormiga": {
      readTime: "6 min",
      category: "Habits",
      intro:
        "Small expenses can seem harmless, but they often drain your budget more than you realize.",
      sections: [
        {
          title: "Why they are dangerous",
          body:
            "A few small purchases every day can become a major monthly leak without feeling dramatic.",
        },
        {
          title: "How to control them",
          body:
            "Create a short pause before buying non-essential items and review your tiny expenses weekly.",
        },
      ],
      tips: [
        "Review small expenses every week.",
        "Use a separate card or cash for daily spending.",
        "Set a monthly limit for pleasures.",
      ],
    },
    "metodos-de-ahorro": {
      readTime: "7 min",
      category: "Savings",
      intro:
        "The best saving method is the one you can follow consistently in your real life.",
      sections: [
        {
          title: "Pay yourself first",
          body:
            "Automate a transfer before you spend on anything else so saving is built into your routine.",
        },
        {
          title: "Choose a system that fits you",
          body:
            "A challenge, a budget envelope, or simple automation can work better than a complex plan.",
        },
      ],
      tips: [
        "Pick one method at a time.",
        "Use barriers if you are impulsive.",
        "Prefer simple systems over perfect ones.",
      ],
    },
    "glosario-financiero": {
      readTime: "8 min",
      category: "Education",
      intro:
        "Learning financial vocabulary gives you more confidence and helps you avoid costly misunderstandings.",
      sections: [
        {
          title: "Assets, liabilities, and net worth",
          body:
            "These terms help you understand what you own, what you owe, and what your real financial position is.",
        },
        {
          title: "Interest, inflation, and liquidity",
          body:
            "These concepts explain how money can grow, lose value, or become difficult to access.",
        },
      ],
      tips: [
        "Learn three terms per week.",
        "Apply each term to a real situation.",
        "Do not try to master everything at once.",
      ],
    },
  },
  pt: {
    "como-crear-presupuesto": {
      readTime: "6 min",
      category: "Orçamento",
      intro:
        "Um orçamento é uma forma prática de transformar o caos financeiro em clareza e dar propósito a cada real.",
      sections: [
        {
          title: "Por que é importante",
          body:
            "Ele ajuda a antecipar necessidades futuras em vez de reagir ao dinheiro no último minuto.",
        },
        {
          title: "Comece com uma rotina simples",
          body:
            "Acompanhe sua renda e seus gastos por um mês e defina um destino para cada valor antes do próximo mês.",
        },
      ],
      tips: [
        "Revise o orçamento semanalmente.",
        "Deixe espaço para gastos inesperados.",
        "Ajuste o plano quando a vida mudar.",
      ],
    },
    "regla-50-30-20": {
      readTime: "5 min",
      category: "Orçamento",
      intro:
        "A regra 50/30/20 oferece uma estrutura simples para equilibrar necessidades, prazeres e futuro.",
      sections: [
        {
          title: "Como funciona",
          body:
            "Divida sua renda em 50% para necessidades, 30% para desejos e 20% para poupança e dívidas.",
        },
        {
          title: "Por que ainda ajuda",
          body:
            "Ela cria uma estrutura simples para tomar decisões de forma mais clara e menos complicada.",
        },
      ],
      tips: [
        "Calcule com base na renda líquida.",
        "Revise a divisão a cada poucos meses.",
        "Automatize a poupança no dia do pagamento.",
      ],
    },
    "como-ahorrar-dinero": {
      readTime: "7 min",
      category: "Poupança",
      intro:
        "Economizar fica mais fácil quando vira hábito e não sacrifício.",
      sections: [
        {
          title: "Pague a si mesmo primeiro",
          body:
            "Transfira parte da sua renda para a poupança logo no início, antes de gastar em outra coisa.",
        },
        {
          title: "Use automação",
          body:
            "Transferências automáticas tornam a poupança mais confiável do que depender só de vontade.",
        },
      ],
      tips: [
        "Comece pequeno e aumente aos poucos.",
        "Use uma conta separada para poupar.",
        "Associe a poupança a uma meta concreta.",
      ],
    },
    "fondo-de-emergencia": {
      readTime: "6 min",
      category: "Poupança",
      intro:
        "Um fundo de emergência protege você de imprevistos e reduz o risco de entrar em dívidas.",
      sections: [
        {
          title: "Para que serve",
          body:
            "Ele ajuda a cobrir despesas surpresa sem te obrigar a usar dívida com juros altos.",
        },
        {
          title: "Como construir",
          body:
            "Comece com uma meta pequena e aumente aos poucos até cobrir vários meses de gastos essenciais.",
        },
      ],
      tips: [
        "Mantenha-o em conta líquida e segura.",
        "Não invista em produtos voláteis.",
        "Reponha-o rapidamente depois de usar.",
      ],
    },
    "como-eliminar-deudas": {
      readTime: "8 min",
      category: "Dívidas",
      intro:
        "Sair das dívidas exige estratégia, disciplina e um plano que você consiga manter.",
      sections: [
        {
          title: "Liste tudo primeiro",
          body:
            "Anote todas as dívidas e organize-as por saldo para atacá-las em ordem.",
        },
        {
          title: "Crie impulso",
          body:
            "Use qualquer dinheiro extra para pagar a dívida menor primeiro e ganhar confiança.",
        },
      ],
      tips: [
        "Evite abrir novas dívidas enquanto paga as antigas.",
        "Celebre cada pequena vitória.",
        "Negocie antes que a dívida cresça mais.",
      ],
    },
    "errores-financieros": {
      readTime: "6 min",
      category: "Educação",
      intro:
        "Muitos erros financeiros vêm de hábitos que parecem inofensivos até prejudicar sua estabilidade.",
      sections: [
        {
          title: "Inflação de estilo de vida",
          body:
            "Quando seus gastos crescem tanto quanto sua renda, você pode se sentir mais rico e poupar menos.",
        },
        {
          title: "Decisões emocionais",
          body:
            "Comprar por impulso ou usar crédito sob estresse pode criar problemas maiores do que a compra em si.",
        },
      ],
      tips: [
        "Revise seus gastos todo mês.",
        "Espere 24 horas antes de comprar grandes itens.",
        "Mantenha suas metas visíveis.",
      ],
    },
    "educacion-financiera-estudiantes": {
      readTime: "7 min",
      category: "Educação",
      intro:
        "A educação financeira dá aos estudantes uma base forte para tomar decisões melhores antes que surjam responsabilidades maiores.",
      sections: [
        {
          title: "Use este momento bem",
          body:
            "Os anos de estudante são perfeitos para construir hábitos que protejam sua liberdade futura.",
        },
        {
          title: "Aprenda o básico",
          body:
            "Entender renda, gastos, dívidas e juros torna suas decisões mais calmas e eficazes.",
        },
      ],
      tips: [
        "Acompanhe seus gastos por um mês.",
        "Evite dívidas desnecessárias.",
        "Continue aprendendo continuamente.",
      ],
    },
    "gastos-hormiga": {
      readTime: "6 min",
      category: "Hábitos",
      intro:
        "Pequenos gastos parecem inofensivos, mas muitas vezes drenam seu orçamento mais do que você percebe.",
      sections: [
        {
          title: "Por que são perigosos",
          body:
            "Algumas compras pequenas todos os dias podem virar um vazamento grande no fim do mês sem parecer dramático.",
        },
        {
          title: "Como controlá-los",
          body:
            "Crie uma pausa antes de comprar itens não essenciais e revise seus pequenos gastos toda semana.",
        },
      ],
      tips: [
        "Revise pequenos gastos toda semana.",
        "Use um cartão separado ou dinheiro para gastos diários.",
        "Defina um limite mensal para prazeres.",
      ],
    },
    "metodos-de-ahorro": {
      readTime: "7 min",
      category: "Poupança",
      intro:
        "O melhor método de poupança é aquele que você consegue seguir com regularidade na sua vida real.",
      sections: [
        {
          title: "Pague a si mesmo primeiro",
          body:
            "Automatize uma transferência antes de gastar em qualquer outra coisa para que a poupança entre na rotina.",
        },
        {
          title: "Escolha um sistema que combine com você",
          body:
            "Um desafio, uma carteira de orçamento ou uma automação simples podem funcionar melhor do que um plano complexo.",
        },
      ],
      tips: [
        "Escolha um método por vez.",
        "Use barreiras se você for impulsivo.",
        "Prefira sistemas simples a perfeitos.",
      ],
    },
    "glosario-financiero": {
      readTime: "8 min",
      category: "Educação",
      intro:
        "Aprender o vocabulário financeiro aumenta sua confiança e ajuda a evitar equívocos caros.",
      sections: [
        {
          title: "Ativos, passivos e patrimônio",
          body:
            "Esses termos ajudam a entender o que você possui, o que deve e qual é sua posição financeira real.",
        },
        {
          title: "Juros, inflação e liquidez",
          body:
            "Esses conceitos explicam como o dinheiro pode crescer, perder valor ou se tornar difícil de acessar.",
        },
      ],
      tips: [
        "Aprenda três termos por semana.",
        "Aplique cada termo a uma situação real.",
        "Não tente dominar tudo de uma vez.",
      ],
    },
  },
  fr: {
    "como-crear-presupuesto": {
      readTime: "6 min",
      category: "Budget",
      intro:
        "Un budget est un moyen pratique de transformer le chaos financier en clarté et de donner un sens à chaque euro.",
      sections: [
        {
          title: "Pourquoi c'est important",
          body:
            "Il vous aide à anticiper les besoins futurs au lieu de réagir à l'argent au dernier moment.",
        },
        {
          title: "Commencez par une routine simple",
          body:
            "Suivez vos revenus et vos dépenses pendant un mois puis attribuez une destination à chaque somme avant le mois suivant.",
        },
      ],
      tips: [
        "Passez en revue le budget chaque semaine.",
        "Laissez de la place pour les dépenses imprévues.",
        "Ajustez le plan si votre vie change.",
      ],
    },
    "regla-50-30-20": {
      readTime: "5 min",
      category: "Budget",
      intro:
        "La règle 50/30/20 vous donne un cadre simple pour équilibrer besoins, plaisirs et avenir.",
      sections: [
        {
          title: "Comment ça marche",
          body:
            "Répartissez vos revenus en 50% pour les besoins, 30% pour les envies et 20% pour l'épargne et le remboursement des dettes.",
        },
        {
          title: "Pourquoi elle reste utile",
          body:
            "Elle crée une structure simple pour prendre des décisions plus claires sans compliquer vos finances.",
        },
      ],
      tips: [
        "Basez le calcul sur votre revenu net.",
        "Revue la répartition tous les quelques mois.",
        "Automatisez l'épargne à la réception du salaire.",
      ],
    },
    "como-ahorrar-dinero": {
      readTime: "7 min",
      category: "Épargne",
      intro:
        "Épargner devient plus simple quand cela devient une habitude et non un sacrifice.",
      sections: [
        {
          title: "Payez-vous d'abord",
          body:
            "Transférez une partie de vos revenus vers l'épargne tout de suite, avant de dépenser pour autre chose.",
        },
        {
          title: "Utilisez l'automatisation",
          body:
            "Les transferts automatiques rendent l'épargne plus fiable que la seule volonté.",
        },
      ],
      tips: [
        "Commencez petit puis augmentez progressivement.",
        "Utilisez un compte séparé pour l'épargne.",
        "Reliez l'épargne à un objectif concret.",
      ],
    },
    "fondo-de-emergencia": {
      readTime: "6 min",
      category: "Épargne",
      intro:
        "Un fonds d'urgence vous protège des événements inattendus et réduit le risque de tomber dans la dette.",
      sections: [
        {
          title: "À quoi il sert",
          body:
            "Il vous aide à couvrir des dépenses surprises sans devoir recourir à une dette à taux élevés.",
        },
        {
          title: "Comment le construire",
          body:
            "Commencez par un petit objectif et augmentez-le progressivement jusqu'à couvrir plusieurs mois de dépenses essentielles.",
        },
      ],
      tips: [
        "Gardez-le dans un compte liquide et sûr.",
        "N'investissez pas dans des produits volatils.",
        "Remplacez-le rapidement après l'avoir utilisé.",
      ],
    },
    "como-eliminar-deudas": {
      readTime: "8 min",
      category: "Dette",
      intro:
        "Sortir des dettes demande stratégie, discipline et un plan que vous pouvez réellement maintenir.",
      sections: [
        {
          title: "Listez tout d'abord",
          body:
            "Écrivez toutes vos dettes et organisez-les par solde pour les attaquer dans l'ordre.",
        },
        {
          title: "Créez de l'élan",
          body:
            "Utilisez chaque argent supplémentaire pour rembourser la plus petite dette d'abord et gagner en confiance.",
        },
      ],
      tips: [
        "Évitez de contracter de nouvelles dettes pendant que vous remboursez les anciennes.",
        "Célébrez chaque petite victoire.",
        "Négociez avant que la dette ne grandisse davantage.",
      ],
    },
    "errores-financieros": {
      readTime: "6 min",
      category: "Éducation",
      intro:
        "Beaucoup d'erreurs financières viennent d'habitudes qui semblent anodines jusqu'à endommager votre stabilité.",
      sections: [
        {
          title: "Inflation du style de vie",
          body:
            "Quand vos dépenses augmentent aussi vite que vos revenus, vous pouvez vous sentir plus riche tout en épargnant moins.",
        },
        {
          title: "Décisions émotionnelles",
          body:
            "Acheter impulsivement ou utiliser le crédit sous stress peut créer des problèmes plus grands que l'achat lui-même.",
        },
      ],
      tips: [
        "Passez en revue vos dépenses chaque mois.",
        "Attendez 24 heures avant de faire de gros achats.",
        "Gardez vos objectifs visibles.",
      ],
    },
    "educacion-financiera-estudiantes": {
      readTime: "7 min",
      category: "Éducation",
      intro:
        "L'éducation financière donne aux étudiants une base solide pour prendre de meilleures décisions avant que des responsabilités plus grandes n'arrivent.",
      sections: [
        {
          title: "Profitez bien de cette étape",
          body:
            "Les années d'étudiant sont parfaites pour construire des habitudes qui protégeront votre liberté future.",
        },
        {
          title: "Apprenez les bases",
          body:
            "Comprendre les revenus, les dépenses, les dettes et les intérêts rend vos décisions plus calmes et plus efficaces.",
        },
      ],
      tips: [
        "Suivez vos dépenses pendant un mois.",
        "Évitez les dettes inutiles.",
        "Continuez à apprendre régulièrement.",
      ],
    },
    "gastos-hormiga": {
      readTime: "6 min",
      category: "Habitudes",
      intro:
        "Les petites dépenses semblent anodines, mais elles vidangent souvent votre budget plus que vous ne le pensez.",
      sections: [
        {
          title: "Pourquoi elles sont dangereuses",
          body:
            "Quelques petits achats chaque jour peuvent devenir une fuite majeure à la fin du mois sans paraître dramatique.",
        },
        {
          title: "Comment les contrôler",
          body:
            "Créez une courte pause avant d'acheter des articles non essentiels et passez en revue vos petites dépenses chaque semaine.",
        },
      ],
      tips: [
        "Passez en revue les petites dépenses chaque semaine.",
        "Utilisez une carte séparée ou de l'argent pour les dépenses quotidiennes.",
        "Fixez une limite mensuelle pour les plaisirs.",
      ],
    },
    "metodos-de-ahorro": {
      readTime: "7 min",
      category: "Épargne",
      intro:
        "La meilleure méthode d'épargne est celle que vous pouvez suivre régulièrement dans votre vraie vie.",
      sections: [
        {
          title: "Payez-vous d'abord",
          body:
            "Automatisez un transfert avant de dépenser quoi que ce soit d'autre pour que l'épargne fasse partie de votre routine.",
        },
        {
          title: "Choisissez un système qui vous convient",
          body:
            "Un défi, un porte-monnaie budgétaire ou une automatisation simple peuvent mieux fonctionner qu'un plan complexe.",
        },
      ],
      tips: [
        "Choisissez une méthode à la fois.",
        "Utilisez des barrières si vous êtes impulsif.",
        "Privilégiez des systèmes simples plutôt que parfaits.",
      ],
    },
    "glosario-financiero": {
      readTime: "8 min",
      category: "Éducation",
      intro:
        "Apprendre le vocabulaire financier augmente votre confiance et vous aide à éviter des malentendus coûteux.",
      sections: [
        {
          title: "Actifs, passifs et patrimoine net",
          body:
            "Ces termes vous aident à comprendre ce que vous possédez, ce que vous devez et quelle est votre vraie situation financière.",
        },
        {
          title: "Intérêts, inflation et liquidité",
          body:
            "Ces concepts expliquent comment l'argent peut croître, perdre de la valeur ou devenir difficile à accéder.",
        },
      ],
      tips: [
        "Apprenez trois termes par semaine.",
        "Appliquez chaque terme à une situation réelle.",
        "Ne tentez pas de tout maîtriser d'un coup.",
      ],
    },
  },
};

export const RESOURCE_TEXTS = {
  es: {
    resourcePage: {
      title: "Recursos financieros",
      subtitle:
        "Guías y artículos para mejorar tu relación con el dinero, paso a paso.",
      readResource: "Leer recurso",
      backToResources: "Ver todos los recursos",
      notFoundTitle: "Recurso no encontrado",
      notFoundSubtitle: "El recurso que buscas no existe.",
      quickTips: "Consejos rápidos",
      infoBanner:
        "Este recurso es informativo. Para decisiones financieras importantes, consulta con un profesional certificado.",
      listAria: "Lista de recursos",
      readTimeSuffix: "de lectura",
    },
    labels: {
      "como-crear-presupuesto": "Cómo crear un presupuesto",
      "regla-50-30-20": "Regla 50/30/20",
      "como-ahorrar-dinero": "Cómo ahorrar dinero",
      "fondo-de-emergencia": "Qué es un fondo de emergencia",
      "como-eliminar-deudas": "Cómo eliminar deudas",
      "errores-financieros": "Errores financieros comunes",
      "educacion-financiera-estudiantes":
        "Educación financiera para estudiantes",
      "gastos-hormiga": "Cómo controlar gastos hormiga",
      "metodos-de-ahorro": "Métodos de ahorro",
      "glosario-financiero": "Glosario financiero",
    },
    descriptions: {
      "como-crear-presupuesto":
        "Aprende a diseñar y mantener un presupuesto personal paso a paso.",
      "regla-50-30-20":
        "Distribuye tus ingresos de forma inteligente con esta regla probada.",
      "como-ahorrar-dinero":
        "Estrategias prácticas para construir un hábito de ahorro sólido.",
      "fondo-de-emergencia":
        "Descubre por qué es esencial y cómo empezar el tuyo hoy.",
      "como-eliminar-deudas":
        "Métodos efectivos para salir de deudas y recuperar tu libertad financiera.",
      "errores-financieros":
        "Identifica y evita los errores que más afectan tu economía personal.",
      "educacion-financiera-estudiantes":
        "Conceptos básicos de finanzas pensados para jóvenes y estudiantes.",
      "gastos-hormiga":
        "Detecta esos pequeños gastos diarios que drenan tu presupuesto sin que te des cuenta.",
      "metodos-de-ahorro":
        "Conoce los métodos de ahorro más populares y elige el que mejor se adapte a ti.",
      "glosario-financiero":
        "Domina el vocabulario financiero clave con definiciones claras y sencillas.",
    },
    detailTitles: {
      "como-crear-presupuesto": "Cómo crear un presupuesto",
      "regla-50-30-20": "Regla 50/30/20",
      "como-ahorrar-dinero": "Cómo ahorrar dinero",
      "fondo-de-emergencia": "Qué es un fondo de emergencia",
      "como-eliminar-deudas": "Cómo eliminar deudas",
      "errores-financieros": "Errores financieros comunes",
      "educacion-financiera-estudiantes":
        "Educación financiera para estudiantes",
      "gastos-hormiga": "Cómo controlar gastos hormiga",
      "metodos-de-ahorro": "Métodos de ahorro",
      "glosario-financiero": "Glosario financiero",
    },
    detailCategories: {
      "como-crear-presupuesto": "Presupuesto",
      "regla-50-30-20": "Presupuesto",
      "como-ahorrar-dinero": "Ahorro",
      "fondo-de-emergencia": "Ahorro",
      "como-eliminar-deudas": "Deudas",
      "errores-financieros": "Educación",
      "educacion-financiera-estudiantes": "Educación",
      "gastos-hormiga": "Hábitos",
      "metodos-de-ahorro": "Ahorro",
      "glosario-financiero": "Educación",
    },
    detailIntros: {
      "como-crear-presupuesto":
        "Crear un presupuesto desde cero no es un ejercicio de restricción ni de disciplina extrema; es una forma de convertir el caos financiero en claridad. Cuando aprendes a dar un destino a cada peso, dejas de reaccionar ante el dinero y empiezas a dirigirlo con intención, como quien construye un mapa antes de emprender un viaje.",
      "regla-50-30-20":
        "La regla 50/30/20 ha sobrevivido a las modas financieras porque resuelve algo fundamental: te da una forma simple de decidir cómo repartir lo que ganas sin perder de vista ni tus necesidades ni tus sueños. Es una herramienta práctica, pero también una filosofía de equilibrio entre supervivencia, disfrute y construcción de futuro.",
      "como-ahorrar-dinero":
        "Ahorrar no consiste en renunciar a todo lo que disfrutas; consiste en decidir, desde el principio, que una parte de tu dinero tiene un propósito más grande que el consumo inmediato. Cuando el ahorro se convierte en una práctica deliberada y automática, deja de sentirse como una imposición y empieza a parecer una forma de libertad.",
      "fondo-de-emergencia":
        "Un fondo de emergencia no es un lujo ni una meta sofisticada; es la base más humilde y más poderosa de la estabilidad financiera. Cuando la vida te sorprende con una enfermedad, una pérdida de ingresos o una reparación urgente, este colchón de liquidez puede marcar la diferencia entre una crisis temporal y una catástrofe económica.",
      "como-eliminar-deudas":
        "Salir de deudas no es solo una decisión financiera; es una decisión emocional, psicológica y estratégica. La deuda no solo consume dinero, también consume energía, tranquilidad y capacidad de planear. Cuando aprendes a atacarla con orden, el proceso deja de sentirse como una condena y empieza a parecer una recuperación.",
      "errores-financieros":
        "La riqueza no solo se construye ganando más, sino evitando fugas de capital innecesarias. Los errores financieros más dañinos no siempre son los más visibles: muchas veces aparecen como hábitos aparentemente inocentes que, con el tiempo, erosionan tus ingresos y tu estabilidad.",
      "educacion-financiera-estudiantes":
        "La educación financiera es una de las habilidades más valiosas que cualquier estudiante puede desarrollar, porque enseña a convertir recursos limitados en oportunidades reales. El momento en que estás estudiando es perfecto para construir hábitos sólidos antes de que aparezcan obligaciones más grandes, como vivienda, familia o deudas.",
      "gastos-hormiga":
        "Los gastos hormiga son consumos cotidianos de bajo valor nominal que parecen insignificantes, pero que, al acumularse, pueden erosionar de forma silenciosa tu capacidad de ahorro. No son solo un problema de dinero: también son un problema de conciencia financiera y de hábitos automáticos.",
      "metodos-de-ahorro":
        "No existe un único método de ahorro que funcione para todos. La mejor estrategia no es la más sofisticada, sino la que se adapta a tu personalidad, tu ritmo de ingresos y la fuerza de voluntad que realmente tienes en tu día a día.",
      "glosario-financiero":
        "Entender el lenguaje de las finanzas personales es el primer paso para tomar mejores decisiones. El problema no es que las finanzas sean demasiado complejas, sino que la falta de vocabulario hace que muchas personas eviten aprenderlas o se dejen llevar por consejos incompletos.",
    },
  },
  en: {
    resourcePage: {
      title: "Financial resources",
      subtitle:
        "Guides and articles to improve your money skills step by step.",
      readResource: "Read resource",
      backToResources: "View all resources",
      notFoundTitle: "Resource not found",
      notFoundSubtitle: "The resource you are looking for does not exist.",
      quickTips: "Quick tips",
      infoBanner:
        "This resource is informational. For important financial decisions, consult a certified professional.",
      listAria: "Resources list",
      readTimeSuffix: "read",
    },
    labels: {
      "como-crear-presupuesto": "How to create a budget",
      "regla-50-30-20": "50/30/20 rule",
      "como-ahorrar-dinero": "How to save money",
      "fondo-de-emergencia": "What is an emergency fund",
      "como-eliminar-deudas": "How to eliminate debt",
      "errores-financieros": "Common financial mistakes",
      "educacion-financiera-estudiantes": "Financial education for students",
      "gastos-hormiga": "How to control small spending",
      "metodos-de-ahorro": "Saving methods",
      "glosario-financiero": "Financial glossary",
    },
    descriptions: {
      "como-crear-presupuesto":
        "Learn how to design and maintain a personal budget step by step.",
      "regla-50-30-20":
        "Distribute your income intelligently with this proven rule.",
      "como-ahorrar-dinero":
        "Practical strategies to build a strong savings habit.",
      "fondo-de-emergencia":
        "Discover why it is essential and how to start yours today.",
      "como-eliminar-deudas":
        "Effective methods to get out of debt and regain financial freedom.",
      "errores-financieros":
        "Identify and avoid the mistakes that most affect your personal finances.",
      "educacion-financiera-estudiantes":
        "Basic finance concepts designed for young people and students.",
      "gastos-hormiga":
        "Detect those small daily expenses that silently drain your budget.",
      "metodos-de-ahorro":
        "Learn the most popular saving methods and choose the one that suits you best.",
      "glosario-financiero":
        "Master key financial vocabulary with clear and simple definitions.",
    },
    detailTitles: {
      "como-crear-presupuesto": "How to create a budget",
      "regla-50-30-20": "50/30/20 rule",
      "como-ahorrar-dinero": "How to save money",
      "fondo-de-emergencia": "What is an emergency fund",
      "como-eliminar-deudas": "How to eliminate debt",
      "errores-financieros": "Common financial mistakes",
      "educacion-financiera-estudiantes": "Financial education for students",
      "gastos-hormiga": "How to control small spending",
      "metodos-de-ahorro": "Saving methods",
      "glosario-financiero": "Financial glossary",
    },
    detailCategories: {
      "como-crear-presupuesto": "Budget",
      "regla-50-30-20": "Budget",
      "como-ahorrar-dinero": "Savings",
      "fondo-de-emergencia": "Savings",
      "como-eliminar-deudas": "Debt",
      "errores-financieros": "Education",
      "educacion-financiera-estudiantes": "Education",
      "gastos-hormiga": "Habits",
      "metodos-de-ahorro": "Savings",
      "glosario-financiero": "Education",
    },
    detailIntros: {
      "como-crear-presupuesto":
        "Creating a budget from scratch is not an exercise in restriction or extreme discipline; it is a way to turn financial chaos into clarity. When you learn to assign a purpose to every peso, you stop reacting to money and start directing it with intention, like building a map before starting a journey.",
      "regla-50-30-20":
        "The 50/30/20 rule has survived financial trends because it solves something fundamental: it gives you a simple way to decide how to distribute what you earn without losing sight of your needs or your dreams. It is a practical tool, but also a philosophy of balance between survival, enjoyment, and building the future.",
      "como-ahorrar-dinero":
        "Saving is not about giving up everything you enjoy; it is about deciding, from the beginning, that part of your money has a bigger purpose than immediate consumption. When saving becomes a deliberate and automatic practice, it stops feeling like an imposition and starts to feel like a form of freedom.",
      "fondo-de-emergencia":
        "An emergency fund is not a luxury nor a sophisticated goal; it is the most humble and powerful foundation of financial stability. When life surprises you with an illness, income loss, or urgent repair, this liquidity cushion can make the difference between a temporary crisis and a financial catastrophe.",
      "como-eliminar-deudas":
        "Getting out of debt is not just a financial decision; it is an emotional, psychological, and strategic one. Debt not only consumes money, it also consumes energy, peace, and planning capacity. When you learn to tackle it in an orderly way, the process stops feeling like a sentence and starts to feel like recovery.",
      "errores-financieros":
        "Wealth is not only built by earning more, but by avoiding unnecessary leaks of capital. The most damaging financial mistakes are not always the most visible: often they appear as seemingly innocent habits that, over time, erode your income and stability.",
      "educacion-financiera-estudiantes":
        "Financial education is one of the most valuable skills any student can develop because it teaches them to turn limited resources into real opportunities. The moment you are studying is perfect for building solid habits before bigger obligations appear, such as housing, family, or debt.",
      "gastos-hormiga":
        "Small daily expenses are low-value purchases that seem insignificant, but when they accumulate, they can silently erode your ability to save. They are not only a money problem; they are a problem of financial awareness and automatic habits.",
      "metodos-de-ahorro":
        "There is no single saving method that works for everyone. The best strategy is not the most sophisticated one, but the one that adapts to your personality, income rhythm, and the willpower you really have in your day-to-day life.",
      "glosario-financiero":
        "Understanding the language of personal finance is the first step to making better decisions. The problem is not that finance is too complex, but that a lack of vocabulary makes many people avoid learning it or follow incomplete advice.",
    },
  },
  pt: {
    resourcePage: {
      title: "Recursos financeiros",
      subtitle:
        "Guias e artigos para melhorar sua relação com o dinheiro, passo a passo.",
      readResource: "Ler recurso",
      backToResources: "Ver todos os recursos",
      notFoundTitle: "Recurso não encontrado",
      notFoundSubtitle: "O recurso que você procura não existe.",
      quickTips: "Dicas rápidas",
      infoBanner:
        "Este recurso é informativo. Para decisões financeiras importantes, consulte um profissional certificado.",
      listAria: "Lista de recursos",
      readTimeSuffix: "de leitura",
    },
    labels: {
      "como-crear-presupuesto": "Como criar um orçamento",
      "regla-50-30-20": "Regra 50/30/20",
      "como-ahorrar-dinero": "Como economizar dinheiro",
      "fondo-de-emergencia": "O que é um fundo de emergência",
      "como-eliminar-deudas": "Como eliminar dívidas",
      "errores-financieros": "Erros financeiros comuns",
      "educacion-financiera-estudiantes": "Educação financeira para estudantes",
      "gastos-hormiga": "Como controlar gastos pequenos",
      "metodos-de-ahorro": "Métodos de poupança",
      "glosario-financiero": "Glossário financeiro",
    },
    descriptions: {
      "como-crear-presupuesto":
        "Aprenda a projetar e manter um orçamento pessoal passo a passo.",
      "regla-50-30-20":
        "Distribua sua renda de forma inteligente com esta regra comprovada.",
      "como-ahorrar-dinero":
        "Estratégias práticas para construir um hábito sólido de poupança.",
      "fondo-de-emergencia":
        "Descubra por que é essencial e como iniciar o seu hoje.",
      "como-eliminar-deudas":
        "Métodos eficazes para sair das dívidas e recuperar sua liberdade financeira.",
      "errores-financieros":
        "Identifique e evite os erros que mais afetam suas finanças pessoais.",
      "educacion-financiera-estudiantes":
        "Conceitos financeiros básicos pensados para jovens e estudantes.",
      "gastos-hormiga":
        "Detecte esses pequenos gastos diários que drenam seu orçamento sem que você perceba.",
      "metodos-de-ahorro":
        "Conheça os métodos de poupança mais populares e escolha o que melhor se adapta a você.",
      "glosario-financiero":
        "Domine o vocabulário financeiro chave com definições claras e simples.",
    },
    detailTitles: {
      "como-crear-presupuesto": "Como criar um orçamento",
      "regla-50-30-20": "Regra 50/30/20",
      "como-ahorrar-dinero": "Como economizar dinheiro",
      "fondo-de-emergencia": "O que é um fundo de emergência",
      "como-eliminar-deudas": "Como eliminar dívidas",
      "errores-financieros": "Erros financeiros comuns",
      "educacion-financiera-estudiantes": "Educação financeira para estudantes",
      "gastos-hormiga": "Como controlar gastos pequenos",
      "metodos-de-ahorro": "Métodos de poupança",
      "glosario-financiero": "Glossário financeiro",
    },
    detailCategories: {
      "como-crear-presupuesto": "Orçamento",
      "regla-50-30-20": "Orçamento",
      "como-ahorrar-dinero": "Poupança",
      "fondo-de-emergencia": "Poupança",
      "como-eliminar-deudas": "Dívidas",
      "errores-financieros": "Educação",
      "educacion-financiera-estudiantes": "Educação",
      "gastos-hormiga": "Hábitos",
      "metodos-de-ahorro": "Poupança",
      "glosario-financiero": "Educação",
    },
    detailIntros: {
      "como-crear-presupuesto":
        "Criar um orçamento do zero não é um exercício de restrição ou disciplina extrema; é uma forma de transformar o caos financeiro em clareza. Quando você aprende a dar um destino a cada peso, deixa de reagir ao dinheiro e começa a direcioná-lo com intenção, como quem constrói um mapa antes de iniciar uma viagem.",
      "regla-50-30-20":
        "A regra 50/30/20 resistiu às modas financeiras porque resolve algo fundamental: oferece uma forma simples de decidir como distribuir o que você ganha sem perder de vista suas necessidades ou sonhos. É uma ferramenta prática, mas também uma filosofia de equilíbrio entre sobrevivência, prazer e construção do futuro.",
      "como-ahorrar-dinero":
        "Economizar não consiste em renunciar a tudo o que você gosta; consiste em decidir, desde o início, que parte do seu dinheiro tem um propósito maior do que o consumo imediato. Quando a poupança se torna uma prática deliberada e automática, deixa de parecer uma imposição e passa a ser uma forma de liberdade.",
      "fondo-de-emergencia":
        "Um fundo de emergência não é um luxo nem uma meta sofisticada; é a base mais humilde e poderosa da estabilidade financeira. Quando a vida te surpreende com uma doença, perda de renda ou reparo urgente, essa reserva de liquidez pode fazer a diferença entre uma crise temporária e uma catástrofe financeira.",
      "como-eliminar-deudas":
        "Sair das dívidas não é apenas uma decisão financeira; é uma decisão emocional, psicológica e estratégica. A dívida não consome apenas dinheiro, ela consome energia, tranquilidade e capacidade de planejar. Quando você aprende a enfrentá-la com ordem, o processo deixa de parecer uma condenação e começa a parecer uma recuperação.",
      "errores-financieros":
        "A riqueza não se constrói apenas ganhando mais, mas evitando vazamentos desnecessários de capital. Os erros financeiros mais prejudiciais nem sempre são os mais visíveis: muitas vezes aparecem como hábitos aparentemente inocentes que, com o tempo, corroem sua renda e sua estabilidade.",
      "educacion-financiera-estudiantes":
        "A educação financeira é uma das habilidades mais valiosas que qualquer estudante pode desenvolver, porque ensina a transformar recursos limitados em oportunidades reais. O momento em que você está estudando é perfeito para construir hábitos sólidos antes que apareçam obrigações maiores, como moradia, família ou dívidas.",
      "gastos-hormiga":
        "Os gastos pequenos são consumos cotidianos de baixo valor nominal que parecem insignificantes, mas que, ao se acumularem, podem corroer silenciosamente sua capacidade de poupar. Não são apenas um problema de dinheiro: também são um problema de consciência financeira e hábitos automáticos.",
      "metodos-de-ahorro":
        "Não existe um único método de poupança que funcione para todos. A melhor estratégia não é a mais sofisticada, mas a que se adapta à sua personalidade, ao ritmo da sua renda e à força de vontade que você realmente tem no seu dia a dia.",
      "glosario-financiero":
        "Entender a linguagem das finanças pessoais é o primeiro passo para tomar melhores decisões. O problema não é que finanças sejam complexas demais, mas que a falta de vocabulário faz muitas pessoas evitarem aprendê-las ou seguirem conselhos incompletos.",
    },
  },
  fr: {
    resourcePage: {
      title: "Ressources financières",
      subtitle:
        "Guides et articles pour améliorer votre relation avec l'argent, étape par étape.",
      readResource: "Lire la ressource",
      backToResources: "Voir toutes les ressources",
      notFoundTitle: "Ressource introuvable",
      notFoundSubtitle: "La ressource que vous recherchez n'existe pas.",
      quickTips: "Conseils rapides",
      infoBanner:
        "Cette ressource est informative. Pour des décisions financières importantes, consultez un professionnel certifié.",
      listAria: "Liste des ressources",
      readTimeSuffix: "de lecture",
    },
    labels: {
      "como-crear-presupuesto": "Comment créer un budget",
      "regla-50-30-20": "Règle 50/30/20",
      "como-ahorrar-dinero": "Comment épargner de l'argent",
      "fondo-de-emergencia": "Qu'est-ce qu'un fonds d'urgence",
      "como-eliminar-deudas": "Comment éliminer les dettes",
      "errores-financieros": "Erreurs financières courantes",
      "educacion-financiera-estudiantes": "Éducation financière pour étudiants",
      "gastos-hormiga": "Comment contrôler les petites dépenses",
      "metodos-de-ahorro": "Méthodes d'épargne",
      "glosario-financiero": "Glossaire financier",
    },
    descriptions: {
      "como-crear-presupuesto":
        "Apprenez à concevoir et maintenir un budget personnel étape par étape.",
      "regla-50-30-20":
        "Répartissez vos revenus intelligemment avec cette règle éprouvée.",
      "como-ahorrar-dinero":
        "Stratégies pratiques pour construire une habitude d'épargne solide.",
      "fondo-de-emergencia":
        "Découvrez pourquoi c'est essentiel et comment commencer le vôtre aujourd'hui.",
      "como-eliminar-deudas":
        "Méthodes efficaces pour sortir des dettes et retrouver votre liberté financière.",
      "errores-financieros":
        "Identifiez et évitez les erreurs qui affectent le plus vos finances personnelles.",
      "educacion-financiera-estudiantes":
        "Concepts financiers de base pensés pour les jeunes et les étudiants.",
      "gastos-hormiga":
        "Détectez ces petites dépenses quotidiennes qui grèvent votre budget sans que vous ne le remarquiez.",
      "metodos-de-ahorro":
        "Découvrez les méthodes d'épargne les plus populaires et choisissez celle qui vous convient le mieux.",
      "glosario-financiero":
        "Maîtrisez le vocabulaire financier clé avec des définitions claires et simples.",
    },
    detailTitles: {
      "como-crear-presupuesto": "Comment créer un budget",
      "regla-50-30-20": "Règle 50/30/20",
      "como-ahorrar-dinero": "Comment épargner de l'argent",
      "fondo-de-emergencia": "Qu'est-ce qu'un fonds d'urgence",
      "como-eliminar-deudas": "Comment éliminer les dettes",
      "errores-financieros": "Erreurs financières courantes",
      "educacion-financiera-estudiantes": "Éducation financière pour étudiants",
      "gastos-hormiga": "Comment contrôler les petites dépenses",
      "metodos-de-ahorro": "Méthodes d'épargne",
      "glosario-financiero": "Glossaire financier",
    },
    detailCategories: {
      "como-crear-presupuesto": "Budget",
      "regla-50-30-20": "Budget",
      "como-ahorrar-dinero": "Épargne",
      "fondo-de-emergencia": "Épargne",
      "como-eliminar-deudas": "Dette",
      "errores-financieros": "Éducation",
      "educacion-financiera-estudiantes": "Éducation",
      "gastos-hormiga": "Habitudes",
      "metodos-de-ahorro": "Épargne",
      "glosario-financiero": "Éducation",
    },
    detailIntros: {
      "como-crear-presupuesto":
        "Créer un budget de zéro n'est pas un exercice de restriction ou de discipline extrême ; c'est une façon de transformer le chaos financier en clarté. Lorsque vous apprenez à donner une destination à chaque peso, vous arrêtez de réagir à l'argent et commencez à le diriger avec intention, comme quelqu'un qui construit une carte avant d'entreprendre un voyage.",
      "regla-50-30-20":
        "La règle 50/30/20 a survécu aux modes financières parce qu'elle résout quelque chose de fondamental : elle vous donne un moyen simple de décider comment répartir ce que vous gagnez sans perdre de vue vos besoins ni vos rêves. C'est un outil pratique, mais aussi une philosophie d'équilibre entre survie, plaisir et construction de l'avenir.",
      "como-ahorrar-dinero":
        "Épargner ne consiste pas à renoncer à tout ce que vous appréciez ; il s'agit de décider, dès le départ, qu'une partie de votre argent a un but plus grand que la consommation immédiate. Lorsque l'épargne devient une pratique délibérée et automatique, elle cesse de sembler une imposition et commence à ressembler à une forme de liberté.",
      "fondo-de-emergencia":
        "Un fonds d'urgence n'est pas un luxe ni un objectif sophistiqué ; c'est la base la plus humble et la plus puissante de la stabilité financière. Lorsque la vie vous surprend avec une maladie, une perte de revenus ou une réparation urgente, ce coussin de liquidité peut faire la différence entre une crise temporaire et une catastrophe financière.",
      "como-eliminar-deudas":
        "Sortir des dettes n'est pas seulement une décision financière ; c'est une décision émotionnelle, psychologique et stratégique. La dette ne consomme pas seulement de l'argent, elle consomme également de l'énergie, de la tranquillité et une capacité à planifier. Lorsque vous apprenez à l'attaquer de manière ordonnée, le processus cesse de ressembler à une condamnation et commence à ressembler à une récupération.",
      "errores-financieros":
        "La richesse ne se construit pas seulement en gagnant davantage, mais en évitant les fuites de capital inutiles. Les erreurs financières les plus dommageables ne sont pas toujours les plus visibles : souvent, elles apparaissent sous forme d'habitudes apparemment innocentes qui, avec le temps, érodent vos revenus et votre stabilité.",
      "educacion-financiera-estudiantes":
        "L'éducation financière est l'une des compétences les plus précieuses qu'un étudiant puisse développer, car elle lui apprend à transformer des ressources limitées en opportunités réelles. Le moment où vous étudiez est parfait pour construire des habitudes solides avant l'apparition d'obligations plus importantes, comme le logement, la famille ou les dettes.",
      "gastos-hormiga":
        "Les petites dépenses sont des consommations quotidiennes de faible valeur nominale qui semblent insignifiantes, mais qui, lorsqu'elles s'accumulent, peuvent éroder silencieusement votre capacité à épargner. Ce n'est pas seulement un problème d'argent : c'est aussi un problème de conscience financière et d'habitudes automatiques.",
      "metodos-de-ahorro":
        "Il n'existe pas de méthode d'épargne unique qui fonctionne pour tous. La meilleure stratégie n'est pas la plus sophistiquée, mais celle qui s'adapte à votre personnalité, à votre rythme de revenus et à la volonté que vous avez réellement au quotidien.",
      "glosario-financiero":
        "Comprendre le langage des finances personnelles est la première étape pour prendre de meilleures décisions. Le problème n'est pas que la finance soit trop complexe, mais que le manque de vocabulaire pousse beaucoup de personnes à éviter de l'apprendre ou à suivre des conseils incomplets.",
    },
  },
};
