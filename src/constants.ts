import type { StudySession } from './types';

export const SUBJECT_THEMES: Record<string, string[]> = {
  'Cirurgia Geral': [
    'Abordagem inicial (ABCDE)','Trauma cranioencefálico (TCE)','Afecções urológicas benignas','Tumores urológicos','Aneurimas','Estenose de carótidas','Doença arterial periférica','Doenças venosas','Tumores pulmonares e do mediastino','Cirurgia pediátrica','Tumores cabeça e pescoço','Tumores dermatológicos','Fraturas ósseas','Luxações/lesões ligamentares','Tendinites/tenossinovites/fasceítes e bursites','Tumores ortopédicos','Ortopedia pediátrica','Trauma de face e pescoço','Trauma torácico','Trauma abdominal','Queimaduras','Anestesia','Cuidados pré-operatórios','Cuidados e complicações pós-operatórias','Feridas, enxertos e retalhos','Hérnias','Hemorragia digestiva','Síndrome disfágica','Síndrome dispéptica','Afecções benignas das vias biliares','Doença inflamatória intestinal','Abdome agudo inflamatório','Abdome agudo obstrutivo','Abdome agudo perfurativo','Abdome agudo isquêmico','Cólon e reto na cirurgia','Tumores do aparelho digestivo','Cirurgia da obesidade','Afecções pancreáticas',
  ],
  'Clínica Médica': [
    'Distúrbios Obstrutivos','Intoxicações exógenas e acidentes por animais peçonhentos','Hipertensão arterial sistêmica','Síndrome coronariana e diagnósticos diferenciais','Arritmias, síncope e PCR','Valvopatias e cardiomiopatias','Insuficiência cardíaca','Tuberculose','Infecções do sistema nervoso central','Síndromes febris','Endocardite e infecção de corrente sanguínea','HIV e AIDS','Hepatites e doenças do metabolismo da bilirrubina','Cirrose, insuficiência hepática e complicações','Artrites e diagnósticos diferenciais','Colagenoses e miopatias','Vasculites','Diabetes','Síndrome metabólica e dislipidemia','Tireoide','Paratireoides, suprarrenal e outras síndromes endócrinas','Anemias e hemoglobinopatias','Onco-hematologia','Distúrbios da hemostasia, desordens trombóticas e transfusão de hemocomponentes','Sepse, choque séptico e outros tipos de choque','Pneumointensivismo','Doenças infectoparasitárias com acometimento dermatológico','Farmacodermias e dermatoses','Geriatria e demências','Distúrbios hidroeletrolíticos e acidobásicos','Glomerulopatias e tubulopatias','Insuficiência renal','Cefaleias e Tumores do SNC','Síndromes neurológicas e fraqueza muscular','AVC','Embolia pulmonar e hipertensão pulmonar','Pneumonias e síndromes gripais','Transtornos mentais','Abuso de álcool, tabaco e outras substâncias','Radiografia - conceitos básicos','USG','Tomografia e ressonância',
  ],
  'Ginecologia e Obstetrícia': [
    'Ciclo menstrual','Contracepção','Amenorreias e síndrome dos ovários policísticos','Infertilidade conjugal','Climatério','Úlceras genitais','Vulvovaginites','Doença inflamatória pélvica e violência sexual','Dor pélvica crônica','Incontinência urinária e prolapsos de orgãos pélvicos','Rastreamento do câncer de colo uterino','Tumores do colo uterino','Tumores dos ovários','Doenças benignas da mama','Tumores malignos da mama','Doenças do corpo uterino e endométrio','Alojamento conjunto e testes de triagem neonatal','Sala de parto','Pré-natal','Estática fetal, pelve e mecanismo de parto','Assitência ao parto','Puerpério','Sangramento da primeira metade da gestação','Sangramento da segunda metade da gestação','Trabalho de parto prematuro','Rotura prematura de membranas ovulares e infecção ovular','Distúrbios hipertensivos na gravidez','Diabetes mellitus na gravidez','Hepatites virais, HIV/AIDS e outras infecções na gestação','Outras doenças na gestação','Sofrimento fetal','Medicina fetal','PALM-COEIN',
  ],
  'Pediatria': [
    'Período neonatal: doenças infecciosas','Crescimento e desenvolvimento na infância e adolescencia','Segurança e violência na infância','Distúrbios estaturais e puberais','Desordens do sistema imune','Imunizações','Doenças exantemáticas','Síndromes febris','Infecção do trato urinário (ITU)','Nariz, ouvido e laringe','Cardiopatias congênitas','Arritmias, síncope e PCR','Sepse, choque séptico e outros tipos de choque','Distúrbios obstrutivos','Parasitoses','Constipação intestinal','Síndromes diarreicas e disabsortivas','Epilepsia e síndromes convulsivas','Neonatal: doenças hematológicas','Neonatal: doenças do metabolismo','Neonatal: doenças respiratórias','Nutrição na pediatria','Distúrbios carenciais',
  ],
  'Medicina Preventiva e Social': [
    'Aspectos históricos do SUS','A evolução do SUS','Atenção primária à saúde','Níveis de prevenção','Perfis e indicadores demográficos','Indicadores de morbimortalidade','Estudos epidemiológicos (análise estatística e aplicação)','Estudos epidemiológicos (classificação)','Estatística de testes diagnósticos','Notificação','Epidemias, endemias e pandemias','Vigilância em saúde do trabalhados','Ética médica, bioética e documentação',
  ],
};


export const SUBJECTS = Object.keys(SUBJECT_THEMES);

export const INITIAL_SESSIONS: StudySession[] = [];

export const PORTFOLIO_CATEGORIES = [
    "Formação Acadêmica",
    "Monitorias e Ligas Acadêmicas",
    "Publicações Científicas",
    "Apresentações em Congressos",
    "Projetos de Extensão",
    "Iniciação Científica",
    "Estágios e Plantões",
    "Cursos e Certificados",
    "Atividades Voluntárias",
    "Outros",
];

// Data for Ready-Made Schedule (fixed weekly plan)
export const STUDY_PLAN_DATA = [
    {
        "week": 1,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Ciclo menstrual" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Contracepção" },
            { "subject": "Clínica Médica", "theme": "Glomerulopatias e tubulopatias" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Sala de parto" }
        ]
    },
    {
        "week": 2,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Alojamento conjunto e testes de triagem neonatal" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Amenorreias e síndrome dos ovários policísticos" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Infertilidade conjugal" },
            { "subject": "Cirurgia Geral", "theme": "Abordagem inicial (ABCDE)" }
        ]
    },
    {
        "week": 3,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Trauma cranioencefálico (TCE)" },
            { "subject": "Clínica Médica", "theme": "Insuficiência renal" },
            { "subject": "Medicina Preventiva e Social", "theme": "Aspectos históricos do SUS" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "PALM-COEIN" }
        ]
    },
    {
        "week": 4,
        "themes": [
            { "subject": "Pediatria", "theme": "Neonatal: doenças hematológicas" },
            { "subject": "Pediatria", "theme": "Neonatal: doenças do metabolismo" },
            { "subject": "Pediatria", "theme": "Neonatal: doenças respiratórias" },
            { "subject": "Clínica Médica", "theme": "Distúrbios hidroeletrolíticos e acidobásicos" }
        ]
    },
    {
        "week": 5,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Trauma de face e pescoço" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Climatério" },
            { "subject": "Medicina Preventiva e Social", "theme": "A evolução do SUS" },
            { "subject": "Pediatria", "theme": "Período neonatal: doenças infecciosas" }
        ]
    },
    {
        "week": 6,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Distúrbios Obstrutivos" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Pré-natal" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Estática fetal, pelve e mecanismo de parto" },
            { "subject": "Cirurgia Geral", "theme": "Trauma torácico" }
        ]
    },
    {
        "week": 7,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Trauma abdominal" },
            { "subject": "Clínica Médica", "theme": "Cefaleias e Tumores do SNC" },
            { "subject": "Pediatria", "theme": "Nutrição na pediatria" },
            { "subject": "Pediatria", "theme": "Distúrbios carenciais" }
        ]
    },
    {
        "week": 8,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Embolia pulmonar e hipertensão pulmonar" },
            { "subject": "Cirurgia Geral", "theme": "Queimaduras" },
            { "subject": "Clínica Médica", "theme": "Síndromes neurológicas e fraqueza muscular" },
            { "subject": "Clínica Médica", "theme": "AVC" }
        ]
    },
    {
        "week": 9,
        "themes": [
            { "subject": "Pediatria", "theme": "Crescimento e desenvolvimento na infância e adolescencia" },
            { "subject": "Pediatria", "theme": "Segurança e violência na infância" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Assitência ao parto" },
            { "subject": "Clínica Médica", "theme": "Geriatria e demências" }
        ]
    },
    {
        "week": 10,
        "themes": [
            { "subject": "Medicina Preventiva e Social", "theme": "Atenção primária à saúde" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Puerpério" },
            { "subject": "Cirurgia Geral", "theme": "Anestesia" },
            { "subject": "Cirurgia Geral", "theme": "Cuidados pré-operatórios" }
        ]
    },
    {
        "week": 11,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Cuidados e complicações pós-operatórias" },
            { "subject": "Medicina Preventiva e Social", "theme": "Níveis de prevenção" },
            { "subject": "Pediatria", "theme": "Distúrbios estaturais e puberais" },
            { "subject": "Clínica Médica", "theme": "Transtornos mentais" }
        ]
    },
    {
        "week": 12,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Abuso de álcool, tabaco e outras substâncias" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Úlceras genitais" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Vulvovaginites" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Doença inflamatória pélvica e violência sexual" }
        ]
    },
    {
        "week": 13,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Intoxicações exógenas e acidentes por animais peçonhentos" },
            { "subject": "Clínica Médica", "theme": "Hipertensão arterial sistêmica" },
            { "subject": "Pediatria", "theme": "Desordens do sistema imune" },
            { "subject": "Cirurgia Geral", "theme": "Feridas, enxertos e retalhos" }
        ]
    },
    {
        "week": 14,
        "themes": [
            { "subject": "Pediatria", "theme": "Imunizações" },
            { "subject": "Medicina Preventiva e Social", "theme": "Perfis e indicadores demográficos" },
            { "subject": "Cirurgia Geral", "theme": "Hérnias" },
            { "subject": "Cirurgia Geral", "theme": "Hemorragia digestiva" }
        ]
    },
    {
        "week": 15,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Dor pélvica crônica" },
            { "subject": "Clínica Médica", "theme": "Síndrome coronariana e diagnósticos diferenciais" },
            { "subject": "Cirurgia Geral", "theme": "Síndrome disfágica" },
            { "subject": "Cirurgia Geral", "theme": "Síndrome dispéptica" }
        ]
    },
    {
        "week": 16,
        "themes": [
            { "subject": "Pediatria", "theme": "Doenças exantemáticas" },
            { "subject": "Clínica Médica", "theme": "Pneumonias e síndromes gripais" },
            { "subject": "Cirurgia Geral", "theme": "Afecções benignas das vias biliares" },
            { "subject": "Clínica Médica", "theme": "Arritmias, síncope e PCR" }
        ]
    },
    {
        "week": 17,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Síndromes febris" },
            { "subject": "Pediatria", "theme": "Infecção do trato urinário (ITU)" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Sangramento da primeira metade da gestação" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Sangramento da segunda metade da gestação" }
        ]
    },
    {
        "week": 18,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Valvopatias e cardiomiopatias" },
            { "subject": "Pediatria", "theme": "Nariz, ouvido e laringe" },
            { "subject": "Clínica Médica", "theme": "Insuficiência cardíaca" },
            { "subject": "Pediatria", "theme": "Cardiopatias congênitas" }
        ]
    },
    {
        "week": 19,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Doença inflamatória intestinal" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Trabalho de parto prematuro" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Rotura prematura de membranas ovulares e infecção ovular" },
            { "subject": "Medicina Preventiva e Social", "theme": "Indicadores de morbimortalidade" }
        ]
    },
    {
        "week": 20,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Tuberculose" },
            { "subject": "Clínica Médica", "theme": "Infecções do sistema nervoso central" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Incontinência urinária e prolapsos de orgãos pélvicos" },
            { "subject": "Cirurgia Geral", "theme": "Abdome agudo inflamatório" }
        ]
    },
    {
        "week": 21,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Abdome agudo obstrutivo" },
            { "subject": "Cirurgia Geral", "theme": "Abdome agudo perfurativo" },
            { "subject": "Cirurgia Geral", "theme": "Abdome agudo isquêmico" },
            { "subject": "Clínica Médica", "theme": "Síndromes febris" }
        ]
    },
    {
        "week": 22,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Rastreamento do câncer de colo uterino" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Tumores do colo uterino" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Tumores dos ovários" },
            { "subject": "Clínica Médica", "theme": "Endocardite e infecção de corrente sanguínea" }
        ]
    },
    {
        "week": 23,
        "themes": [
            { "subject": "Clínica Médica", "theme": "HIV e AIDS" },
            { "subject": "Medicina Preventiva e Social", "theme": "Estudos epidemiológicos (análise estatística e aplicação)" },
            { "subject": "Cirurgia Geral", "theme": "Cólon e reto na cirurgia" },
            { "subject": "Medicina Preventiva e Social", "theme": "Estudos epidemiológicos (classificação)" }
        ]
    },
    {
        "week": 24,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Tumores do aparelho digestivo" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Doenças benignas da mama" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Tumores malignos da mama" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Doenças do corpo uterino e endométrio" }
        ]
    },
    {
        "week": 25,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Cirurgia da obesidade" },
            { "subject": "Clínica Médica", "theme": "Arritmias, síncope e PCR" },
            { "subject": "Clínica Médica", "theme": "Hepatites e doenças do metabolismo da bilirrubina" },
            { "subject": "Clínica Médica", "theme": "Cirrose, insuficiência hepática e complicações" }
        ]
    },
    {
        "week": 26,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Afecções pancreáticas" },
            { "subject": "Clínica Médica", "theme": "Artrites e diagnósticos diferenciais" },
            { "subject": "Clínica Médica", "theme": "Sepse, choque séptico e outros tipos de choque" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Distúrbios hipertensivos na gravidez" }
        ]
    },
    {
        "week": 27,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Diabetes mellitus na gravidez" },
            { "subject": "Clínica Médica", "theme": "Colagenoses e miopatias" },
            { "subject": "Pediatria", "theme": "Distúrbios obstrutivos" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Hepatites virais, HIV/AIDS e outras infecções na gestação" }
        ]
    },
    {
        "week": 28,
        "themes": [
            { "subject": "Pediatria", "theme": "Parasitoses" },
            { "subject": "Pediatria", "theme": "Constipação intestinal" },
            { "subject": "Pediatria", "theme": "Síndromes diarreicas e disabsortivas" },
            { "subject": "Medicina Preventiva e Social", "theme": "Estatística de testes diagnósticos" }
        ]
    },
    {
        "week": 29,
        "themes": [
            { "subject": "Ginecologia e Obstetrícia", "theme": "Outras doenças na gestação" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Sofrimento fetal" },
            { "subject": "Clínica Médica", "theme": "Vasculites" },
            { "subject": "Cirurgia Geral", "theme": "Afecções urológicas benignas" }
        ]
    },
    {
        "week": 30,
        "themes": [
            { "subject": "Medicina Preventiva e Social", "theme": "Notificação" },
            { "subject": "Medicina Preventiva e Social", "theme": "Epidemias, endemias e pandemias" },
            { "subject": "Cirurgia Geral", "theme": "Tumores urológicos" },
            { "subject": "Clínica Médica", "theme": "Diabetes" }
        ]
    },
    {
        "week": 31,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Síndrome metabólica e dislipidemia" },
            { "subject": "Ginecologia e Obstetrícia", "theme": "Medicina fetal" },
            { "subject": "Clínica Médica", "theme": "Tireoide" },
            { "subject": "Clínica Médica", "theme": "Paratireoides, suprarrenal e outras síndromes endócrinas" }
        ]
    },
    {
        "week": 32,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Aneurimas" },
            { "subject": "Cirurgia Geral", "theme": "Estenose de carótidas" },
            { "subject": "Medicina Preventiva e Social", "theme": "Vigilância em saúde do trabalhados" },
            { "subject": "Cirurgia Geral", "theme": "Doença arterial periférica" }
        ]
    },
    {
        "week": 33,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Doenças venosas" },
            { "subject": "Pediatria", "theme": "Epilepsia e síndromes convulsivas" },
            { "subject": "Clínica Médica", "theme": "Anemias e hemoglobinopatias" },
            { "subject": "Medicina Preventiva e Social", "theme": "Ética médica, bioética e documentação" }
        ]
    },
    {
        "week": 34,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Onco-hematologia" },
            { "subject": "Cirurgia Geral", "theme": "Tumores pulmonares e do mediastino" },
            { "subject": "Cirurgia Geral", "theme": "Cirurgia pediátrica" },
            { "subject": "Cirurgia Geral", "theme": "Tumores cabeça e pescoço" }
        ]
    },
    {
        "week": 35,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Distúrbios da hemostasia, desordens trombóticas e transfusão de hemocomponentes" },
            { "subject": "Clínica Médica", "theme": "Sepse, choque séptico e outros tipos de choque" },
            { "subject": "Clínica Médica", "theme": "Pneumointensivismo" },
            { "subject": "Clínica Médica", "theme": "Doenças infectoparasitárias com acometimento dermatológico" }
        ]
    },
    {
        "week": 36,
        "themes": [
            { "subject": "Clínica Médica", "theme": "Farmacodermias e dermatoses" },
            { "subject": "Cirurgia Geral", "theme": "Tumores dermatológicos" },
            { "subject": "Cirurgia Geral", "theme": "Fraturas ósseas" },
            { "subject": "Cirurgia Geral", "theme": "Luxações/lesões ligamentares" }
        ]
    },
    {
        "week": 37,
        "themes": [
            { "subject": "Cirurgia Geral", "theme": "Tendinites/tenossinovites/fasceítes e bursites" },
            { "subject": "Cirurgia Geral", "theme": "Tumores ortopédicos" },
            { "subject": "Cirurgia Geral", "theme": "Ortopedia pediátrica" },
            { "subject": "Clínica Médica", "theme": "Radiografia - conceitos básicos" }
        ]
    },
    {
        "week": 38,
        "themes": [
            { "subject": "Clínica Médica", "theme": "USG" },
            { "subject": "Clínica Médica", "theme": "Tomografia e ressonância" }
        ]
    }
];


// Data for Study Plan by Rotation
const createRotationPlan = () => {
    const plan: Record<string, { week: number; themes: string[] }[]> = {};
    for (const subject of SUBJECTS) {
        const themes = SUBJECT_THEMES[subject];
        plan[subject] = [];
        let weekCounter = 1;
        for (let i = 0; i < themes.length; i += 4) {
            plan[subject].push({
                week: weekCounter++,
                themes: themes.slice(i, i + 4)
            });
        }
    }
    return plan;
};

export const ROTATION_STUDY_PLAN = createRotationPlan();