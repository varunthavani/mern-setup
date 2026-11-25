/**
 * ============================================================================
 *  WEDDING CONFIGURATION — the single place to customise the invitation.
 * ============================================================================
 *
 *  Everything a guest sees (names, dates, ceremonies, venues, families,
 *  messages, music, colours, section visibility) is read from this file.
 *  You should never need to edit a React component to personalise the site.
 *
 *  ⚠️  SAMPLE CONTENT
 *  Values marked  // SAMPLE  are placeholders taken from the design mock-ups.
 *  Replace them with your real details before sharing the invitation.
 *  Family / guest names are intentionally left as descriptive placeholders.
 *
 *  Bilingual text:
 *  Any text field can be a plain string (same in both languages) or an object
 *  `{ en: "...", gu: "..." }`. The language switcher picks the right one and
 *  falls back to the other language if one is missing.
 *
 *  Dates & times:
 *  Use "YYYY-MM-DD" for dates and 24-hour "HH:mm" for times. They are always
 *  interpreted in `wedding.timezone`, regardless of where the guest is.
 *
 *  After changing names or initials, run `npm run assets` once to regenerate
 *  the share-preview image (public/og-image.jpg) with the new names.
 * ============================================================================
 */

const weddingConfig = {
  /* ------------------------------------------------------------------------
   * The couple
   * --------------------------------------------------------------------- */
  couple: {
    groom: {
      name: { en: "Rakesh", gu: "રાકેશ" }, // SAMPLE
      fullName: { en: "Chi. Rakesh", gu: "ચિ. રાકેશ" }, // SAMPLE
      initial: "R", // SAMPLE
      // Parent line shown under the name in the couple section.
      parentsLine: {
        en: "Son of [Groom's Father] & [Groom's Mother]",
        gu: "[વરના પિતાશ્રી] અને [વરના માતુશ્રી] ના સુપુત્ર",
      },
      // Replace with "/assets/couple/groom.webp" once you add a photo.
      photo: null,
    },
    bride: {
      name: { en: "Pooja", gu: "પૂજા" }, // SAMPLE
      fullName: { en: "Chi. Pooja", gu: "ચિ. પૂજા" }, // SAMPLE
      initial: "P", // SAMPLE
      parentsLine: {
        en: "Daughter of [Bride's Father] & [Bride's Mother]",
        gu: "[કન્યાના પિતાશ્રી] અને [કન્યાના માતુશ્રી] ની સુપુત્રી",
      },
      photo: null,
    },
    // Order of names in headings: "groom-first" or "bride-first".
    nameOrder: "groom-first",
    // A joint couple photo for the hero. Leave null to show the illustrated
    // couple artwork (a clearly-labelled placeholder is shown in its place).
    couplePhoto: null, // e.g. "/assets/couple/couple.webp"
    hashtag: "#RakeshWedsPooja", // SAMPLE
  },

  /* ------------------------------------------------------------------------
   * Main wedding moment (used by countdown, scratch card, Save the Date)
   * --------------------------------------------------------------------- */
  wedding: {
    date: "2027-02-24", // SAMPLE
    time: "19:30", // SAMPLE — Hast Melap muhurat
    endTime: "23:00",
    timezone: "Asia/Kolkata",
    mainVenueId: "palace",
    // The ceremony the "Save the Date" button adds by default.
    mainCeremonyId: "hast-melap",
  },

  /* ------------------------------------------------------------------------
   * Language
   * --------------------------------------------------------------------- */
  language: {
    default: "gu", // "gu" or "en"
    available: ["gu", "en"],
  },

  /* ------------------------------------------------------------------------
   * Sections — toggle visibility and order (ids must match the list below)
   * --------------------------------------------------------------------- */
  sections: {
    order: [
      "welcome",
      "blessings",
      "couple",
      "family",
      "reveal",
      "countdown",
      "ceremonies",
      "timeline",
      "story",
      "gallery",
      "venue",
      "saveTheDate",
      "rsvp",
      "wishes",
      "invitees",
      "closing",
    ],
    hidden: [], // e.g. ["story", "gallery"]
  },

  /* ------------------------------------------------------------------------
   * Animation preferences
   * --------------------------------------------------------------------- */
  animation: {
    showIntro: true, // closed card + curtain opening
    allowSkipIntro: true,
    petals: true,
    goldParticles: true,
    confetti: true,
    // "auto" lowers particle counts on low-powered devices; "full" / "lite"
    // force a level.
    quality: "auto",
  },

  /* ------------------------------------------------------------------------
   * Background music (starts only after the guest taps the invitation)
   * --------------------------------------------------------------------- */
  music: {
    enabled: true,
    src: "/assets/music/mangal-dhun.mp3",
    title: "Mangal Dhun — original santoor & tanpura instrumental",
    volume: 0.45,
    fadeMs: 2200,
  },

  /* ------------------------------------------------------------------------
   * Colour theme (CSS custom properties). Change here, not in CSS.
   * --------------------------------------------------------------------- */
  theme: {
    ivory: "#FFF5E5",
    ivorySoft: "#F7F3E9",
    champagne: "#E5D1B5",
    sage: "#879477",
    olive: "#414C37",
    heritage: "#344A39",
    gold: "#B58A45",
    goldLight: "#C4A574",
    maroon: "#782C3B",
    haldi: "#EAB84B",
    mehndi: "#637A48",
    rose: "#DDA5A4",
    brown: "#594B3D",
    ink: "#302820",
  },

  /* ------------------------------------------------------------------------
   * Divine blessings section
   * --------------------------------------------------------------------- */
  blessings: {
    // "om" (ૐ in a glowing lotus halo), "kalash" or "none"
    symbol: "om",
    invocation: "॥ શ્રી ગણેશાય નમઃ ॥",
    shloka: [
      "મંગલમ્ ભગવાન વિષ્ણુઃ",
      "મંગલમ્ ગરુડધ્વજઃ ।",
      "મંગલમ્ પુંડરીકાક્ષઃ",
      "મંગલાય તનો હરિઃ ॥",
    ],
    meaning: {
      en: "May Lord Vishnu, whose banner bears Garuda and whose eyes are like the lotus, bless this sacred union with every auspiciousness.",
      gu: "ગરુડધ્વજ, કમળનયન ભગવાન વિષ્ણુ આ પવિત્ર બંધનને સર્વ મંગલ આશીર્વાદ આપે.",
    },
    kuldevi: {
      en: "With the blessings of our Kuldevi and Kuldevta",
      gu: "કુળદેવી તથા કુળદેવતાના આશીર્વાદ સાથે",
    },
  },

  /* ------------------------------------------------------------------------
   * Welcome stage (shown right after the curtains open)
   * --------------------------------------------------------------------- */
  welcome: {
    eyebrow: { en: "Together with their families", gu: "પરિવારજનોના આશીર્વાદ સાથે" },
    tagline: { en: "Wedding Invitation", gu: "શુભ લગ્ન આમંત્રણ" },
  },

  /* ------------------------------------------------------------------------
   * Couple introduction
   * --------------------------------------------------------------------- */
  intro: {
    heading: { en: "are getting married", gu: "લગ્નગ્રંથિથી જોડાઈ રહ્યાં છે" },
    message: {
      en: "Two hearts, two families and one beautiful beginning. We would be honoured to have you with us as we take our seven sacred vows.",
      gu: "બે હૃદય, બે પરિવાર અને એક સુંદર શરૂઆત. સપ્તપદીના સાત વચનો લેતી વેળાએ આપની હાજરી અમારું સૌભાગ્ય બનશે.",
    },
  },

  /* ------------------------------------------------------------------------
   * Family invitation (Scene 05) — replace bracketed placeholders
   * --------------------------------------------------------------------- */
  family: {
    message: {
      gu: "પરમ કૃપાળુ પરમાત્માની અસીમ કૃપાથી અમારા પરિવારના શુભ લગ્ન પ્રસંગે આપ સહપરિવાર પધારી નવદંપતીને આશીર્વાદ આપશો એવી અમારી ભાવભરી વિનંતી.",
      en: "By the infinite grace of the Almighty, we warmly request the pleasure of your company, with your family, at the auspicious wedding in our family, to bless the newly-weds.",
    },
    sides: [
      {
        id: "groom",
        title: { en: "Groom's Family", gu: "વર પક્ષ" },
        grandparents: {
          en: "[Groom's Grandfather] & [Groom's Grandmother]",
          gu: "[વરના દાદાજી] તથા [વરના દાદીમા]",
        },
        parents: {
          en: "[Groom's Father] & [Groom's Mother]",
          gu: "[વરના પિતાશ્રી] તથા [વરના માતુશ્રી]",
        },
        familyName: { en: "[Family name], [Native place]", gu: "[અટક] પરિવાર, [વતન]" },
      },
      {
        id: "bride",
        title: { en: "Bride's Family", gu: "કન્યા પક્ષ" },
        grandparents: {
          en: "[Bride's Grandfather] & [Bride's Grandmother]",
          gu: "[કન્યાના દાદાજી] તથા [કન્યાના દાદીમા]",
        },
        parents: {
          en: "[Bride's Father] & [Bride's Mother]",
          gu: "[કન્યાના પિતાશ્રી] તથા [કન્યાના માતુશ્રી]",
        },
        familyName: { en: "[Family name], [Native place]", gu: "[અટક] પરિવાર, [વતન]" },
      },
    ],
    eldersBlessing: {
      en: "With the blessings of our elders, who have shown us the way.",
      gu: "અમને માર્ગ ચીંધનાર વડીલોના શુભાશિષ સાથે.",
    },
    acknowledgement: {
      en: "In loving memory of those who bless us from above.",
      gu: "સ્વર્ગસ્થ વડીલોની પુણ્ય સ્મૃતિ સાથે.",
    },
  },

  /* ------------------------------------------------------------------------
   * Scratch-to-reveal announcement
   * --------------------------------------------------------------------- */
  reveal: {
    revealPercent: 55, // auto-complete after this much is scratched
    announcement: {
      en: "The day our forever begins",
      gu: "જે દિવસે અમારું આજીવન સાથ શરૂ થાય છે",
    },
  },

  /* ------------------------------------------------------------------------
   * Countdown
   * --------------------------------------------------------------------- */
  countdown: {
    celebrationMessage: {
      en: "We are married! Thank you for your love and blessings.",
      gu: "અમે લગ્નબંધનમાં બંધાઈ ગયાં! આપના પ્રેમ અને આશીર્વાદ માટે આભાર.",
    },
  },

  /* ------------------------------------------------------------------------
   * Venues — ceremonies refer to these by id
   * --------------------------------------------------------------------- */
  venues: {
    palace: {
      name: { en: "The Royal Palace", gu: "ધ રોયલ પેલેસ" }, // SAMPLE
      address: {
        en: "SG Highway, Ahmedabad, Gujarat", // SAMPLE
        gu: "એસ.જી. હાઈવે, અમદાવાદ, ગુજરાત",
      },
      // Text used for Google Maps search / directions and calendar location.
      mapsQuery: "SG Highway, Ahmedabad, Gujarat", // SAMPLE
      // Optional exact link, e.g. a shared Google Maps URL. Overrides mapsQuery.
      mapsUrl: null,
      photo: "/assets/backgrounds/venue-night.webp",
      contact: { name: { en: "Venue desk", gu: "વેન્યુ ડેસ્ક" }, phone: "+91 00000 00000" }, // SAMPLE
      parking: {
        en: "Valet parking available at the main gate.",
        gu: "મુખ્ય દ્વાર પર વેલે પાર્કિંગ ઉપલબ્ધ છે.",
      },
    },
    home: {
      name: { en: "Family Residence", gu: "પરિવાર નિવાસ" }, // SAMPLE
      address: { en: "[Residence address], Ahmedabad", gu: "[નિવાસ સ્થાનનું સરનામું], અમદાવાદ" },
      mapsQuery: "Ahmedabad, Gujarat", // SAMPLE
      mapsUrl: null,
      photo: null,
      contact: null,
      parking: null,
    },
    lawn: {
      name: { en: "Garden Lawns", gu: "ગાર્ડન લૉન્સ" }, // SAMPLE
      address: { en: "[Lawn address], Ahmedabad", gu: "[લૉનનું સરનામું], અમદાવાદ" },
      mapsQuery: "Ahmedabad, Gujarat", // SAMPLE
      mapsUrl: null,
      photo: null,
      contact: null,
      parking: { en: "Parking available inside the lawns.", gu: "લૉન્સની અંદર પાર્કિંગ ઉપલબ્ધ છે." },
    },
  },

  /* ------------------------------------------------------------------------
   * Ceremonies
   *  - enabled:   false hides it everywhere
   *  - confirmed: false shows "details to be shared" instead of a date, and
   *               keeps it out of the timeline and calendar exports
   *  - art:       illustration key (see src/components/art/CeremonyArt.jsx)
   *  - theme:     palette key  (see src/styles/ceremonies.css)
   *  Reorder by moving entries; rename by editing `name`.
   * --------------------------------------------------------------------- */
  ceremonies: [
    {
      id: "kankotri",
      enabled: true,
      confirmed: true,
      art: "kankotri",
      theme: "kumkum",
      name: { en: "Kankotri Lekhan", gu: "કંકોત્રી લેખન" },
      date: "2027-02-14", // SAMPLE
      startTime: "10:00",
      endTime: "12:00",
      venueId: "home",
      description: {
        en: "The first invitation is written with kumkum and offered to Lord Ganesha, inviting the divine before anyone else.",
        gu: "કંકુથી પ્રથમ કંકોત્રી લખી શ્રી ગણેશજીને અર્પણ કરી સૌ પ્રથમ ભગવાનને આમંત્રણ આપવામાં આવે છે.",
      },
      dressCode: null,
    },
    {
      id: "ganesh-sthapana",
      enabled: true,
      confirmed: true,
      art: "ganesh",
      theme: "divine",
      name: { en: "Ganesh Sthapana", gu: "ગણેશ સ્થાપના" },
      date: "2027-02-20", // SAMPLE
      startTime: "09:00",
      endTime: "11:00",
      venueId: "home",
      description: {
        en: "Lord Ganesha, remover of obstacles, is installed at home so that every ritual unfolds auspiciously.",
        gu: "વિઘ્નહર્તા શ્રી ગણેશજીની સ્થાપના કરી સર્વ વિધિ નિર્વિઘ્ને સંપન્ન થાય તેવી પ્રાર્થના.",
      },
      dressCode: { en: "Traditional pastels", gu: "પરંપરાગત હળવા રંગો" },
    },
    {
      id: "mandvo",
      enabled: true,
      confirmed: true,
      art: "mandap",
      theme: "marigold",
      name: { en: "Mandap Muhurat", gu: "માંડવા મુહૂર્ત" },
      date: "2027-02-20", // SAMPLE
      startTime: "11:30",
      endTime: "13:00",
      venueId: "home",
      description: {
        en: "The wedding canopy is blessed with mango leaves, marigolds and a sacred kalash.",
        gu: "આસોપાલવનાં પાન, ગલગોટા અને કળશથી માંડવાનું શુભ મુહૂર્ત કરવામાં આવે છે.",
      },
      dressCode: null,
    },
    {
      id: "grah-shanti",
      enabled: true,
      confirmed: true,
      art: "havan",
      theme: "agni",
      name: { en: "Grah Shanti", gu: "ગ્રહ શાંતિ" },
      date: "2027-02-21", // SAMPLE
      startTime: "08:30",
      endTime: "11:30",
      venueId: "home",
      description: {
        en: "A sacred havan invoking peace from the nine planets for a harmonious married life.",
        gu: "નવગ્રહોની શાંતિ માટે પવિત્ર હવન, જેથી દાંપત્યજીવન સુખમય બને.",
      },
      dressCode: null,
    },
    {
      id: "mehendi",
      enabled: true,
      confirmed: true,
      art: "mehendi",
      theme: "mehndi",
      name: { en: "Mehendi", gu: "મહેંદી" },
      date: "2027-02-21", // SAMPLE
      startTime: "16:00",
      endTime: "20:00",
      venueId: "lawn",
      description: {
        en: "An afternoon of henna, folk songs and laughter as the bride's hands bloom with intricate designs.",
        gu: "લોકગીતો અને હાસ્ય વચ્ચે કન્યાના હાથ પર મહેંદીની સુંદર ભાત ખીલે છે.",
      },
      dressCode: { en: "Shades of green", gu: "લીલા રંગની છટા" },
    },
    {
      id: "pithi",
      enabled: true,
      confirmed: true,
      art: "haldi",
      theme: "haldi",
      name: { en: "Pithi (Haldi)", gu: "પીઠી" },
      date: "2027-02-22", // SAMPLE
      startTime: "10:00",
      endTime: "12:30",
      venueId: "home",
      description: {
        en: "Turmeric paste is lovingly applied by family members, bringing glow and blessings before the wedding.",
        gu: "વિવાહ પૂર્વેની આ પવિત્ર વિધિમાં સ્નેહીજનો હળદરની પીઠી ચોળી આશીર્વાદ આપે છે.",
      },
      dressCode: { en: "Yellow & white", gu: "પીળો અને સફેદ" },
    },
    {
      id: "mameru",
      enabled: true,
      confirmed: false, // timing still being decided — shown as "to be shared"
      art: "mameru",
      theme: "rose",
      name: { en: "Mosalu / Mameru", gu: "મોસાળું / મામેરું" },
      date: "2027-02-22", // SAMPLE
      startTime: "15:00",
      endTime: "17:00",
      venueId: "home",
      description: {
        en: "The maternal uncle's family arrives with gifts, sarees and jewellery — a joyous tradition of love.",
        gu: "મામા પક્ષ તરફથી સાડી, ઘરેણાં અને ભેટ સોગાદો સાથે મામેરું ભરવાની સ્નેહભરી પરંપરા.",
      },
      dressCode: null,
    },
    {
      id: "garba",
      enabled: true,
      confirmed: true,
      art: "garba",
      theme: "garba",
      name: { en: "Sangeet & Raas Garba", gu: "સંગીત અને રાસ ગરબા" },
      date: "2027-02-22", // SAMPLE
      startTime: "20:00",
      endTime: "23:59",
      venueId: "lawn",
      description: {
        en: "A night of dhol, dandiya and garba under festive lights. Bring your best steps!",
        gu: "ઢોલના તાલે, દાંડિયા અને ગરબાની રમઝટ સાથે ઉત્સવની રાત્રિ.",
      },
      dressCode: { en: "Chaniya choli & kediyu", gu: "ચણિયાચોળી અને કેડિયું" },
    },
    {
      id: "jaan",
      enabled: true,
      confirmed: true,
      art: "baraat",
      theme: "royal",
      name: { en: "Jaan Prasthan", gu: "જાન પ્રસ્થાન" },
      date: "2027-02-24", // SAMPLE
      startTime: "16:30",
      endTime: "17:30",
      venueId: "home",
      description: {
        en: "The groom sets out with his family in a royal procession of music, dance and celebration.",
        gu: "ઢોલ-શરણાઈના સૂર સાથે વરરાજા પરિવારજનો સાથે શાહી જાન લઈને પ્રસ્થાન કરે છે.",
      },
      dressCode: { en: "Safa & festive wear", gu: "સાફો અને ઉત્સવનો પોશાક" },
    },
    {
      id: "swagat",
      enabled: true,
      confirmed: true,
      art: "aarti",
      theme: "kumkum",
      name: { en: "Jaan Swagat & Ponkhvanu", gu: "જાન સ્વાગત અને પોંખણું" },
      date: "2027-02-24", // SAMPLE
      startTime: "18:00",
      endTime: "18:45",
      venueId: "palace",
      description: {
        en: "The bride's mother welcomes the groom with an aarti, rice pestle and the playful ponkhvanu ritual.",
        gu: "કન્યાના માતા આરતી અને સંપુટ વડે વરરાજાનું પોંખણું કરી ઉમળકાભેર સ્વાગત કરે છે.",
      },
      dressCode: null,
    },
    {
      id: "jaimala",
      enabled: true,
      confirmed: true,
      art: "jaimala",
      theme: "rose",
      name: { en: "Jaimala", gu: "જયમાળા" },
      date: "2027-02-24", // SAMPLE
      startTime: "19:00",
      endTime: "19:30",
      venueId: "palace",
      description: {
        en: "Bride and groom exchange flower garlands, accepting each other with love and respect.",
        gu: "વર-કન્યા પુષ્પમાળાની આપ-લે કરી પરસ્પર પ્રેમ અને સન્માનથી એકબીજાનો સ્વીકાર કરે છે.",
      },
      dressCode: null,
    },
    {
      id: "hast-melap",
      enabled: true,
      confirmed: true,
      art: "hastmelap",
      theme: "sacred",
      name: { en: "Hast Melap", gu: "હસ્ત મેળાપ" },
      date: "2027-02-24", // SAMPLE
      startTime: "19:30",
      endTime: "20:30",
      venueId: "palace",
      description: {
        en: "The bride's hand is placed in the groom's — the sacred moment two lives become one.",
        gu: "કન્યાનો હાથ વરના હાથમાં સોંપાય છે — બે જીવન એક બનવાની પવિત્ર ક્ષણ.",
      },
      dressCode: { en: "Traditional royal attire", gu: "પરંપરાગત શાહી પોશાક" },
    },
    {
      id: "fera",
      enabled: true,
      confirmed: true,
      art: "fera",
      theme: "agni",
      name: { en: "Mangal Fera & Saptapadi", gu: "મંગળ ફેરા અને સપ્તપદી" },
      date: "2027-02-24", // SAMPLE
      startTime: "20:30",
      endTime: "21:30",
      venueId: "palace",
      description: {
        en: "Four rounds around the sacred fire and seven steps together, each a lifelong promise.",
        gu: "અગ્નિની સાક્ષીએ ચાર મંગળ ફેરા અને સાત પગલાં — દરેક એક આજીવન વચન.",
      },
      dressCode: null,
    },
    {
      id: "bhojan",
      enabled: true,
      confirmed: true,
      art: "thali",
      theme: "marigold",
      name: { en: "Wedding Feast", gu: "લગ્ન ભોજન સમારંભ" },
      date: "2027-02-24", // SAMPLE
      startTime: "20:00",
      endTime: "23:00",
      venueId: "palace",
      description: {
        en: "A traditional Gujarati feast, served with warmth — please dine with us.",
        gu: "પરંપરાગત ગુજરાતી ભોજન — આપ સૌ પ્રેમપૂર્વક ભોજન લેવા પધારશો.",
      },
      dressCode: null,
    },
    {
      id: "vidai",
      enabled: true,
      confirmed: false, // SAMPLE — shown as "to be shared"
      art: "vidai",
      theme: "dusk",
      name: { en: "Vidai", gu: "વિદાય" },
      date: "2027-02-25",
      startTime: "00:30",
      endTime: "01:30",
      venueId: "palace",
      description: {
        en: "With tears of joy, the bride bids farewell to her parents' home and begins a new journey.",
        gu: "હર્ષનાં આંસુ સાથે કન્યા પિયરને વિદાય આપી નવા જીવનની સફર શરૂ કરે છે.",
      },
      dressCode: null,
    },
    {
      id: "griha-pravesh",
      enabled: true,
      confirmed: false, // SAMPLE — shown as "to be shared"
      art: "grihapravesh",
      theme: "kumkum",
      name: { en: "Griha Pravesh", gu: "ગૃહ પ્રવેશ" },
      date: "2027-02-25",
      startTime: "10:00",
      endTime: "11:00",
      venueId: "home",
      description: {
        en: "The new bride is welcomed home as she gently tips the kalash of rice and steps in with kumkum footprints.",
        gu: "નવવધૂ ચોખા ભરેલો કળશ ઢોળી, કંકુ પગલાં સાથે નવા ઘરમાં પ્રવેશે છે.",
      },
      dressCode: null,
    },
    {
      id: "reception",
      enabled: true,
      confirmed: true,
      art: "reception",
      theme: "royal",
      name: { en: "Wedding Reception", gu: "સ્વાગત સમારંભ" },
      date: "2027-02-26", // SAMPLE
      startTime: "19:30",
      endTime: "23:00",
      venueId: "palace",
      description: {
        en: "An evening of celebration under chandeliers, to meet the newly-weds and share in their joy.",
        gu: "ઝુમ્મરોની રોશની નીચે નવદંપતીને મળવા અને આનંદ વહેંચવા માટે એક ભવ્ય સાંજ.",
      },
      dressCode: { en: "Indo-western / evening formal", gu: "ઇન્ડો-વેસ્ટર્ન / સાંજનો ઔપચારિક પોશાક" },
    },
  ],

  /* ------------------------------------------------------------------------
   * Our love story — keep or replace. Leave `date` empty to hide it.
   * --------------------------------------------------------------------- */
  story: {
    milestones: [
      {
        id: "first-meet",
        title: { en: "First Meeting", gu: "પ્રથમ મુલાકાત" },
        date: "",
        text: { en: "[Share how you first met]", gu: "[આપની પ્રથમ મુલાકાતની વાત અહીં લખો]" },
        photo: "/assets/gallery/placeholder-story-1.svg",
      },
      {
        id: "friendship",
        title: { en: "Friendship", gu: "મિત્રતા" },
        date: "",
        text: { en: "[A memory from your friendship]", gu: "[મિત્રતાની કોઈ યાદ અહીં લખો]" },
        photo: "/assets/gallery/placeholder-story-2.svg",
      },
      {
        id: "engagement",
        title: { en: "Engagement", gu: "સગાઈ" },
        date: "",
        text: { en: "[Your engagement story]", gu: "[સગાઈની વાત અહીં લખો]" },
        photo: "/assets/gallery/placeholder-story-3.svg",
      },
      {
        id: "forever",
        title: { en: "A New Journey", gu: "નવી સફર" },
        date: "",
        text: {
          en: "And now, with your blessings, we begin forever.",
          gu: "અને હવે, આપના આશીર્વાદ સાથે, અમે આજીવન સફરની શરૂઆત કરીએ છીએ.",
        },
        photo: "/assets/gallery/placeholder-story-4.svg",
      },
    ],
  },

  /* ------------------------------------------------------------------------
   * Gallery — replace the placeholders with your photos (WebP recommended,
   * ~1600px on the long side). width/height keep the layout stable.
   * --------------------------------------------------------------------- */
  gallery: {
    categories: [
      { id: "couple", label: { en: "Couple", gu: "યુગલ" } },
      { id: "prewedding", label: { en: "Pre-wedding", gu: "પ્રી-વેડિંગ" } },
      { id: "engagement", label: { en: "Engagement", gu: "સગાઈ" } },
      { id: "family", label: { en: "Family", gu: "પરિવાર" } },
    ],
    images: [
      { src: "/assets/gallery/placeholder-1.svg", category: "couple", width: 800, height: 1000, alt: { en: "Couple photo placeholder 1", gu: "યુગલ ફોટો 1 (નમૂનો)" } },
      { src: "/assets/gallery/placeholder-2.svg", category: "prewedding", width: 800, height: 600, alt: { en: "Pre-wedding photo placeholder 2", gu: "પ્રી-વેડિંગ ફોટો 2 (નમૂનો)" } },
      { src: "/assets/gallery/placeholder-3.svg", category: "engagement", width: 800, height: 1100, alt: { en: "Engagement photo placeholder 3", gu: "સગાઈ ફોટો 3 (નમૂનો)" } },
      { src: "/assets/gallery/placeholder-4.svg", category: "couple", width: 800, height: 800, alt: { en: "Couple photo placeholder 4", gu: "યુગલ ફોટો 4 (નમૂનો)" } },
      { src: "/assets/gallery/placeholder-5.svg", category: "family", width: 800, height: 600, alt: { en: "Family photo placeholder 5", gu: "પરિવાર ફોટો 5 (નમૂનો)" } },
      { src: "/assets/gallery/placeholder-6.svg", category: "prewedding", width: 800, height: 1000, alt: { en: "Pre-wedding photo placeholder 6", gu: "પ્રી-વેડિંગ ફોટો 6 (નમૂનો)" } },
    ],
  },

  /* ------------------------------------------------------------------------
   * RSVP & wishes — sent through WhatsApp (nothing is stored on a server)
   * --------------------------------------------------------------------- */
  rsvp: {
    enabled: true,
    // International format, digits only, no "+" — e.g. "919876543210"
    whatsappNumber: "910000000000", // SAMPLE — replace before sharing!
    deadline: "2027-02-10", // SAMPLE — leave "" to hide
    maxGuests: 10,
    // Optional external form (Google Forms etc.). When set, an extra
    // "Open RSVP form" link is shown.
    externalFormUrl: null,
  },
  wishes: {
    enabled: true,
    whatsappNumber: "910000000000", // SAMPLE
  },

  /* ------------------------------------------------------------------------
   * Contacts shown in the venue section
   * --------------------------------------------------------------------- */
  contacts: [
    { label: { en: "Groom's family", gu: "વર પક્ષ" }, name: { en: "[Contact name]", gu: "[સંપર્ક નામ]" }, phone: "+91 00000 00000" }, // SAMPLE
    { label: { en: "Bride's family", gu: "કન્યા પક્ષ" }, name: { en: "[Contact name]", gu: "[સંપર્ક નામ]" }, phone: "+91 00000 00000" }, // SAMPLE
  ],

  /* ------------------------------------------------------------------------
   * Traditional invitee groups (Scene 15). Add as many names as needed.
   * --------------------------------------------------------------------- */
  invitees: [
    {
      id: "nimantrak",
      title: { gu: "નિમંત્રક", en: "Hosts" },
      names: [
        { en: "[Grandparents' names]", gu: "[દાદા-દાદીનાં નામ]" },
        { en: "[Parents' names]", gu: "[માતા-પિતાનાં નામ]" },
      ],
    },
    {
      id: "darshanabhilashi",
      title: { gu: "દર્શનાભિલાષી", en: "Eager to see you" },
      names: [
        { en: "[Uncle & aunt's names]", gu: "[કાકા-કાકીનાં નામ]" },
        { en: "[Family names]", gu: "[પરિવારજનોનાં નામ]" },
      ],
    },
    {
      id: "snehadhin",
      title: { gu: "સ્નેહાધીન", en: "With affection" },
      names: [
        { en: "[Relatives' names]", gu: "[સગાં-સંબંધીઓનાં નામ]" },
      ],
    },
    {
      id: "swagatotsuk",
      title: { gu: "સ્વાગતોત્સુક", en: "Awaiting to welcome you" },
      names: [
        { en: "[Brothers' & sisters' names]", gu: "[ભાઈ-બહેનનાં નામ]" },
      ],
    },
    {
      id: "tahuko",
      title: { gu: "ટહુકો", en: "A little chirp" },
      names: [
        { en: "[Children's names] — \"Mara kaka/fai na lagan ma jarur aavjo!\"", gu: "[બાળકોનાં નામ] — \"મારા કાકા/ફઈનાં લગ્નમાં જરૂર આવજો!\"" },
      ],
    },
    {
      id: "vishesh",
      title: { gu: "વિશેષ આમંત્રણ", en: "Special invitation" },
      names: [
        { en: "[Special guests / well-wishers]", gu: "[વિશેષ મહેમાનો / શુભેચ્છકો]" },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
   * Closing
   * --------------------------------------------------------------------- */
  closing: {
    message: {
      gu: "આપની ઉપસ્થિતિ અને આશીર્વાદ અમારા જીવનના આ મંગલ પ્રસંગને વધુ યાદગાર બનાવશે.",
      en: "Your presence and blessings will make this auspicious occasion of our lives even more memorable.",
    },
    familyMessage: {
      en: "With love, from both our families",
      gu: "બંને પરિવાર તરફથી સ્નેહપૂર્વક",
    },
  },

  /* ------------------------------------------------------------------------
   * Sharing & SEO (also used to build index.html at build time)
   * --------------------------------------------------------------------- */
  share: {
    // Public URL where the site will be hosted (used for og:url / share).
    siteUrl: "", // e.g. "https://rakesh-weds-pooja.netlify.app"
    title: "Rakesh & Pooja · Wedding Invitation", // SAMPLE
    description:
      "You are warmly invited to celebrate the wedding of Rakesh & Pooja · 24 February 2027 · Ahmedabad", // SAMPLE
    shareText: {
      en: "You're invited! Open our wedding invitation 💐",
      gu: "આપને સહપરિવાર આમંત્રણ! અમારી લગ્ન કંકોત્રી ખોલો 💐",
    },
    image: "/og-image.jpg",
  },
};

export default weddingConfig;
