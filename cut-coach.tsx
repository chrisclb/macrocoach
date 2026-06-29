import { useState, useEffect, useRef } from "react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const LANGS = {
  de: {
    flag:"🇩🇪", name:"Deutsch",
    nav: { logo:"MacroCoach", pricing:"Preise", start:"Jetzt starten" },
    hero: {
      badge:"KI-gestützter Ernährungscoach",
      h1a:"Dein Körper.", h1b:"Dein Ziel.", h1c:"Dein Plan.",
      sub:"Präzise Kalorienberechnung basierend auf deiner Körperzusammensetzung — kostenlos & wissenschaftlich fundiert.",
      cta:"Kostenlos berechnen", ctaSub:"Keine Anmeldung erforderlich",
      stats:[{v:"50k+",l:"Nutzer"},{v:"99%",l:"Genauigkeit"},{v:"3",l:"Ziele"},{v:"5",l:"Sprachen"}],
    },
    goals: {
      title:"Wähle dein Ziel",
      list:[
        { key:"cut",   emoji:"🔥", label:"Abnehmen",    desc:"Fett verlieren, Muskeln erhalten",       color:"#ff7b35" },
        { key:"bulk",  emoji:"💪", label:"Aufbauen",    desc:"Muskelmasse & Kraft aufbauen",            color:"#00ff9d" },
        { key:"maint", emoji:"⚖️", label:"Halten",      desc:"Gewicht & Energie konstant halten",       color:"#00d4ff" },
      ],
    },
    form: {
      title:"Deine Daten",
      gender:"Geschlecht", male:"♂ Mann", female:"♀ Frau",
      age:"Alter", ageU:" J",
      weight:"Gewicht", weightU:" kg",
      height:"Größe", heightU:" cm",
      kfa:"Körperfettanteil (KFA)", kfaU:"%",
      actTitle:"Aktivitätslevel",
      acts:[
        {l:"Kaum aktiv",d:"Bürojob, kein Sport"},
        {l:"Leicht aktif",d:"1–2× Sport / Woche"},
        {l:"Moderat aktiv",d:"3–5× Sport / Woche"},
        {l:"Sehr aktiv",d:"6–7× Sport / Woche"},
        {l:"Extrem aktiv",d:"Athleten / Doppeleinheiten"},
      ],
      btn:"⚡ Plan berechnen",
    },
    results: {
      tdeeLabel:"Dein Erhaltungsbedarf (TDEE)",
      kcalDay:"kcal / Tag", bmr:"BMR", lean:"Magermasse",
      goalLabel: { cut:"Deine Cut-Pläne", bulk:"Deine Bulk-Pläne", maint:"Dein Erhaltungsplan" },
      tiers: {
        cut:[
          {k:"mod",l:"Moderat",def:300,note:"~0.3 kg/Wo."},
          {k:"agg",l:"Aggressiv",def:500,note:"~0.5 kg/Wo."},
          {k:"ext",l:"Extrem",def:750,note:"~0.75 kg/Wo. ⚠️"},
        ],
        bulk:[
          {k:"lean",l:"Lean Bulk",sur:200,note:"~0.2 kg/Wo."},
          {k:"mod",l:"Moderat",sur:400,note:"~0.4 kg/Wo."},
          {k:"dirty",l:"Dirty Bulk",sur:700,note:"~0.7 kg/Wo. ⚠️"},
        ],
        maint:[{k:"m",l:"Erhalt",sur:0,note:"±0 kg/Wo."}],
      },
      prot:"Protein", carbs:"Carbs", fat:"Fett",
      deficit:"Defizit", surplus:"Überschuss",
      tipsTitle:"Coach-Tipps",
      tips:{
        cut:(p)=>[
          `🥩 Mindestens ${p}g Protein/Tag — schützt Muskelmasse beim Cut.`,
          "💧 35–40ml Wasser pro kg Körpergewicht täglich.",
          "🏋️ Krafttraining beibehalten — Muskeln sind dein Stoffwechselmotor.",
          "😴 7–9h Schlaf: Cortisol & Fetteinlagerung steigen bei Schlafmangel.",
          "⚠️ Extremes Defizit nur kurzfristig — danach Diätpause einplanen.",
        ],
        bulk:(p)=>[
          `🥩 Mindestens ${p}g Protein/Tag — essenziell für Muskelaufbau.`,
          "📈 Progressiv überlasten — steigere Gewicht oder Wiederholungen jede Woche.",
          "💤 8–9h Schlaf: Testosteron & Wachstumshormone steigen im Tiefschlaf.",
          "🥗 Fokus auf nährstoffdichte Lebensmittel, nicht leere Kalorien.",
          "📅 Dirty Bulk nur für Hardgainer — erhöht langfristig den Fettanteil.",
        ],
        maint:(p)=>[
          `🥩 ${p}g Protein/Tag hält Muskeln & Sättigung stabil.`,
          "⚖️ Wöchentlich wiegen — Schwankungen ±1 kg sind normal.",
          "🔄 Alle 4–6 Wochen Körperzusammensetzung neu messen.",
          "🏃 Kardio für Herzgesundheit, Kraft für Stoffwechsel.",
          "🧘 Weniger Stress senkt Cortisol & verhindert Körperfett-Aufbau.",
        ],
      },
      premiumCta:"🔒 KI-Wochenplan freischalten",
      premiumSub:"Nur mit Premium verfügbar",
    },
    premium: {
      badge:"Premium",
      title:"Alles was du brauchst,",
      titleB:"um dein Ziel zu erreichen.",
      sub:"Einmalige Zahlung. Kein Abo. Für immer.",
      plans:[
        {
          name:"Gratis", price:"0€", period:"für immer", highlight:false,
          features:["Kalorienrechner","3 Ziele (Cut/Bulk/Halten)","Makro-Aufteilung","5 Sprachen","Coach-Tipps"],
          locked:[],
          cta:"Aktueller Plan",
        },
        {
          name:"Premium", price:"4,99€", period:"einmalig", highlight:true,
          features:["Alles aus Gratis","KI-generierter Wochenplan","Mahlzeitenvorschläge","Fortschritts-Tracking","PDF-Export","Prioritäts-Support"],
          locked:[],
          cta:"Premium holen →",
        },
      ],
      popular:"Beliebt",
    },
    footer:{
      tag:"Präzise. Wissenschaftlich. Kostenlos.",
      links:["Datenschutz","Impressum","Kontakt"],
      copy:"© 2025 MacroCoach. Alle Rechte vorbehalten.",
    },
  },
  en: {
    flag:"🇬🇧", name:"English",
    nav:{logo:"MacroCoach",pricing:"Pricing",start:"Get started"},
    hero:{
      badge:"AI-powered nutrition coach",
      h1a:"Your body.", h1b:"Your goal.", h1c:"Your plan.",
      sub:"Precise calorie calculation based on your body composition — free & science-backed.",
      cta:"Calculate for free", ctaSub:"No sign-up required",
      stats:[{v:"50k+",l:"Users"},{v:"99%",l:"Accuracy"},{v:"3",l:"Goals"},{v:"5",l:"Languages"}],
    },
    goals:{
      title:"Choose your goal",
      list:[
        {key:"cut",emoji:"🔥",label:"Cut",desc:"Lose fat while preserving muscle",color:"#ff7b35"},
        {key:"bulk",emoji:"💪",label:"Bulk",desc:"Build muscle mass & strength",color:"#00ff9d"},
        {key:"maint",emoji:"⚖️",label:"Maintain",desc:"Keep weight & energy stable",color:"#00d4ff"},
      ],
    },
    form:{
      title:"Your Data",
      gender:"Gender",male:"♂ Male",female:"♀ Female",
      age:"Age",ageU:" yrs",weight:"Weight",weightU:" kg",height:"Height",heightU:" cm",
      kfa:"Body Fat % (BF%)",kfaU:"%",
      actTitle:"Activity Level",
      acts:[
        {l:"Sedentary",d:"Desk job, no exercise"},
        {l:"Lightly active",d:"1–2× exercise / week"},
        {l:"Moderately active",d:"3–5× exercise / week"},
        {l:"Very active",d:"6–7× exercise / week"},
        {l:"Extremely active",d:"Athletes / double sessions"},
      ],
      btn:"⚡ Calculate my plan",
    },
    results:{
      tdeeLabel:"Your Maintenance Calories (TDEE)",
      kcalDay:"kcal / day",bmr:"BMR",lean:"Lean Mass",
      goalLabel:{cut:"Your Cut Plans",bulk:"Your Bulk Plans",maint:"Your Maintenance Plan"},
      tiers:{
        cut:[
          {k:"mod",l:"Moderate",def:300,note:"~0.3 kg/wk"},
          {k:"agg",l:"Aggressive",def:500,note:"~0.5 kg/wk"},
          {k:"ext",l:"Extreme",def:750,note:"~0.75 kg/wk ⚠️"},
        ],
        bulk:[
          {k:"lean",l:"Lean Bulk",sur:200,note:"~0.2 kg/wk"},
          {k:"mod",l:"Moderate",sur:400,note:"~0.4 kg/wk"},
          {k:"dirty",l:"Dirty Bulk",sur:700,note:"~0.7 kg/wk ⚠️"},
        ],
        maint:[{k:"m",l:"Maintenance",sur:0,note:"±0 kg/wk"}],
      },
      prot:"Protein",carbs:"Carbs",fat:"Fat",
      deficit:"deficit",surplus:"surplus",
      tipsTitle:"Coach Tips",
      tips:{
        cut:(p)=>[
          `🥩 Eat at least ${p}g protein/day — protects muscle during a cut.`,
          "💧 Drink 35–40ml water per kg of bodyweight daily.",
          "🏋️ Keep lifting — muscle is your metabolic engine.",
          "😴 7–9h sleep: poor sleep raises cortisol & fat storage.",
          "⚠️ Extreme deficits short-term only — plan a diet break afterward.",
        ],
        bulk:(p)=>[
          `🥩 At least ${p}g protein/day — essential for muscle growth.`,
          "📈 Progressive overload — add weight or reps each week.",
          "💤 8–9h sleep: testosterone & GH peak during deep sleep.",
          "🥗 Focus on nutrient-dense foods, not empty calories.",
          "📅 Dirty bulk only for hardgainers — increases fat long-term.",
        ],
        maint:(p)=>[
          `🥩 ${p}g protein/day keeps muscle & satiety stable.`,
          "⚖️ Weigh weekly — ±1 kg fluctuations are normal.",
          "🔄 Re-assess body composition every 4–6 weeks.",
          "🏃 Cardio for heart health, strength for metabolism.",
          "🧘 Less stress lowers cortisol & prevents fat gain.",
        ],
      },
      premiumCta:"🔒 Unlock AI Week Plan",
      premiumSub:"Premium feature",
    },
    premium:{
      badge:"Premium",
      title:"Everything you need",
      titleB:"to reach your goal.",
      sub:"One-time payment. No subscription. Forever.",
      plans:[
        {name:"Free",price:"$0",period:"forever",highlight:false,
          features:["Calorie calculator","3 goals (Cut/Bulk/Maintain)","Macro split","5 languages","Coach tips"],
          locked:[],cta:"Current plan"},
        {name:"Premium",price:"$4.99",period:"one-time",highlight:true,
          features:["Everything in Free","AI-generated week plan","Meal suggestions","Progress tracking","PDF export","Priority support"],
          locked:[],cta:"Get Premium →"},
      ],
      popular:"Popular",
    },
    footer:{
      tag:"Precise. Science-backed. Free.",
      links:["Privacy","Imprint","Contact"],
      copy:"© 2025 MacroCoach. All rights reserved.",
    },
  },
  es: {
    flag:"🇪🇸",name:"Español",
    nav:{logo:"MacroCoach",pricing:"Precios",start:"Empezar"},
    hero:{
      badge:"Coach nutricional con IA",
      h1a:"Tu cuerpo.",h1b:"Tu objetivo.",h1c:"Tu plan.",
      sub:"Cálculo preciso de calorías basado en tu composición corporal — gratis y respaldado por la ciencia.",
      cta:"Calcular gratis",ctaSub:"Sin registro",
      stats:[{v:"50k+",l:"Usuarios"},{v:"99%",l:"Precisión"},{v:"3",l:"Objetivos"},{v:"5",l:"Idiomas"}],
    },
    goals:{
      title:"Elige tu objetivo",
      list:[
        {key:"cut",emoji:"🔥",label:"Definir",desc:"Perder grasa conservando músculo",color:"#ff7b35"},
        {key:"bulk",emoji:"💪",label:"Volumen",desc:"Ganar masa muscular y fuerza",color:"#00ff9d"},
        {key:"maint",emoji:"⚖️",label:"Mantener",desc:"Estabilizar peso y energía",color:"#00d4ff"},
      ],
    },
    form:{
      title:"Tus datos",
      gender:"Sexo",male:"♂ Hombre",female:"♀ Mujer",
      age:"Edad",ageU:" años",weight:"Peso",weightU:" kg",height:"Altura",heightU:" cm",
      kfa:"% Grasa Corporal",kfaU:"%",
      actTitle:"Nivel de Actividad",
      acts:[
        {l:"Sedentario",d:"Trabajo oficina, sin ejercicio"},
        {l:"Ligeramente activo",d:"1–2× ejercicio / semana"},
        {l:"Moderadamente activo",d:"3–5× ejercicio / semana"},
        {l:"Muy activo",d:"6–7× ejercicio / semana"},
        {l:"Extremadamente activo",d:"Atletas / dobles sesiones"},
      ],
      btn:"⚡ Calcular mi plan",
    },
    results:{
      tdeeLabel:"Tu Mantenimiento Calórico (TDEE)",
      kcalDay:"kcal / día",bmr:"TMB",lean:"Masa Magra",
      goalLabel:{cut:"Tus planes de definición",bulk:"Tus planes de volumen",maint:"Tu plan de mantenimiento"},
      tiers:{
        cut:[{k:"mod",l:"Moderado",def:300,note:"~0.3 kg/sem"},{k:"agg",l:"Agresivo",def:500,note:"~0.5 kg/sem"},{k:"ext",l:"Extremo",def:750,note:"~0.75 kg/sem ⚠️"}],
        bulk:[{k:"lean",l:"Lean Bulk",sur:200,note:"~0.2 kg/sem"},{k:"mod",l:"Moderado",sur:400,note:"~0.4 kg/sem"},{k:"dirty",l:"Dirty Bulk",sur:700,note:"~0.7 kg/sem ⚠️"}],
        maint:[{k:"m",l:"Mantenimiento",sur:0,note:"±0 kg/sem"}],
      },
      prot:"Proteína",carbs:"Carbos",fat:"Grasa",deficit:"déficit",surplus:"superávit",
      tipsTitle:"Consejos del Coach",
      tips:{
        cut:(p)=>[`🥩 Al menos ${p}g proteína/día.`,"💧 35–40ml agua por kg de peso.","🏋️ Mantén el entreno de fuerza.","😴 7–9h sueño.","⚠️ Déficit extremo solo a corto plazo."],
        bulk:(p)=>[`🥩 Al menos ${p}g proteína/día.`,"📈 Sobrecarga progresiva cada semana.","💤 8–9h sueño para hormona del crecimiento.","🥗 Alimentos densos en nutrientes.","📅 Dirty bulk solo para hardgainers."],
        maint:(p)=>[`🥩 ${p}g proteína/día.`,"⚖️ Pésate semanalmente.","🔄 Reevalúa cada 4–6 semanas.","🏃 Cardio + fuerza.","🧘 Reduce el estrés."],
      },
      premiumCta:"🔒 Desbloquear plan semanal IA",premiumSub:"Solo Premium",
    },
    premium:{
      badge:"Premium",title:"Todo lo que necesitas",titleB:"para lograr tu objetivo.",
      sub:"Pago único. Sin suscripción. Para siempre.",
      plans:[
        {name:"Gratis",price:"0€",period:"siempre",highlight:false,features:["Calculadora","3 objetivos","Macros","5 idiomas","Consejos"],locked:[],cta:"Plan actual"},
        {name:"Premium",price:"4,99€",period:"único",highlight:true,features:["Todo Gratis","Plan semanal IA","Sugerencias de comidas","Seguimiento","PDF","Soporte"],locked:[],cta:"Obtener Premium →"},
      ],
      popular:"Popular",
    },
    footer:{tag:"Preciso. Científico. Gratis.",links:["Privacidad","Aviso legal","Contacto"],copy:"© 2025 MacroCoach. Todos los derechos reservados."},
  },
  fr: {
    flag:"🇫🇷",name:"Français",
    nav:{logo:"MacroCoach",pricing:"Tarifs",start:"Commencer"},
    hero:{
      badge:"Coach nutrition alimenté par IA",
      h1a:"Votre corps.",h1b:"Votre objectif.",h1c:"Votre plan.",
      sub:"Calcul précis des calories basé sur votre composition corporelle — gratuit et scientifique.",
      cta:"Calculer gratuitement",ctaSub:"Sans inscription",
      stats:[{v:"50k+",l:"Utilisateurs"},{v:"99%",l:"Précision"},{v:"3",l:"Objectifs"},{v:"5",l:"Langues"}],
    },
    goals:{
      title:"Choisissez votre objectif",
      list:[
        {key:"cut",emoji:"🔥",label:"Sécher",desc:"Perdre du gras en gardant le muscle",color:"#ff7b35"},
        {key:"bulk",emoji:"💪",label:"Masse",desc:"Gagner du muscle et de la force",color:"#00ff9d"},
        {key:"maint",emoji:"⚖️",label:"Maintenir",desc:"Stabiliser poids et énergie",color:"#00d4ff"},
      ],
    },
    form:{
      title:"Vos données",
      gender:"Sexe",male:"♂ Homme",female:"♀ Femme",
      age:"Âge",ageU:" ans",weight:"Poids",weightU:" kg",height:"Taille",heightU:" cm",
      kfa:"Taux de Masse Grasse",kfaU:"%",
      actTitle:"Niveau d'Activité",
      acts:[
        {l:"Sédentaire",d:"Bureau, sans exercice"},
        {l:"Légèrement actif",d:"1–2× sport / semaine"},
        {l:"Modérément actif",d:"3–5× sport / semaine"},
        {l:"Très actif",d:"6–7× sport / semaine"},
        {l:"Extrêmement actif",d:"Athlètes / doubles séances"},
      ],
      btn:"⚡ Calculer mon plan",
    },
    results:{
      tdeeLabel:"Votre Dépense Énergétique (TDEE)",
      kcalDay:"kcal / jour",bmr:"MB",lean:"Masse Maigre",
      goalLabel:{cut:"Vos plans de sèche",bulk:"Vos plans de prise de masse",maint:"Votre plan de maintien"},
      tiers:{
        cut:[{k:"mod",l:"Modéré",def:300,note:"~0.3 kg/sem"},{k:"agg",l:"Agressif",def:500,note:"~0.5 kg/sem"},{k:"ext",l:"Extrême",def:750,note:"~0.75 kg/sem ⚠️"}],
        bulk:[{k:"lean",l:"Lean Bulk",sur:200,note:"~0.2 kg/sem"},{k:"mod",l:"Modéré",sur:400,note:"~0.4 kg/sem"},{k:"dirty",l:"Dirty Bulk",sur:700,note:"~0.7 kg/sem ⚠️"}],
        maint:[{k:"m",l:"Maintien",sur:0,note:"±0 kg/sem"}],
      },
      prot:"Protéines",carbs:"Glucides",fat:"Lipides",deficit:"déficit",surplus:"surplus",
      tipsTitle:"Conseils du Coach",
      tips:{
        cut:(p)=>[`🥩 Au moins ${p}g protéines/jour.`,"💧 35–40ml d'eau par kg de poids.","🏋️ Gardez la musculation.","😴 7–9h de sommeil.","⚠️ Déficit extrême court terme seulement."],
        bulk:(p)=>[`🥩 Au moins ${p}g protéines/jour.`,"📈 Surcharge progressive chaque semaine.","💤 8–9h sommeil.","🥗 Aliments denses en nutriments.","📅 Dirty bulk pour hardgainers uniquement."],
        maint:(p)=>[`🥩 ${p}g protéines/jour.`,"⚖️ Pesée hebdomadaire.","🔄 Réévaluer toutes les 4–6 semaines.","🏃 Cardio + force.","🧘 Réduire le stress."],
      },
      premiumCta:"🔒 Débloquer le plan IA",premiumSub:"Fonctionnalité Premium",
    },
    premium:{
      badge:"Premium",title:"Tout ce dont vous avez besoin",titleB:"pour atteindre votre objectif.",
      sub:"Paiement unique. Sans abonnement. Pour toujours.",
      plans:[
        {name:"Gratuit",price:"0€",period:"pour toujours",highlight:false,features:["Calculateur","3 objectifs","Macros","5 langues","Conseils"],locked:[],cta:"Plan actuel"},
        {name:"Premium",price:"4,99€",period:"unique",highlight:true,features:["Tout Gratuit","Plan semaine IA","Suggestions repas","Suivi","PDF","Support"],locked:[],cta:"Obtenir Premium →"},
      ],
      popular:"Populaire",
    },
    footer:{tag:"Précis. Scientifique. Gratuit.",links:["Confidentialité","Mentions légales","Contact"],copy:"© 2025 MacroCoach. Tous droits réservés."},
  },
  tr: {
    flag:"🇹🇷",name:"Türkçe",
    nav:{logo:"MacroCoach",pricing:"Fiyatlar",start:"Başla"},
    hero:{
      badge:"Yapay zeka destekli beslenme koçu",
      h1a:"Vücudun.",h1b:"Hedefin.",h1c:"Planın.",
      sub:"Vücut kompozisyonuna dayalı hassas kalori hesabı — ücretsiz ve bilimsel.",
      cta:"Ücretsiz hesapla",ctaSub:"Kayıt gerekmez",
      stats:[{v:"50k+",l:"Kullanıcı"},{v:"99%",l:"Doğruluk"},{v:"3",l:"Hedef"},{v:"5",l:"Dil"}],
    },
    goals:{
      title:"Hedefini seç",
      list:[
        {key:"cut",emoji:"🔥",label:"Yağ Yakma",desc:"Kas koruyarak yağ yakmak",color:"#ff7b35"},
        {key:"bulk",emoji:"💪",label:"Kas Yapma",desc:"Kas kütlesi ve güç inşa etmek",color:"#00ff9d"},
        {key:"maint",emoji:"⚖️",label:"Koruma",desc:"Kilo ve enerjiyi sabit tutmak",color:"#00d4ff"},
      ],
    },
    form:{
      title:"Bilgilerin",
      gender:"Cinsiyet",male:"♂ Erkek",female:"♀ Kadın",
      age:"Yaş",ageU:" yaş",weight:"Kilo",weightU:" kg",height:"Boy",heightU:" cm",
      kfa:"Vücut Yağ Oranı",kfaU:"%",
      actTitle:"Aktivite Seviyesi",
      acts:[
        {l:"Hareketsiz",d:"Masa işi, spor yok"},
        {l:"Az aktif",d:"Haftada 1–2× spor"},
        {l:"Orta aktif",d:"Haftada 3–5× spor"},
        {l:"Çok aktif",d:"Haftada 6–7× spor"},
        {l:"Aşırı aktif",d:"Sporcular / çift antrenman"},
      ],
      btn:"⚡ Planımı hesapla",
    },
    results:{
      tdeeLabel:"Günlük Kalori İhtiyacın (TDEE)",
      kcalDay:"kcal / gün",bmr:"BMH",lean:"Yağsız Kütle",
      goalLabel:{cut:"Yağ Yakma Planların",bulk:"Kas Yapma Planların",maint:"Koruma Planın"},
      tiers:{
        cut:[{k:"mod",l:"Orta",def:300,note:"~0.3 kg/hafta"},{k:"agg",l:"Agresif",def:500,note:"~0.5 kg/hafta"},{k:"ext",l:"Aşırı",def:750,note:"~0.75 kg/hafta ⚠️"}],
        bulk:[{k:"lean",l:"Lean Bulk",sur:200,note:"~0.2 kg/hafta"},{k:"mod",l:"Orta",sur:400,note:"~0.4 kg/hafta"},{k:"dirty",l:"Dirty Bulk",sur:700,note:"~0.7 kg/hafta ⚠️"}],
        maint:[{k:"m",l:"Koruma",sur:0,note:"±0 kg/hafta"}],
      },
      prot:"Protein",carbs:"Karb",fat:"Yağ",deficit:"açık",surplus:"fazla",
      tipsTitle:"Koç Tavsiyeleri",
      tips:{
        cut:(p)=>[`🥩 Günde en az ${p}g protein.`,"💧 Günlük 35–40ml su/kg.","🏋️ Ağırlık antrenmanını bırakma.","😴 7–9 saat uyku.","⚠️ Aşırı açık yalnızca kısa vadeli."],
        bulk:(p)=>[`🥩 Günde en az ${p}g protein.`,"📈 Her hafta progresif yüklenme.","💤 8–9 saat uyku.","🥗 Besin yoğun gıdalar.","📅 Dirty bulk yalnızca hardgainerlar için."],
        maint:(p)=>[`🥩 Günlük ${p}g protein.`,"⚖️ Haftalık tartı.","🔄 4–6 haftada bir değerlendir.","🏃 Kardio + güç.","🧘 Stresi azalt."],
      },
      premiumCta:"🔒 Yapay Zeka Haftalık Planı Aç",premiumSub:"Premium özellik",
    },
    premium:{
      badge:"Premium",title:"İhtiyacın olan her şey",titleB:"hedefine ulaşmak için.",
      sub:"Tek seferlik ödeme. Abonelik yok. Sonsuza kadar.",
      plans:[
        {name:"Ücretsiz",price:"₺0",period:"sonsuza kadar",highlight:false,features:["Hesap makinesi","3 hedef","Makrolar","5 dil","Tavsiyeler"],locked:[],cta:"Mevcut plan"},
        {name:"Premium",price:"₺149",period:"tek seferlik",highlight:true,features:["Ücretsizin hepsi","Yapay zeka haftalık planı","Öğün önerileri","Takip","PDF","Destek"],locked:[],cta:"Premium Al →"},
      ],
      popular:"Popüler",
    },
    footer:{tag:"Hassas. Bilimsel. Ücretsiz.",links:["Gizlilik","Künye","İletişim"],copy:"© 2025 MacroCoach. Tüm haklar saklıdır."},
  },
};

const ACT_FACTORS = [1.2,1.375,1.55,1.725,1.9];
const GOAL_COLORS = { cut:"#ff7b35", bulk:"#00ff9d", maint:"#00d4ff" };
const TIER_COLORS = ["#00ff9d","#00d4ff","#ff7b35"];

// ─── Micro components ─────────────────────────────────────────────────────────
function Ring({ value, max, label, color, size=160 }) {
  const [d, setD] = useState(0);
  const r = size/2*0.78, circ = 2*Math.PI*r;
  useEffect(()=>{
    if(!value){setD(0);return;}
    let s=null; const dur=900,to=value;
    const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1),e=1-Math.pow(1-p,3);setD(Math.round(to*e));if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  },[value]);
  const off = circ*(1-Math.min(d/max,1));
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2530" strokeWidth={size*0.09}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
          strokeDasharray={circ} strokeDashoffset={value?off:circ} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.05s linear"}}/>
        <text x={size/2} y={size/2+2} textAnchor="middle" dominantBaseline="middle"
          fill="#f0f4f8" fontSize={size*0.17} fontWeight="700" fontFamily="monospace"
          style={{transformOrigin:`${size/2}px ${size/2}px`,transform:"rotate(90deg)"}}>
          {d>0?d.toLocaleString():"–"}
        </text>
      </svg>
      <span style={{color:"#8a9bb0",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>{label}</span>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange, color="#00d4ff" }) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{color:"#8a9bb0",fontSize:13}}>{label}</span>
        <span style={{color,fontFamily:"monospace",fontSize:15,fontWeight:700}}>{value}{unit}</span>
      </div>
      <div style={{position:"relative",height:6,borderRadius:3,background:"#1e2530"}}>
        <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,borderRadius:3,background:`linear-gradient(90deg,${color}88,${color})`}}/>
        <input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",margin:0}}/>
        <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",
          width:16,height:16,borderRadius:"50%",background:color,border:"2px solid #0d1117",
          pointerEvents:"none",boxShadow:`0 0 8px ${color}88`}}/>
      </div>
    </div>
  );
}

function Section({ id, children, style={} }) {
  return <section id={id} style={{padding:"80px 20px",...style}}>{children}</section>;
}

function Container({ children, style={} }) {
  return <div style={{maxWidth:560,margin:"0 auto",...style}}>{children}</div>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("de");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [goal, setGoal] = useState("cut");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(85);
  const [height, setHeight] = useState(178);
  const [kfa, setKfa] = useState(20);
  const [actIdx, setActIdx] = useState(2);
  const [result, setResult] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const resultsRef = useRef(null);

  const t = LANGS[lang];
  const cyan="#00d4ff", green="#00ff9d", orange="#ff7b35", gold="#f59e0b";
  const goalColor = GOAL_COLORS[goal];

  function calculate() {
    const lbm = weight*(1-kfa/100);
    const bmr = 370+21.6*lbm;
    const tdee = Math.round(bmr*ACT_FACTORS[actIdx]);
    const protein = Math.round(lbm*2.2);
    const tiers = t.results.tiers[goal].map(tier=>{
      const kcal = goal==="cut" ? tdee-tier.def : tdee+(tier.sur||0);
      const protKcal=protein*4, fatKcal=Math.round(kcal*0.22);
      const carbKcal=kcal-protKcal-fatKcal;
      return {...tier, kcal, macros:{prot:protein,fat:Math.round(fatKcal/9),carb:Math.round(Math.max(carbKcal,0)/4)}};
    });
    setAnimKey(k=>k+1);
    setResult({tdee,bmr:Math.round(bmr),lbm:Math.round(lbm),protein,tiers});
    setTimeout(()=>resultsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  }

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setShowLangMenu(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",color:"#f0f4f8",fontFamily:"system-ui,-apple-system,sans-serif"}}
      onClick={()=>showLangMenu&&setShowLangMenu(false)}>

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"#0d1117ee",backdropFilter:"blur(12px)",
        borderBottom:"1px solid #1e2d3d",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <span style={{fontWeight:900,fontSize:20,background:`linear-gradient(90deg,${cyan},${green})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.nav.logo}</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>scrollTo("pricing")} style={{
              background:"none",border:"none",color:"#8a9bb0",fontSize:14,cursor:"pointer",padding:"8px 12px",borderRadius:8
            }}>{t.nav.pricing}</button>
            <button onClick={()=>scrollTo("calculator")} style={{
              background:`linear-gradient(90deg,${cyan},${green})`,border:"none",color:"#0d1117",
              fontWeight:700,fontSize:13,cursor:"pointer",padding:"9px 18px",borderRadius:8
            }}>{t.nav.start}</button>
            {/* Lang */}
            <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setShowLangMenu(v=>!v)} style={{
                display:"flex",alignItems:"center",gap:5,padding:"7px 10px",borderRadius:8,
                border:"1.5px solid #1e2d3d",background:"#121a24",color:"#8a9bb0",fontSize:13,cursor:"pointer"
              }}>
                <span style={{fontSize:16}}>{LANGS[lang].flag}</span>
                <span style={{fontSize:10,opacity:0.5}}>▼</span>
              </button>
              {showLangMenu&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"#121a24",
                  border:"1px solid #1e2d3d",borderRadius:12,overflow:"hidden",minWidth:150,boxShadow:"0 8px 32px #000a"}}>
                  {Object.entries(LANGS).map(([k,l])=>(
                    <button key={k} onClick={()=>{setLang(k);setResult(null);setShowLangMenu(false);}} style={{
                      display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",
                      background:lang===k?`${cyan}15`:"transparent",border:"none",
                      color:lang===k?cyan:"#8a9bb0",fontSize:13,cursor:"pointer",fontWeight:lang===k?700:400,
                      textAlign:"left",borderBottom:"1px solid #1e2d3d"
                    }}><span style={{fontSize:16}}>{l.flag}</span>{l.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <Section id="hero" style={{background:"radial-gradient(ellipse 80% 60% at 50% -10%,#00d4ff18,transparent)",paddingTop:100,paddingBottom:80}}>
        <Container style={{textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${cyan}15`,
            border:`1px solid ${cyan}40`,borderRadius:999,padding:"6px 16px",marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:cyan,display:"inline-block"}}/>
            <span style={{color:cyan,fontSize:12,fontWeight:600,letterSpacing:1}}>{t.hero.badge}</span>
          </div>
          <h1 style={{margin:"0 0 20px",fontSize:"clamp(32px,7vw,56px)",fontWeight:900,lineHeight:1.1,letterSpacing:-1}}>
            <span style={{color:"#f0f4f8"}}>{t.hero.h1a} </span>
            <span style={{background:`linear-gradient(90deg,${cyan},${green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.hero.h1b} </span>
            <span style={{color:"#f0f4f8"}}>{t.hero.h1c}</span>
          </h1>
          <p style={{color:"#8a9bb0",fontSize:17,lineHeight:1.6,maxWidth:440,margin:"0 auto 36px"}}>{t.hero.sub}</p>
          <button onClick={()=>scrollTo("calculator")} style={{
            background:`linear-gradient(90deg,${cyan},${green})`,border:"none",color:"#0d1117",
            fontWeight:800,fontSize:17,cursor:"pointer",padding:"16px 40px",borderRadius:12,
            boxShadow:`0 0 40px ${cyan}44`,marginBottom:10
          }}>{t.hero.cta}</button>
          <div style={{color:"#5a6a7a",fontSize:12,marginBottom:56}}>{t.hero.ctaSub}</div>
          {/* Stats */}
          <div style={{display:"flex",justifyContent:"center",gap:"clamp(20px,4vw,48px)",flexWrap:"wrap"}}>
            {t.hero.stats.map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"monospace",fontWeight:800,fontSize:22,background:`linear-gradient(90deg,${cyan},${green})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
                <div style={{color:"#5a6a7a",fontSize:12,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── CALCULATOR ── */}
      <Section id="calculator" style={{background:"#080c10",paddingTop:60}}>
        <Container>

          {/* Goal selector */}
          <div style={{marginBottom:36}}>
            <h2 style={{textAlign:"center",fontWeight:800,fontSize:22,marginBottom:20,color:"#f0f4f8"}}>{t.goals.title}</h2>
            <div style={{display:"flex",gap:10}}>
              {t.goals.list.map(g=>(
                <button key={g.key} onClick={()=>{setGoal(g.key);setResult(null);}} style={{
                  flex:1,padding:"16px 8px",borderRadius:14,cursor:"pointer",transition:"all 0.2s",textAlign:"center",
                  border:`2px solid ${goal===g.key?g.color:"#1e2d3d"}`,
                  background:goal===g.key?`${g.color}18`:"#121a24",
                }}>
                  <div style={{fontSize:24,marginBottom:4}}>{g.emoji}</div>
                  <div style={{fontWeight:700,fontSize:13,color:goal===g.key?g.color:"#8a9bb0"}}>{g.label}</div>
                  <div style={{fontSize:10,color:"#5a6a7a",marginTop:3,lineHeight:1.3}}>{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{background:"#121a24",borderRadius:20,border:"1px solid #1e2d3d",padding:"28px 24px",marginBottom:20}}>
            <div style={{color:"#8a9bb0",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>{t.form.title}</div>
            {/* Gender */}
            <div style={{marginBottom:20}}>
              <div style={{color:"#8a9bb0",fontSize:12,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.form.gender}</div>
              <div style={{display:"flex",gap:10}}>
                {[["male",t.form.male],["female",t.form.female]].map(([v,l])=>(
                  <button key={v} onClick={()=>setGender(v)} style={{
                    flex:1,padding:"11px 0",borderRadius:10,border:`1.5px solid ${gender===v?cyan:"#1e2d3d"}`,
                    background:gender===v?`${cyan}15`:"#0d1117",color:gender===v?cyan:"#5a6a7a",
                    fontWeight:700,fontSize:13,cursor:"pointer"
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <Slider label={t.form.age} value={age} min={16} max={70} onChange={setAge} unit={t.form.ageU} color={cyan}/>
            <Slider label={t.form.weight} value={weight} min={40} max={200} onChange={setWeight} unit={t.form.weightU} color={green}/>
            <Slider label={t.form.height} value={height} min={140} max={220} onChange={setHeight} unit={t.form.heightU} color={cyan}/>
            <Slider label={t.form.kfa} value={kfa} min={5} max={50} onChange={setKfa} unit={t.form.kfaU} color={orange}/>
          </div>

          {/* Activity */}
          <div style={{marginBottom:24}}>
            <div style={{color:"#8a9bb0",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>{t.form.actTitle}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {t.form.acts.map((a,i)=>(
                <button key={i} onClick={()=>setActIdx(i)} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:10,
                  border:`1.5px solid ${actIdx===i?goalColor:"#1e2d3d"}`,
                  background:actIdx===i?`${goalColor}10`:"#121a24",
                  color:actIdx===i?goalColor:"#5a6a7a",cursor:"pointer",transition:"all 0.15s",textAlign:"left"
                }}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{a.l}</div>
                    <div style={{fontSize:11,opacity:0.7,marginTop:1}}>{a.d}</div>
                  </div>
                  <span style={{fontFamily:"monospace",fontSize:12,opacity:actIdx===i?1:0.4}}>×{ACT_FACTORS[i]}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={calculate} style={{
            width:"100%",padding:"17px 0",borderRadius:12,border:"none",
            background:`linear-gradient(90deg,${goalColor},${goalColor}bb)`,
            color:"#0d1117",fontWeight:800,fontSize:16,cursor:"pointer",
            boxShadow:`0 0 28px ${goalColor}44`,marginBottom:40
          }}>{t.form.btn}</button>

          {/* Results */}
          {result && (
            <div key={animKey} ref={resultsRef}>
              {/* TDEE ring */}
              <div style={{background:"#121a24",borderRadius:16,border:"1px solid #1e2d3d",padding:"28px 22px",marginBottom:16,textAlign:"center"}}>
                <div style={{color:"#8a9bb0",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>{t.results.tdeeLabel}</div>
                <Ring value={result.tdee} max={4500} label={t.results.kcalDay} color={cyan} size={170}/>
                <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:28}}>
                  {[{l:t.results.bmr,v:`${result.bmr} kcal`},{l:t.results.lean,v:`${result.lbm} kg`}].map(x=>(
                    <div key={x.l} style={{textAlign:"center"}}>
                      <div style={{color:"#5a6a7a",fontSize:11}}>{x.l}</div>
                      <div style={{color:"#8a9bb0",fontFamily:"monospace",fontSize:14,fontWeight:700}}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiers */}
              <div style={{background:"#121a24",borderRadius:16,border:"1px solid #1e2d3d",padding:"24px 22px",marginBottom:16}}>
                <div style={{color:"#8a9bb0",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>
                  {t.results.goalLabel[goal]}
                </div>
                {result.tiers.map(({k,l,def,sur,note,kcal,macros},ci)=>{
                  const tc = TIER_COLORS[ci];
                  const diffLabel = goal==="cut"
                    ? `−${def} kcal ${t.results.deficit}`
                    : sur===0 ? "±0 kcal"
                    : `+${sur} kcal ${t.results.surplus}`;
                  return (
                    <div key={k} style={{marginBottom:ci<result.tiers.length-1?16:0,padding:"16px",borderRadius:12,
                      border:`1px solid ${tc}30`,background:`${tc}08`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                        <span style={{color:tc,fontWeight:700,fontSize:15}}>{l}</span>
                        <span style={{color:tc,fontFamily:"monospace",fontSize:20,fontWeight:800}}>{kcal.toLocaleString()} kcal</span>
                      </div>
                      <div style={{fontSize:11,color:"#5a6a7a",marginBottom:10}}>{diffLabel} · {note}</div>
                      <div style={{display:"flex",gap:8}}>
                        {[{n:t.results.prot,v:macros.prot,c:"#ff6b9d"},{n:t.results.carbs,v:macros.carb,c:"#ffd93d"},{n:t.results.fat,v:macros.fat,c:"#6bcb77"}].map(m=>(
                          <div key={m.n} style={{flex:1,textAlign:"center",padding:"8px 4px",background:"#0d1117",borderRadius:8,border:`1px solid ${m.c}25`}}>
                            <div style={{color:m.c,fontFamily:"monospace",fontWeight:700,fontSize:14}}>{m.v}g</div>
                            <div style={{color:"#5a6a7a",fontSize:10,marginTop:2}}>{m.n}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips */}
              <div style={{background:"#121a24",borderRadius:16,border:"1px solid #1e2d3d",padding:"20px 22px",marginBottom:16}}>
                <div style={{color:"#8a9bb0",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>{t.results.tipsTitle}</div>
                {t.results.tips[goal](result.protein).map((tip,i)=>(
                  <div key={i} style={{marginBottom:10,fontSize:13,color:"#8a9bb0",lineHeight:1.6}}>{tip}</div>
                ))}
              </div>

              {/* Premium CTA */}
              <button onClick={()=>setShowPremiumModal(true)} style={{
                width:"100%",padding:"18px",borderRadius:14,border:`1.5px solid ${gold}60`,
                background:`linear-gradient(135deg,${gold}18,${gold}08)`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8
              }}>
                <div style={{textAlign:"left"}}>
                  <div style={{color:gold,fontWeight:800,fontSize:15}}>{t.results.premiumCta}</div>
                  <div style={{color:"#8a9bb0",fontSize:11,marginTop:2}}>{t.results.premiumSub}</div>
                </div>
                <div style={{background:gold,color:"#0d1117",fontWeight:800,fontSize:12,padding:"7px 14px",borderRadius:8}}>
                  Premium ✦
                </div>
              </button>
            </div>
          )}
        </Container>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing" style={{background:"#0d1117"}}>
        <Container style={{maxWidth:760}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${gold}18`,
              border:`1px solid ${gold}40`,borderRadius:999,padding:"5px 14px",marginBottom:20}}>
              <span style={{color:gold,fontSize:11,fontWeight:700,letterSpacing:1}}>✦ {t.premium.badge}</span>
            </div>
            <h2 style={{fontWeight:900,fontSize:"clamp(24px,5vw,38px)",margin:"0 0 12px",letterSpacing:-0.5}}>
              {t.premium.title}<br/>
              <span style={{background:`linear-gradient(90deg,${gold},#fb923c)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {t.premium.titleB}
              </span>
            </h2>
            <p style={{color:"#8a9bb0",fontSize:15}}>{t.premium.sub}</p>
          </div>

          <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
            {t.premium.plans.map((plan,pi)=>(
              <div key={pi} style={{
                flex:"1 1 260px",maxWidth:320,borderRadius:20,padding:"28px 24px",position:"relative",
                border:`2px solid ${plan.highlight?gold:"#1e2d3d"}`,
                background:plan.highlight?`linear-gradient(135deg,${gold}10,#1a1200)`:"#121a24",
              }}>
                {plan.highlight&&(
                  <div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                    background:`linear-gradient(90deg,${gold},#fb923c)`,color:"#0d1117",
                    fontWeight:800,fontSize:11,padding:"4px 16px",borderRadius:999,letterSpacing:1}}>
                    ✦ {t.premium.popular}
                  </div>
                )}
                <div style={{marginBottom:20}}>
                  <div style={{color:plan.highlight?gold:"#8a9bb0",fontWeight:700,fontSize:14,marginBottom:8}}>{plan.name}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                    <span style={{fontSize:36,fontWeight:900,color:"#f0f4f8"}}>{plan.price}</span>
                    <span style={{color:"#5a6a7a",fontSize:13}}>/ {plan.period}</span>
                  </div>
                </div>
                <div style={{borderTop:"1px solid #1e2d3d",paddingTop:20,marginBottom:24}}>
                  {plan.features.map((f,fi)=>(
                    <div key={fi} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{color:plan.highlight?gold:green,fontSize:14}}>✓</span>
                      <span style={{color:"#c0cdd8",fontSize:13}}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={plan.highlight?()=>setShowPremiumModal(true):undefined} style={{
                  width:"100%",padding:"13px 0",borderRadius:10,border:"none",cursor:plan.highlight?"pointer":"default",
                  background:plan.highlight?`linear-gradient(90deg,${gold},#fb923c)`:"#1e2d3d",
                  color:plan.highlight?"#0d1117":"#5a6a7a",fontWeight:700,fontSize:14
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:"1px solid #1e2d3d",padding:"40px 24px",background:"#080c10"}}>
        <Container style={{maxWidth:760,textAlign:"center"}}>
          <div style={{fontWeight:900,fontSize:18,background:`linear-gradient(90deg,${cyan},${green})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>{t.nav.logo}</div>
          <div style={{color:"#5a6a7a",fontSize:12,marginBottom:20}}>{t.footer.tag}</div>
          <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:20}}>
            {t.footer.links.map(l=>(
              <a key={l} href="#" style={{color:"#5a6a7a",fontSize:12,textDecoration:"none"}}>{l}</a>
            ))}
          </div>
          <div style={{color:"#3a4a5a",fontSize:11}}>{t.footer.copy}</div>
        </Container>
      </footer>

      {/* ── PREMIUM MODAL ── */}
      {showPremiumModal&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={()=>setShowPremiumModal(false)}>
          <div style={{background:"#121a24",borderRadius:20,border:`2px solid ${gold}60`,padding:"36px 28px",maxWidth:400,width:"100%",position:"relative"}}
            onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowPremiumModal(false)} style={{
              position:"absolute",top:16,right:16,background:"none",border:"none",color:"#5a6a7a",fontSize:20,cursor:"pointer"
            }}>×</button>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:40,marginBottom:8}}>✨</div>
              <h3 style={{margin:"0 0 8px",fontWeight:900,fontSize:22,color:"#f0f4f8"}}>MacroCoach Premium</h3>
              <p style={{color:"#8a9bb0",fontSize:14,margin:0}}>
                {lang==="de"?"Einmalig. Kein Abo. Für immer.":
                 lang==="es"?"Pago único. Sin suscripción.":
                 lang==="fr"?"Paiement unique. Sans abonnement.":
                 lang==="tr"?"Tek ödeme. Abonelik yok.":
                 "One-time. No subscription. Forever."}
              </p>
            </div>
            {[
              {e:"🤖",t:lang==="de"?"KI-Wochenplan":lang==="es"?"Plan semanal IA":lang==="fr"?"Plan semaine IA":lang==="tr"?"Yapay Zeka Planı":"AI Week Plan"},
              {e:"🍽️",t:lang==="de"?"Mahlzeitenvorschläge":lang==="es"?"Sugerencias de comidas":lang==="fr"?"Suggestions repas":lang==="tr"?"Öğün önerileri":"Meal Suggestions"},
              {e:"📊",t:lang==="de"?"Fortschritts-Tracking":lang==="es"?"Seguimiento de progreso":lang==="fr"?"Suivi de progression":lang==="tr"?"İlerleme Takibi":"Progress Tracking"},
              {e:"📄",t:"PDF Export"},
            ].map(x=>(
              <div key={x.t} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"10px 14px",
                background:`${gold}10`,borderRadius:10,border:`1px solid ${gold}20`}}>
                <span style={{fontSize:20}}>{x.e}</span>
                <span style={{color:"#c0cdd8",fontSize:14,fontWeight:600}}>{x.t}</span>
                <span style={{marginLeft:"auto",color:gold,fontWeight:700,fontSize:12}}>✓</span>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:24,marginBottom:16}}>
              <span style={{fontSize:36,fontWeight:900,color:"#f0f4f8"}}>4,99€</span>
              <span style={{color:"#5a6a7a",fontSize:13}}> / {lang==="de"?"einmalig":lang==="es"?"único":lang==="fr"?"unique":lang==="tr"?"tek seferlik":"one-time"}</span>
            </div>
            <button style={{
              width:"100%",padding:"15px 0",borderRadius:12,border:"none",cursor:"pointer",
              background:`linear-gradient(90deg,${gold},#fb923c)`,color:"#0d1117",fontWeight:800,fontSize:16,
              boxShadow:`0 0 30px ${gold}44`
            }}>
              {lang==="de"?"✨ Jetzt freischalten":
               lang==="es"?"✨ Desbloquear ahora":
               lang==="fr"?"✨ Débloquer maintenant":
               lang==="tr"?"✨ Şimdi Aç":
               "✨ Unlock Now"}
            </button>
            <p style={{textAlign:"center",color:"#5a6a7a",fontSize:11,marginTop:12,marginBottom:0}}>
              🔒 {lang==="de"?"Sichere Zahlung via Stripe":
               lang==="es"?"Pago seguro vía Stripe":
               lang==="fr"?"Paiement sécurisé via Stripe":
               lang==="tr"?"Stripe ile güvenli ödeme":
               "Secure payment via Stripe"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
