/**
 * Crest & Chronicle — the vertical chronicle page.
 * Asymmetric spreads, material contrast, muted house colors, and archival typography are intentional.
 */
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Compass, Crown, GitFork, MapPinned, Menu, Shield, Volume2, VolumeX, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";

const houses = [
  {
    id: "stark",
    chapter: "I",
    name: "Stark",
    epithet: "Wardens of the North",
    words: "Winter is Coming",
    region: "Winterfell · The North",
    accent: "Frost Grey",
    seal: "WOLF",
    image: "/manus-storage/stark-wolf-atlas-plate_9d18b206.png",
    sealPosition: "83% 17%",
    copy: "At the edge of the known kingdoms, the Starks built their name on steadiness rather than spectacle. Their court is a hard country of old vows, plain speech, and unbroken watchfires.",
    character: "Eddard Stark",
    role: "Lord of Winterfell",
    bio: "A lord who prized duty above inheritance and carried the North’s stern moral weather into every council chamber.",
    traits: ["Duty", "Restraint", "Loyalty"],
  },
  {
    id: "targaryen",
    chapter: "II",
    name: "Targaryen",
    epithet: "Blood of Old Valyria",
    words: "Fire and Blood",
    region: "Dragonstone · The Narrow Sea",
    accent: "Ember Red",
    seal: "DRAGON",
    image: "/manus-storage/targaryen-dragon-atlas-plate_3a8b43ac.png",
    sealPosition: "17% 18%",
    copy: "For the Targaryens, bloodline was both inheritance and instrument. Their story moves through ash, prophecy, and the terrible conviction that a realm can be remade by force of will.",
    character: "Daenerys Targaryen",
    role: "Heir in Exile",
    bio: "A claimant forged far from the throne, whose growing retinue turned a distant name into a challenge that crossed seas.",
    traits: ["Resolve", "Legacy", "Reckoning"],
  },
  {
    id: "lannister",
    chapter: "III",
    name: "Lannister",
    epithet: "Lions of the Rock",
    words: "Hear Me Roar",
    region: "Casterly Rock · The Westerlands",
    accent: "Lion Crimson",
    seal: "LION",
    image: "/manus-storage/lannister-lion-atlas-plate_d03842d3.png",
    sealPosition: "83% 18%",
    copy: "Gold gives the Lannisters their reach; calculation gives them their edge. Their household understands that every alliance has a cost, and every cost can be made to serve a larger design.",
    character: "Tyrion Lannister",
    role: "The Imp of Casterly Rock",
    bio: "A brilliant outsider within his own dynasty, wielding wit, observation, and difficult counsel as instruments of survival.",
    traits: ["Wit", "Ambition", "Strategy"],
  },
  {
    id: "baratheon",
    chapter: "IV",
    name: "Baratheon",
    epithet: "Stags of the Stormlands",
    words: "Ours is the Fury",
    region: "Storm’s End · The Stormlands",
    accent: "Storm Gold",
    seal: "STAG",
    image: "/manus-storage/baratheon-stag-atlas-plate_b50f0a1e.png",
    sealPosition: "17% 18%",
    copy: "The Baratheons rose on the force of a hammer-blow and kept their place by sheer momentum. Their name carries the weather of the storm coast: loud, immediate, and difficult to withstand.",
    character: "Robert Baratheon",
    role: "The Usurper King",
    bio: "A battlefield commander whose rebellion remade the realm, then left him to rule a peace that could not answer his appetite for war.",
    traits: ["Fury", "Command", "Grief"],
  },
  {
    id: "tyrell",
    chapter: "V",
    name: "Tyrell",
    epithet: "Gardeners of the Reach",
    words: "Growing Strong",
    region: "Highgarden · The Reach",
    accent: "Rose Green",
    seal: "ROSE",
    image: "/manus-storage/tyrell-rose-atlas-plate_1e71af96.png",
    sealPosition: "83% 18%",
    copy: "In the Reach, the Tyrells make abundance into power. Their court knows that patience, ceremony, and careful cultivation can command a room as surely as an army can hold a road.",
    character: "Margaery Tyrell",
    role: "The Rose of Highgarden",
    bio: "A poised political figure whose warmth and visibility became instruments of influence at the heart of the royal court.",
    traits: ["Grace", "Patience", "Influence"],
  },
];

const realmLocations = [
  {
    id: "winterfell",
    place: "Winterfell",
    house: "House Stark",
    realm: "The North",
    x: "43%",
    y: "21%",
    accent: "stark",
    seal: "WOLF",
    chapter: "I",
    note: "A northern keep of hot springs, old gods, and the long memory of the First Men.",
    houseId: "stark",
  },
  {
    id: "kings-landing",
    place: "King’s Landing",
    house: "House Baratheon",
    realm: "The Crownlands",
    x: "52%",
    y: "46%",
    accent: "baratheon",
    seal: "STAG",
    chapter: "IV",
    note: "The crowded capital where the royal court turns every proximity to the throne into a wager.",
    houseId: "baratheon",
  },
  {
    id: "casterly-rock",
    place: "Casterly Rock",
    house: "House Lannister",
    realm: "The Westerlands",
    x: "29%",
    y: "57%",
    accent: "lannister",
    seal: "LION",
    chapter: "III",
    note: "A cliffside seat said to hold enough gold beneath its foundations to decide a generation of wars.",
    houseId: "lannister",
  },
  {
    id: "highgarden",
    place: "Highgarden",
    house: "House Tyrell",
    realm: "The Reach",
    x: "49%",
    y: "79%",
    accent: "tyrell",
    seal: "ROSE",
    chapter: "V",
    note: "A fertile court of chivalry, cultivation, and influence that travels as quietly as perfume.",
    houseId: "tyrell",
  },
  {
    id: "dragonstone",
    place: "Dragonstone",
    house: "House Targaryen",
    realm: "The Narrow Sea",
    x: "78%",
    y: "47%",
    accent: "targaryen",
    seal: "DRAGON",
    chapter: "II",
    note: "A volcanic island fortress where sea mist, black stone, and old Valyrian inheritance meet.",
    houseId: "targaryen",
  },
];

const landmarkEvents = [
  { id: "dragonstone-inheritance", order: 1, era: "Exile", eraKey: "roots", title: "A distant inheritance", label: "Dragon claim", note: "Across the narrow sea, an exile becomes a claim with the old Valyrian seat in view.", locationId: "dragonstone", characterId: "daenerys-targaryen", timelineIndex: 0, x: "72%", y: "40%", accent: "targaryen" },
  { id: "wolf-memory", order: 2, era: "The road", eraKey: "passage", title: "Memory as compass", label: "Wolf memory", note: "A daughter of Winterfell carries the memory of home as a living measure of loyalty and loss.", locationId: "winterfell", characterId: "arya-stark", timelineIndex: 2, x: "48%", y: "17%", accent: "stark" },
  { id: "rock-counsel", order: 3, era: "Court", eraKey: "passage", title: "Counsel in shadow", label: "Rock counsel", note: "At the western seat, language and political instinct become instruments against larger forces.", locationId: "casterly-rock", characterId: "tyrion-lannister", timelineIndex: 1, x: "24%", y: "63%", accent: "lannister" },
  { id: "garden-presence", order: 4, era: "Court", eraKey: "passage", title: "A public presence", label: "Rose court", note: "At Highgarden’s cultivated court, ceremony and visibility are made into political capital.", locationId: "highgarden", characterId: "margaery-tyrell", timelineIndex: 1, x: "57%", y: "73%", accent: "tyrell" },
  { id: "winterfell-claim", order: 5, era: "The long winter", eraKey: "claims", title: "A northern claim", label: "Winter claim", note: "A northern gathering point for survival, duty, and the contested future of the North.", locationId: "winterfell", characterId: "jon-snow", timelineIndex: 2, x: "38%", y: "28%", accent: "stark" },
];

const chronologicalLandmarkEvents = [...landmarkEvents].sort((first, second) => first.order - second.order);
const eraFilters = [{ id: "all", label: "All eras" }, { id: "roots", label: "Era I · Roots" }, { id: "passage", label: "Era II · Passage" }, { id: "claims", label: "Era III · Claims" }] as const;
const timelineEra = (period: string) => (["Northern youth", "Winterfell", "Casterly Rock", "Highgarden", "Exile"].includes(period) ? "roots" : ["The Wall", "The road", "Retinue", "Court", "King’s Landing"].includes(period) ? "passage" : "claims");

const mainCharacters = [
  {
    id: "jon-snow",
    name: "Jon Snow",
    epithet: "The Watcher at the Wall",
    house: "The Night’s Watch · The North",
    chapter: "01",
    accent: "stark",
    image: "/manus-storage/jonsnow_37f49cdf.jpg",
    description: "A northern outcast shaped by duty, exile, and a difficult inheritance beyond the Wall.",
    houseId: "stark",
    allegiances: ["alliance", "kinship", "caution"],
    backstory: "Raised on the northern edge of a great house, Jon learned early that belonging can be both shelter and burden. His years at the Wall turn that uncertainty into discipline, placing him between the old loyalties of the North and threats no banner can settle alone.",
    stats: [{ label: "Resolve", value: 92 }, { label: "Command", value: 78 }, { label: "Influence", value: 74 }],
    timeline: [{ period: "Northern youth", title: "A place at Winterfell", note: "Learns the costs and comforts of a life lived near, but not fully within, a great northern house." }, { period: "The Wall", title: "An oath of service", note: "Chooses a difficult watch that turns uncertainty into discipline, fraternity, and responsibility." }, { period: "The long winter", title: "A northern claim", note: "Becomes a gathering point for survival, duty, and the hard questions facing the North." }],
  },
  {
    id: "daenerys-targaryen",
    name: "Daenerys Targaryen",
    epithet: "The Exiled Queen",
    house: "House Targaryen · Dragonstone",
    chapter: "02",
    accent: "targaryen",
    image: "/manus-storage/dany_fd2a609f.jpg",
    description: "A claimant whose name, resolve, and command of old fire turned exile into a gathering storm.",
    houseId: "targaryen",
    allegiances: ["alliance", "rivalry"],
    backstory: "Exile turns inherited stories into an active claim. Daenerys gathers counsel, followers, and the memory of a fallen dynasty until distance from the throne becomes the source of a new kind of authority.",
    stats: [{ label: "Resolve", value: 95 }, { label: "Legacy", value: 98 }, { label: "Influence", value: 91 }],
    timeline: [{ period: "Exile", title: "A distant inheritance", note: "Carries a fallen dynasty’s memory across the narrow sea, far from the seat it once commanded." }, { period: "Retinue", title: "A gathering claim", note: "Builds a following from loyalty, spectacle, and the conviction that old power can be remade." }, { period: "Return", title: "A realm in view", note: "Transforms a name carried in exile into an active challenge to the existing order." }],
  },
  {
    id: "arya-stark",
    name: "Arya Stark",
    epithet: "A Daughter of Winterfell",
    house: "House Stark · Winterfell",
    chapter: "03",
    accent: "stark",
    image: "/manus-storage/arya_bb632cd0.jpg",
    description: "A survivor of shattered certainties, carrying the North’s stubborn memory wherever the road leads.",
    houseId: "stark",
    allegiances: ["kinship"],
    backstory: "A daughter of Winterfell, Arya carries her house’s memory through displacement and loss. Her story is marked by endurance, observation, and a fierce private understanding of what family can demand.",
    stats: [{ label: "Resolve", value: 90 }, { label: "Stealth", value: 94 }, { label: "Kinship", value: 88 }],
    timeline: [{ period: "Winterfell", title: "A northern daughter", note: "Begins in a family defined by old customs, sharp lessons, and an increasingly unstable realm." }, { period: "The road", title: "A fractured passage", note: "Learns to navigate danger through observation, caution, and the refusal to forget what was taken." }, { period: "Return", title: "Memory as compass", note: "Carries Winterfell’s identity not as nostalgia, but as a living measure of loyalty and loss." }],
  },
  {
    id: "tyrion-lannister",
    name: "Tyrion Lannister",
    epithet: "The Hand in Shadow",
    house: "House Lannister · Casterly Rock",
    chapter: "04",
    accent: "lannister",
    image: "/manus-storage/tyrion_07a53658.jpg",
    description: "A courtly strategist who meets towering dynasties with observation, language, and nerve.",
    houseId: "lannister",
    allegiances: ["alliance", "caution"],
    backstory: "Within a dynasty that values legacy and spectacle, Tyrion builds leverage through language, memory, and a habit of seeing the incentives other people ignore. His counsel is valuable precisely because it is never uncomplicated.",
    stats: [{ label: "Wit", value: 96 }, { label: "Strategy", value: 93 }, { label: "Influence", value: 82 }],
    timeline: [{ period: "Casterly Rock", title: "An inconvenient heir", note: "Grows up inside a powerful house while learning that proximity to power does not guarantee belonging." }, { period: "Court", title: "Counsel in shadow", note: "Turns reading, rhetoric, and political instinct into tools that can contend with larger forces." }, { period: "Alliance", title: "A costly adviser", note: "Becomes valuable in uncertain coalitions because his counsel accounts for both ambition and consequence." }],
  },
  {
    id: "margaery-tyrell",
    name: "Margaery Tyrell",
    epithet: "The Rose at Court",
    house: "House Tyrell · Highgarden",
    chapter: "05",
    accent: "tyrell",
    image: "/manus-storage/margery_58b52532.jpg",
    description: "A poised public figure who understands that warmth, patience, and attention can become power.",
    houseId: "tyrell",
    allegiances: ["caution", "rivalry"],
    backstory: "At court, grace is not separate from strategy. Margaery understands the value of ceremony, public devotion, and patience—turning attention into a quiet form of political capital.",
    stats: [{ label: "Grace", value: 94 }, { label: "Patience", value: 91 }, { label: "Influence", value: 89 }],
    timeline: [{ period: "Highgarden", title: "A cultivated court", note: "Learns that abundance, ritual, and reputation can be shaped into real political strength." }, { period: "King’s Landing", title: "A public presence", note: "Uses warmth and ceremony to make visibility itself into a source of influence." }, { period: "The claim", title: "Patience as power", note: "Treats each alliance and courtesy as part of a longer design for survival and authority." }],
  },
];

const relationshipNodes = mainCharacters.map((character, index) => {
  const positions = [
    { x: "13%", y: "43%" },
    { x: "84%", y: "27%" },
    { x: "25%", y: "80%" },
    { x: "50%", y: "52%" },
    { x: "76%", y: "79%" },
  ];
  const roles = ["The Watch", "Dragonstone", "Winterfell", "Casterly Rock", "Highgarden"];
  return { ...character, ...positions[index], locus: roles[index] };
});

const relationshipEdges = [
  {
    id: "jon-daenerys",
    source: "jon-snow",
    target: "daenerys-targaryen",
    type: "alliance",
    label: "Shared campaign",
    detail: "A difficult alliance built on mutual need: northern survival, southern power, and the pressure of a war neither can win alone.",
    path: "M 18 43 C 34 21, 62 18, 80 28",
    anchor: { x: 50, y: 24 },
  },
  {
    id: "jon-arya",
    source: "jon-snow",
    target: "arya-stark",
    type: "kinship",
    label: "Northern bond",
    detail: "Their loyalty is rooted in a shared northern identity and the instinct to protect what remains of Winterfell’s scattered family.",
    path: "M 15 49 C 16 65, 20 74, 24 78",
    anchor: { x: 19, y: 66 },
  },
  {
    id: "jon-tyrion",
    source: "jon-snow",
    target: "tyrion-lannister",
    type: "caution",
    label: "Uneasy counsel",
    detail: "Shared pragmatism makes room for respect, but divided duties and hard choices keep the connection provisional.",
    path: "M 18 47 C 29 55, 40 59, 47 53",
    anchor: { x: 33, y: 57 },
  },
  {
    id: "daenerys-tyrion",
    source: "daenerys-targaryen",
    target: "tyrion-lannister",
    type: "alliance",
    label: "Counsel & command",
    detail: "A political partnership in which strategy, inheritance, and trust must carry more weight than either character’s private doubts.",
    path: "M 80 31 C 68 38, 60 45, 53 51",
    anchor: { x: 67, y: 41 },
  },
  {
    id: "tyrion-margaery",
    source: "tyrion-lannister",
    target: "margaery-tyrell",
    type: "caution",
    label: "Courtly calculus",
    detail: "Both understand the power of a room, a rumor, and a carefully timed alliance—making every courtesy a calculation.",
    path: "M 53 56 C 62 68, 69 75, 74 78",
    anchor: { x: 65, y: 70 },
  },
  {
    id: "margaery-daenerys",
    source: "margaery-tyrell",
    target: "daenerys-targaryen",
    type: "rivalry",
    label: "Competing claims",
    detail: "Two sharply different approaches to influence meet across a contested realm: public devotion, inherited legitimacy, and the force of a new order.",
    path: "M 78 76 C 89 61, 90 42, 86 32",
    anchor: { x: 89, y: 54 },
  },
];

const chapterAmbientTracks = {
  default: "/manus-storage/atlas-intro-ambient_de2ad533.mp3",
  houses: "/manus-storage/intro-houses-ambient_1892a2d4.mp3",
  realm: "/manus-storage/intro-realm-ambient_4cad6e96.mp3",
  loyalties: "/manus-storage/intro-loyalties-ambient_c4b2100d.mp3",
} as const;

type ChapterPalette = keyof typeof chapterAmbientTracks;

const houseAmbientTracks = {
  stark: "/manus-storage/house-stark-ambient_b16bc61b.mp3",
  targaryen: "/manus-storage/house-targaryen-ambient_256f06f3.mp3",
  lannister: "/manus-storage/house-lannister-ambient_792edd26.mp3",
  baratheon: "/manus-storage/house-baratheon-ambient_d3f415e5.mp3",
  tyrell: "/manus-storage/house-tyrell-ambient_f8bac549.mp3",
} as const;

type HouseId = keyof typeof houseAmbientTracks;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState(realmLocations[0]);
  const [activeRelationshipId, setActiveRelationshipId] = useState(relationshipEdges[0].id);
  const [introVisible, setIntroVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.15);
  const [activePalette, setActivePalette] = useState<ChapterPalette>("default");
  const [activeHouseId, setActiveHouseId] = useState<HouseId | null>(null);
  const [houseFilter, setHouseFilter] = useState("all");
  const [allegianceFilter, setAllegianceFilter] = useState("all");
  const [selectedCharacter, setSelectedCharacter] = useState<(typeof mainCharacters)[number] | null>(null);
  const [timelineFocus, setTimelineFocus] = useState<{ characterId: string; index: number } | null>(null);
  const [dossierView, setDossierView] = useState<"profile" | "events">("profile");
  const [eraFilter, setEraFilter] = useState<string>("all");
  const [activeLandmarkId, setActiveLandmarkId] = useState<string | null>(landmarkEvents[0].id);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [shortlistLoaded, setShortlistLoaded] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [shouldPersistSoundPreferences, setShouldPersistSoundPreferences] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadedAudioSourceRef = useRef<string | null>(null);
  const lastCueAtRef = useRef(0);
  const activeRelationship = relationshipEdges.find((edge) => edge.id === activeRelationshipId) ?? relationshipEdges[0];
  const activeSource = relationshipNodes.find((node) => node.id === activeRelationship.source)!;
  const activeTarget = relationshipNodes.find((node) => node.id === activeRelationship.target)!;
  const selectedCharacterHouse = selectedCharacter ? houses.find((house) => house.id === selectedCharacter.houseId) : undefined;
  const activeLandmark = landmarkEvents.find((landmark) => landmark.id === activeLandmarkId);
  const activeLandmarkCharacter = activeLandmark ? mainCharacters.find((character) => character.id === activeLandmark.characterId) : undefined;
  const filteredLandmarkEvents = useMemo(() => chronologicalLandmarkEvents.filter((landmark) => eraFilter === "all" || landmark.eraKey === eraFilter), [eraFilter]);
  const selectedEra = eraFilters.find((era) => era.id === eraFilter) ?? eraFilters[0];
  const visibleTimelineEntries = useMemo(() => selectedCharacter ? selectedCharacter.timeline.map((event, index) => ({ ...event, index })).filter((event) => eraFilter === "all" || timelineEra(event.period) === eraFilter) : [], [eraFilter, selectedCharacter]);
  const activeTimelinePosition = timelineFocus && timelineFocus.characterId === selectedCharacter?.id ? visibleTimelineEntries.findIndex((event) => event.index === timelineFocus.index) : -1;
  const filteredCharacters = useMemo(() => mainCharacters.filter((character) => (
    (houseFilter === "all" || character.houseId === houseFilter)
    && (allegianceFilter === "all" || character.allegiances.includes(allegianceFilter))
  )), [allegianceFilter, houseFilter]);
  const shortlistedCharacters = useMemo(() => mainCharacters.filter((character) => shortlistIds.includes(character.id)), [shortlistIds]);
  const volumePercent = Math.round((ambientVolume / 0.35) * 100);
  const activeAudioSource = introVisible
    ? chapterAmbientTracks[activePalette]
    : activeHouseId
      ? houseAmbientTracks[activeHouseId]
      : undefined;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setIntroVisible(false), 7900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedSoundEnabled = window.localStorage.getItem("westeros-atlas-intro-sound");
    const savedVolume = Number(window.localStorage.getItem("westeros-atlas-intro-volume"));
    if (savedSoundEnabled === "true" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setSoundEnabled(true);
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 0.35) setAmbientVolume(savedVolume);
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    try {
      const savedShortlist = JSON.parse(window.localStorage.getItem("westeros-atlas-shortlist") ?? "[]");
      if (Array.isArray(savedShortlist)) setShortlistIds(savedShortlist.filter((id): id is string => typeof id === "string" && mainCharacters.some((character) => character.id === id)).slice(0, 3));
    } catch { /* An unreadable local value is treated as an empty shortlist. */ }
    setShortlistLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded || !shouldPersistSoundPreferences) return;
    window.localStorage.setItem("westeros-atlas-intro-sound", String(soundEnabled));
    window.localStorage.setItem("westeros-atlas-intro-volume", String(ambientVolume));
  }, [ambientVolume, preferencesLoaded, shouldPersistSoundPreferences, soundEnabled]);

  useEffect(() => {
    if (shortlistLoaded) window.localStorage.setItem("westeros-atlas-shortlist", JSON.stringify(shortlistIds));
  }, [shortlistIds, shortlistLoaded]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (introVisible) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [introVisible]);

  useEffect(() => {
    if (introVisible) return;
    const observer = new IntersectionObserver((entries) => {
      const enteredHouse = entries.find((entry) => entry.isIntersecting && entry.intersectionRatio > 0.08);
      if (enteredHouse) setActiveHouseId(enteredHouse.target.id as HouseId);
    }, { rootMargin: "-30% 0px -44% 0px", threshold: [0.08, 0.3] });

    houses.forEach((house) => {
      const section = document.getElementById(house.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [introVisible]);

  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (loadedAudioSourceRef.current !== activeAudioSource) {
      ambientAudio.pause();
      if (activeAudioSource) ambientAudio.load();
      else {
        ambientAudio.removeAttribute("src");
        ambientAudio.load();
      }
      loadedAudioSourceRef.current = activeAudioSource ?? null;
    }
    ambientAudio.volume = ambientVolume;
    if (activeAudioSource && soundEnabled && !reducedMotion) {
      void ambientAudio.play().catch(() => undefined);
    } else {
      ambientAudio.pause();
      ambientAudio.currentTime = 0;
    }
  }, [activeAudioSource, ambientVolume, soundEnabled]);

  useEffect(() => () => { void audioContextRef.current?.close(); }, []);

  const getAudioContext = () => {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return null;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();
    return context;
  };

  const playTone = (frequencies: number[], volume: number, duration: number) => {
    const context = getAudioContext();
    if (!context) return;
    const start = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(context.destination);
    frequencies.forEach((tone, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(tone, start + index * 0.038);
      oscillator.connect(gain);
      oscillator.start(start + index * 0.038);
      oscillator.stop(start + duration);
    });
  };

  const toggleIntroSound = () => {
    if (!soundEnabled) getAudioContext();
    setShouldPersistSoundPreferences(true);
    setSoundEnabled((enabled) => !enabled);
  };

  const changeAmbientVolume = (volume: number) => {
    setShouldPersistSoundPreferences(true);
    setAmbientVolume(volume);
  };

  const resetSoundPreferences = () => {
    window.localStorage.removeItem("westeros-atlas-intro-sound");
    window.localStorage.removeItem("westeros-atlas-intro-volume");
    setShouldPersistSoundPreferences(false);
    setSoundEnabled(false);
    setAmbientVolume(0.15);
    setActiveHouseId(null);
    ambientAudioRef.current?.pause();
    if (ambientAudioRef.current) ambientAudioRef.current.currentTime = 0;
  };

  const enterChapter = (sectionId: string, frequency: number, palette: ChapterPalette) => {
    setActivePalette(palette);
    if (soundEnabled && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      playTone([frequency, frequency * 1.25, frequency * 1.5], 0.04, 0.42);
    }
    setIntroVisible(false);
    window.setTimeout(() => scrollToId(sectionId), 180);
  };

  const playChapterCue = (frequency: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (now - lastCueAtRef.current < 180) return;
    lastCueAtRef.current = now;

    if (!soundEnabled) return;
    playTone([frequency, frequency * 1.5], 0.028, 0.26);
  };

  const previewChapterPalette = (palette: ChapterPalette, frequency: number) => {
    setActivePalette(palette);
    playChapterCue(frequency);
  };

  const enterHouseChapter = (houseId: HouseId) => {
    setActiveHouseId(houseId);
    scrollToId(houseId);
  };

  const toggleShortlist = (characterId: string) => {
    setShortlistIds((ids) => {
      if (ids.includes(characterId)) return ids.filter((id) => id !== characterId);
      return ids.length < 3 ? [...ids, characterId] : ids;
    });
  };

  const openCharacterDossier = (character: (typeof mainCharacters)[number]) => {
    setTimelineFocus(null);
    setDossierView("profile");
    setSelectedCharacter(character);
  };

  const openLandmarkTimeline = (landmark: (typeof landmarkEvents)[number]) => {
    const character = mainCharacters.find((entry) => entry.id === landmark.characterId);
    if (!character) return;
    setActiveLandmarkId(landmark.id);
    setTimelineFocus({ characterId: character.id, index: landmark.timelineIndex });
    setDossierView("events");
    setSelectedCharacter(character);
    window.setTimeout(() => document.getElementById(`timeline-${character.id}-${landmark.timelineIndex}`)?.scrollIntoView({ block: "center" }), 120);
  };

  const changeEraFilter = (nextEra: string) => {
    setEraFilter(nextEra);
    const firstMapRecord = chronologicalLandmarkEvents.find((landmark) => nextEra === "all" || landmark.eraKey === nextEra);
    if (firstMapRecord) {
      setActiveLandmarkId(firstMapRecord.id);
      setActiveLocation(realmLocations.find((location) => location.id === firstMapRecord.locationId) ?? realmLocations[0]);
    }
    if (selectedCharacter && dossierView === "events") {
      const firstTimelineRecord = selectedCharacter.timeline.map((event, index) => ({ event, index })).find(({ event }) => nextEra === "all" || timelineEra(event.period) === nextEra);
      setTimelineFocus(firstTimelineRecord ? { characterId: selectedCharacter.id, index: firstTimelineRecord.index } : null);
    }
  };

  const navigateTimelineEvent = (direction: -1 | 1) => {
    if (!selectedCharacter || visibleTimelineEntries.length === 0) return;
    const currentPosition = activeTimelinePosition >= 0 ? activeTimelinePosition : 0;
    const nextPosition = Math.min(Math.max(currentPosition + direction, 0), visibleTimelineEntries.length - 1);
    const nextEvent = visibleTimelineEntries[nextPosition];
    setTimelineFocus({ characterId: selectedCharacter.id, index: nextEvent.index });
    window.setTimeout(() => document.getElementById(`timeline-${selectedCharacter.id}-${nextEvent.index}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 0);
  };

  const exportEraChronicle = () => {
    const chronicle = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const title = eraFilter === "all" ? "Chronicle of the Recorded Eras" : `Chronicle of ${selectedEra.label.replace(/^Era \w+ · /, "")}`;
    chronicle.setFillColor(17, 23, 31);
    chronicle.rect(0, 0, 210, 297, "F");
    chronicle.setDrawColor(198, 169, 107);
    chronicle.setLineWidth(0.35);
    chronicle.rect(12, 12, 186, 273);
    chronicle.setTextColor(218, 190, 129);
    chronicle.setFont("times", "bold");
    chronicle.setFontSize(8);
    chronicle.text("WESTEROS HOUSE ATLAS · HISTORICAL REGISTER", 18, 23);
    chronicle.setFontSize(24);
    chronicle.text(title.toUpperCase(), 18, 36);
    chronicle.setTextColor(193, 181, 157);
    chronicle.setFont("times", "normal");
    chronicle.setFontSize(10);
    chronicle.text(`A one-page record of ${filteredLandmarkEvents.length} landmark event${filteredLandmarkEvents.length === 1 ? "" : "s"}, filed under ${selectedEra.label}.`, 18, 45);
    chronicle.setDrawColor(150, 121, 74);
    chronicle.line(18, 51, 192, 51);
    let cursorY = 61;
    filteredLandmarkEvents.forEach((event) => {
      const character = mainCharacters.find((entry) => entry.id === event.characterId);
      const location = realmLocations.find((entry) => entry.id === event.locationId);
      chronicle.setFillColor(198, 169, 107);
      chronicle.circle(22, cursorY - 2.5, 2.3, "F");
      chronicle.setTextColor(218, 190, 129);
      chronicle.setFont("times", "bold");
      chronicle.setFontSize(8);
      chronicle.text(String(event.order).padStart(2, "0"), 29, cursorY);
      chronicle.setFontSize(14);
      chronicle.text(event.title, 38, cursorY);
      chronicle.setTextColor(183, 170, 145);
      chronicle.setFont("times", "italic");
      chronicle.setFontSize(8);
      chronicle.text(`${event.era.toUpperCase()} · ${location?.place ?? "Unfiled seat"} · ${character?.name ?? "Unfiled witness"}`, 38, cursorY + 5.5);
      chronicle.setTextColor(217, 207, 188);
      chronicle.setFont("times", "normal");
      chronicle.setFontSize(9.2);
      const noteLines = chronicle.splitTextToSize(event.note, 150) as string[];
      chronicle.text(noteLines, 38, cursorY + 10.5);
      cursorY += 18 + noteLines.length * 4.2;
      chronicle.setDrawColor(87, 75, 55);
      chronicle.line(38, cursorY - 4, 192, cursorY - 4);
    });
    chronicle.setTextColor(165, 147, 113);
    chronicle.setFont("times", "bold");
    chronicle.setFontSize(7);
    chronicle.text("ATLAS SEAL · EVERY BANNER LEAVES A SHADOW", 18, 277);
    chronicle.text(`GENERATED FROM THE ${selectedEra.label.toUpperCase()} REGISTER`, 192, 277, { align: "right" });
    chronicle.save(`westeros-house-atlas-${eraFilter}-chronicle.pdf`);
  };

  return (
    <main className="atlas-shell">
      {introVisible && (
        <section className="atlas-intro" role="dialog" aria-modal="true" aria-label="Westeros House Atlas opening sequence">
          <video className="intro-motion" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
            <source src="/manus-storage/dragon-flight-hero_0969f4c2.mp4" type="video/mp4" />
          </video>
          <div className="intro-scrim" />
          <div className="intro-constellation" aria-hidden="true"><i /><i /><i /></div>
          <div className="intro-audio-controls">
            <button className="intro-sound-toggle" onClick={toggleIntroSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? "Mute all intro sounds" : "Enable intro sounds"} title={soundEnabled ? "Mute intro sounds" : "Enable intro sounds"}>
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}<span>{soundEnabled ? "Sound summoned" : "Sound hushed"}</span>
            </button>
            <label className="intro-volume-control">
              <span>Ambient field · {Math.round(ambientVolume * 100)}%</span>
              <input type="range" min="0" max="0.35" step="0.01" value={ambientVolume} onChange={(event) => changeAmbientVolume(Number(event.target.value))} aria-label="Ambient soundtrack volume" style={{ background: `linear-gradient(90deg, var(--gold-bright) 0 ${volumePercent}%, rgba(226,212,185,.28) ${volumePercent}% 100%)` }} />
            </label>
          </div>
          <div className="intro-content">
            <p className="intro-kicker">A record of blood &amp; banner</p>
            <img className="intro-mark" src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" />
            <p className="intro-wordmark"><span>Westeros</span><strong>House Atlas</strong></p>
            <p className="intro-line">Every banner leaves a shadow.</p>
            <div className="intro-chapter-card" aria-label="Choose where to enter the atlas">
              <span>Choose a chapter</span>
              <div className="intro-chapter-options">
                <button className="intro-chapter-option" onClick={() => enterChapter("houses", 196, "houses")} onPointerEnter={() => previewChapterPalette("houses", 196)} onFocus={() => previewChapterPalette("houses", 196)}>
                  <small>Chapter I</small><strong>The houses</strong><span>Old vows, cold blood, and banners that refuse to bow.</span><ArrowUpRight size={14} />
                </button>
                <button className="intro-chapter-option" onClick={() => enterChapter("realm-map", 220, "realm")} onPointerEnter={() => previewChapterPalette("realm", 220)} onFocus={() => previewChapterPalette("realm", 220)}>
                  <small>Chapter II</small><strong>The realm</strong><span>Five roads converge where every crown bears a cost.</span><ArrowUpRight size={14} />
                </button>
                <button className="intro-chapter-option" onClick={() => enterChapter("relationships", 247, "loyalties")} onPointerEnter={() => previewChapterPalette("loyalties", 247)} onFocus={() => previewChapterPalette("loyalties", 247)}>
                  <small>Chapter III</small><strong>The loyalties</strong><span>Allies by necessity, enemies by memory.</span><ArrowUpRight size={14} />
                </button>
              </div>
              <small>Choose a record to enter the annals.</small>
            </div>
          </div>
          <div className="intro-progress" aria-hidden="true"><i /></div>
        <button className="intro-skip" onClick={() => setIntroVisible(false)}>Enter the annals <ArrowUpRight size={14} /></button>
        </section>
      )}
      <video className="site-motion" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
        <source src="/manus-storage/dragon-flight-hero_0969f4c2.mp4" type="video/mp4" />
      </video>
      <audio ref={ambientAudioRef} src={activeAudioSource} loop preload="metadata" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => scrollToId("top")} aria-label="Return to the top of the atlas">
          <img className="brand-mark" src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" />
          <span className="brand-copy">
            <span>Westeros</span>
            <span>House Atlas</span>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => scrollToId("realm-map")}>Realm Map</button>
          <button onClick={() => scrollToId("houses")}>Great Houses</button>
          <button onClick={() => scrollToId("characters")}>Characters</button>
          <button onClick={() => scrollToId("relationships")}>Relations</button>
          <button onClick={() => enterHouseChapter("stark")}>The North</button>
          <button onClick={() => enterHouseChapter("lannister")}>The West</button>
        </nav>

        <button className="menu-trigger" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <button onClick={() => { scrollToId("realm-map"); setMenuOpen(false); }}>Realm Map</button>
            <button onClick={() => { scrollToId("houses"); setMenuOpen(false); }}>Great Houses</button>
            <button onClick={() => { scrollToId("characters"); setMenuOpen(false); }}>Main Characters</button>
            <button onClick={() => { scrollToId("relationships"); setMenuOpen(false); }}>Relationship Atlas</button>
            {houses.map((house) => (
              <button key={house.id} onClick={() => { enterHouseChapter(house.id as HouseId); setMenuOpen(false); }}>
                House {house.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image" />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="eyebrow"><Compass size={14} /> A record of blood &amp; banner</p>
          <h1 id="hero-title"><span>The great</span> houses of the realm.</h1>
          <p className="hero-lede">An atlas of ancient names, contested power, and the characters who carried their banners through winter and war.</p>
          <div className="hero-actions">
            <button className="gold-button" onClick={() => scrollToId("houses")}>Enter the annals <ArrowDown size={16} /></button>
            <p>Volume I <span>·</span> Five great houses</p>
          </div>
        </div>
        <div className="hero-folio" aria-hidden="true"><span>01</span><i /></div>
        <div className="hero-atlas-seal" aria-hidden="true">
          <img src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" />
          <span>Atlas seal<br />of blood &amp; banner</span>
        </div>
      </section>

      <section className="prologue" id="houses" aria-labelledby="prologue-title">
        <div className="prologue-title">
          <p className="eyebrow dark"><Shield size={14} /> The first ledger</p>
          <h2 id="prologue-title">Names carry farther than armies.</h2>
        </div>
        <div className="prologue-copy">
          <p>Each house is a country in miniature — a geography, a memory, a promise. Begin with five families whose rival visions redraw the map from the Wall to the western coast.</p>
          <div className="house-index" aria-label="House index">
            {houses.map((house, index) => (
              <button key={house.id} onClick={() => enterHouseChapter(house.id as HouseId)}>
                <span>0{index + 1}</span>
                <strong>{house.name}</strong>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="realm-map-section" id="realm-map" aria-labelledby="realm-map-title">
        <div className="map-heading">
          <div>
            <p className="eyebrow"><MapPinned size={14} /> Realm index</p>
            <h2 id="realm-map-title">Trace the seats of power.</h2>
          </div>
          <p>Choose a seal to uncover the keep, region, and political character behind each major house. The map is an archival guide, not a claim to any one allegiance.</p>
        </div>

        <div className="map-figure">
          <div className="map-canvas" role="group" aria-label="Interactive map of major house seats">
            <p className="map-north" aria-hidden="true">N <i /></p>
            {realmLocations.map((location) => (
              <button
                className={`map-marker ${location.accent} ${activeLocation.id === location.id ? "is-active" : ""}`}
                key={location.id}
                style={{ left: location.x, top: location.y }}
                onClick={() => { setActiveLandmarkId(null); setActiveLocation(location); }}
                aria-pressed={activeLocation.id === location.id}
                aria-label={`Show ${location.place}, seat of ${location.house}`}
              >
                <span className="marker-pulse" />
                <span className="marker-seal">{location.seal.slice(0, 1)}</span>
                <span className="marker-label">{location.place}</span>
              </button>
            ))}
            {filteredLandmarkEvents.map((landmark) => (
              <button className={`event-marker ${landmark.accent} ${activeLandmarkId === landmark.id ? "is-active" : ""}`} key={landmark.id} style={{ left: landmark.x, top: landmark.y }} onClick={() => { setActiveLandmarkId(landmark.id); setActiveLocation(realmLocations.find((location) => location.id === landmark.locationId) ?? realmLocations[0]); }} aria-pressed={activeLandmarkId === landmark.id} aria-label={`Show landmark event: ${landmark.title}`}><span>✦</span><i>{landmark.label}</i></button>
            ))}
            <div className="map-scale" aria-hidden="true"><span /><small>100 leagues</small></div>
          </div>

          <aside className={`map-detail ${activeLocation.accent}`} aria-live="polite">
            <div className="detail-topline"><span>Seat {activeLocation.chapter}</span><span>{activeLocation.seal}</span></div>
            <div className="detail-seal" aria-hidden="true">{activeLocation.seal.slice(0, 1)}</div>
            <p className="detail-house">{activeLocation.house}</p>
            <h3>{activeLocation.place}</h3>
            <p className="detail-realm">{activeLocation.realm}</p>
            <p className="detail-note">{activeLocation.note}</p>
            {activeLandmark && activeLandmarkCharacter && <article className={`landmark-ledger ${activeLandmark.accent}`}><p>Landmark event · {activeLandmark.label}</p><h4>{activeLandmark.title}</h4><span>{activeLandmark.note}</span><button onClick={() => openLandmarkTimeline(activeLandmark)}>Open {activeLandmarkCharacter.name.split(" ")[0]}’s timeline <ArrowUpRight size={14} /></button></article>}
            {activeLocation.houseId ? (
              <button className="detail-link" onClick={() => enterHouseChapter(activeLocation.houseId as HouseId)}>Open house record <ArrowUpRight size={16} /></button>
            ) : (
              <p className="detail-unfiled">Record forthcoming in a later volume.</p>
            )}
            <div className="map-key" aria-label="House marker key">
              {realmLocations.map((location) => (
                <button key={location.id} className={`${location.accent} ${activeLocation.id === location.id ? "is-active" : ""}`} onClick={() => { setActiveLandmarkId(null); setActiveLocation(location); }}>
                  <i />{location.house.replace("House ", "")}
                </button>
              ))}
            </div>
          </aside>
          <aside className="map-event-ledger" aria-labelledby="map-event-ledger-title">
            <div className="event-ledger-heading"><img src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" /><span>Historical register</span><h3 id="map-event-ledger-title">All event records</h3><p>Five turning points, arranged by the order in which their claims enter the annals.</p><div className="map-era-filter" role="group" aria-label="Filter historical records by era">{eraFilters.map((era) => <button key={era.id} className={eraFilter === era.id ? "is-active" : ""} onClick={() => changeEraFilter(era.id)}>{era.label}</button>)}</div><button className="chronicle-export" onClick={exportEraChronicle} disabled={filteredLandmarkEvents.length === 0}>Download {selectedEra.label} chronicle <ArrowDown size={13} /></button></div>
            <ol>
              {filteredLandmarkEvents.map((landmark) => {
                const character = mainCharacters.find((entry) => entry.id === landmark.characterId);
                const location = realmLocations.find((entry) => entry.id === landmark.locationId);
                return <li key={landmark.id}><button className={`${landmark.accent} ${activeLandmarkId === landmark.id ? "is-active" : ""}`} onClick={() => openLandmarkTimeline(landmark)}><span>{String(landmark.order).padStart(2, "0")}</span><div><small>{landmark.era} · {location?.place}</small><strong>{landmark.title}</strong><p>{landmark.note}</p><em>{character?.name}</em></div><ArrowUpRight size={13} /></button></li>;
              })}
            </ol>
          </aside>
        </div>
      </section>

      <section className="character-archive" id="characters" aria-labelledby="characters-title">
        <div className="archive-heading">
          <div>
            <p className="eyebrow"><Crown size={14} /> Witness accounts</p>
            <h2 id="characters-title">The figures who move the realm.</h2>
          </div>
          <p>Five defining lives, captured in visual portrait cards and recorded through their loyalties, habits, and turning points. Each dossier follows the trace that character leaves across a house, a region, and the wider realm.</p>
        </div>

        <div className="archive-filters" aria-label="Filter the character archive">
          <img className="archive-filter-seal" src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" />
          <div className="archive-filter-group"><span>House record</span><div role="group" aria-label="Filter characters by house">
            <button className={houseFilter === "all" ? "is-active" : ""} onClick={() => setHouseFilter("all")}>All banners</button>
            {houses.map((house) => <button key={house.id} className={houseFilter === house.id ? "is-active" : ""} onClick={() => setHouseFilter(house.id)}>{house.name}</button>)}
          </div></div>
          <div className="archive-filter-group"><span>Allegiance register</span><div role="group" aria-label="Filter characters by allegiance">
            <button className={allegianceFilter === "all" ? "is-active" : ""} onClick={() => setAllegianceFilter("all")}>All annals</button>
            {[["alliance", "Alliance"], ["kinship", "Kinship"], ["caution", "Caution"], ["rivalry", "Rivalry"]].map(([id, label]) => <button key={id} className={allegianceFilter === id ? "is-active" : ""} onClick={() => setAllegianceFilter(id)}>{label}</button>)}
          </div></div>
          <p aria-live="polite">{filteredCharacters.length} filed record{filteredCharacters.length === 1 ? "" : "s"}</p>
        </div>

        <div className="shortlist-bar" aria-live="polite">
          <div><span>Comparison ledger</span><strong>{shortlistIds.length}/3 records sealed</strong><p>Select two or three dossiers to compare house, allegiances, and traits.</p></div>
          <button onClick={() => setShortlistOpen(true)} disabled={shortlistIds.length < 2}>Compare shortlisted</button>
        </div>

        <div className="character-gallery" aria-label="Main character archive">
          {filteredCharacters.map((character) => {
            const characterHouse = houses.find((house) => house.id === character.houseId)!;
            return (
            <article className={`character-card ${character.accent}`} key={character.id}>
              <button className="character-plate character-photo-trigger" onClick={() => openCharacterDossier(character)} aria-label={`Open ${character.name} dossier`}>
                <img src={character.image} alt={`Visual character portrait of ${character.name}`} />
                <span className="character-hover-reveal" aria-hidden="true"><img src={characterHouse.image} alt="" /><i>{characterHouse.seal}</i><strong>{character.name}</strong></span>
                <span>Record {character.chapter}</span>
              </button>
              <div className="character-copy">
                <div className="character-meta"><span>Witness account</span><span>{character.house.split(" · ")[0].replace("House ", "")}</span></div>
                <p>{character.epithet}</p>
                <h3>{character.name}</h3>
                <span>{character.house}</span>
                <div className="character-reveal">
                  <p>{character.description}</p>
                  <button onClick={() => enterHouseChapter(character.houseId as HouseId)}>Open house record <ArrowUpRight size={15} /></button>
                  <button className={`shortlist-button ${shortlistIds.includes(character.id) ? "is-saved" : ""}`} onClick={() => toggleShortlist(character.id)} disabled={!shortlistIds.includes(character.id) && shortlistIds.length >= 3}>{shortlistIds.includes(character.id) ? "Release from shortlist" : "Seal to shortlist"}</button>
                </div>
              </div>
            </article>
          );})}
        </div>
        {filteredCharacters.length === 0 && <p className="archive-empty">No witness records match this filing. Clear a filter to return to the full register.</p>}
      </section>

      <Dialog open={Boolean(selectedCharacter)} onOpenChange={(open) => { if (!open) { setDossierView("profile"); setTimelineFocus(null); setSelectedCharacter(null); } }}>
        {selectedCharacter && selectedCharacterHouse && <DialogContent className={`character-modal ${dossierView === "events" ? "is-events-only" : ""}`}>
          <div className={`character-modal-plate ${selectedCharacter.accent}`}>
            <img src={selectedCharacter.image} alt={`Portrait of ${selectedCharacter.name}`} />
            <span>{selectedCharacterHouse.seal}</span>
          </div>
          <div className="character-modal-copy">
            <p className="modal-record">Witness dossier · record {selectedCharacter.chapter}</p>
            <DialogTitle>{selectedCharacter.name}</DialogTitle>
            <DialogDescription>{selectedCharacter.epithet} · {selectedCharacter.house}</DialogDescription>
            <div className="dossier-view-switch" role="tablist" aria-label="Choose dossier reading mode"><button role="tab" aria-selected={dossierView === "profile"} onClick={() => setDossierView("profile")}>Full dossier</button><button role="tab" aria-selected={dossierView === "events"} onClick={() => setDossierView("events")}>Events only</button></div>
            {dossierView === "events" ? <section id="dossier-reading-panel" className="modal-timeline event-reading-timeline" aria-labelledby="modal-timeline-title"><div className="event-reading-masthead"><img src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" /><p id="modal-timeline-title">Historical reading · {eraFilter === "all" ? "all turning points" : eraFilters.find((era) => era.id === eraFilter)?.label}</p></div><span className="event-reading-intro">A focused chronicle of {selectedCharacter.name.split(" ")[0]}’s recorded movements through the realm.</span>{visibleTimelineEntries.length > 0 ? <><div className="event-reading-navigation"><button onClick={() => navigateTimelineEvent(-1)} disabled={activeTimelinePosition <= 0}><ArrowLeft size={14} /> Previous record</button><span>{Math.max(activeTimelinePosition, 0) + 1} of {visibleTimelineEntries.length}</span><button onClick={() => navigateTimelineEvent(1)} disabled={activeTimelinePosition < 0 || activeTimelinePosition >= visibleTimelineEntries.length - 1}>Next record <ArrowRight size={14} /></button></div><ol>{visibleTimelineEntries.map((event) => <li id={`timeline-${selectedCharacter.id}-${event.index}`} className={timelineFocus?.characterId === selectedCharacter.id && timelineFocus.index === event.index ? "is-linked" : ""} key={event.title}><span>{event.period}</span><div><strong>{event.title}</strong><p>{event.note}</p></div></li>)}</ol></> : <p className="event-filter-empty">No recorded turning point appears in this era. Choose another era in the realm register.</p>}</section> : <div id="dossier-reading-panel"><p className="modal-backstory">{selectedCharacter.backstory}</p><section className="modal-timeline" aria-labelledby="modal-timeline-title"><p id="modal-timeline-title">Chronicle of turning points</p>{visibleTimelineEntries.length > 0 ? <ol>{visibleTimelineEntries.map((event) => <li id={`timeline-${selectedCharacter.id}-${event.index}`} className={timelineFocus?.characterId === selectedCharacter.id && timelineFocus.index === event.index ? "is-linked" : ""} key={event.title}><span>{event.period}</span><div><strong>{event.title}</strong><p>{event.note}</p></div></li>)}</ol> : <p className="event-filter-empty">No turning point is filed under the selected era.</p>}</section><div className="character-stats" aria-label={`${selectedCharacter.name} character stats`}>{selectedCharacter.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><i><b style={{ width: `${stat.value}%` }} /></i></div>)}</div><div className="modal-allegiances"><span>Allegiance register</span>{selectedCharacter.allegiances.map((allegiance) => <i key={allegiance}>{allegiance}</i>)}</div><button className={`shortlist-button modal-shortlist ${shortlistIds.includes(selectedCharacter.id) ? "is-saved" : ""}`} onClick={() => toggleShortlist(selectedCharacter.id)} disabled={!shortlistIds.includes(selectedCharacter.id) && shortlistIds.length >= 3}>{shortlistIds.includes(selectedCharacter.id) ? "Release from shortlist" : shortlistIds.length >= 3 ? "Shortlist full" : "Seal to shortlist"}</button><button className="text-link modal-house-link" onClick={() => { setDossierView("profile"); setTimelineFocus(null); setSelectedCharacter(null); enterHouseChapter(selectedCharacter.houseId as HouseId); }}>Open house record <ArrowUpRight size={15} /></button></div>}
          </div>
        </DialogContent>}
      </Dialog>

      <Dialog open={shortlistOpen} onOpenChange={setShortlistOpen}>
        <DialogContent className="shortlist-modal">
          <p className="modal-record">Comparison ledger · {shortlistedCharacters.length} sealed records</p>
          <DialogTitle>Claims set side by side.</DialogTitle>
          <DialogDescription>Read the selected dossiers across house, allegiance, and defining measures.</DialogDescription>
          <div className="shortlist-comparison">
            {shortlistedCharacters.map((character) => {
              const characterHouse = houses.find((house) => house.id === character.houseId)!;
              return <article className={`shortlist-record ${character.accent}`} key={character.id}>
                <img src={character.image} alt={`Portrait of ${character.name}`} />
                <p>{characterHouse.seal} · record {character.chapter}</p><h3>{character.name}</h3><span>{character.epithet}</span>
                <dl><div><dt>House</dt><dd>{characterHouse.name}</dd></div>{character.stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
                <div className="shortlist-allegiances">{character.allegiances.map((allegiance) => <i key={allegiance}>{allegiance}</i>)}</div>
                <button onClick={() => toggleShortlist(character.id)}>Release record</button>
              </article>;
            })}
          </div>
        </DialogContent>
      </Dialog>

      <section className="relationship-atlas" id="relationships" aria-labelledby="relationships-title">
        <div className="relationship-heading">
          <div>
            <p className="eyebrow dark"><GitFork size={14} /> Allegiance register</p>
            <h2 id="relationships-title">The map of loyalties is never still.</h2>
          </div>
          <p>Select a character node or connection to trace the alliances, rivalries, kinship, and provisional counsel that shape the realm’s most consequential decisions.</p>
        </div>

        <div className="relationship-shell">
          <div className="relation-canvas" role="group" aria-label="Interactive relationship diagram for the main characters">
            <p className="relation-cardinal" aria-hidden="true">Allegiance chart <span>Vol. I</span></p>
            <svg className="relation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {relationshipEdges.map((edge) => (
                <g
                  className={`relationship-edge ${edge.type} ${activeRelationship.id === edge.id ? "is-active" : ""}`}
                  key={edge.id}
                  onClick={() => setActiveRelationshipId(edge.id)}
                >
                  <path className="relationship-hit" d={edge.path} />
                  <path className="relationship-line" d={edge.path} />
                  <circle cx={edge.anchor.x} cy={edge.anchor.y} r="1.35" />
                </g>
              ))}
            </svg>

            {relationshipNodes.map((node) => {
              const isConnected = activeRelationship.source === node.id || activeRelationship.target === node.id;
              const firstRelationship = relationshipEdges.find((edge) => edge.source === node.id || edge.target === node.id);
              return (
                <button
                  key={node.id}
                  className={`relation-node ${node.accent} ${isConnected ? "is-connected" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => firstRelationship && setActiveRelationshipId(firstRelationship.id)}
                  aria-label={`Select ${node.name} in the relationship chart`}
                  aria-pressed={isConnected}
                >
                  <span className="relation-portrait"><img src={node.image} alt="" /></span>
                  <span className="relation-node-copy"><strong>{node.name}</strong><small>{node.locus}</small></span>
                </button>
              );
            })}

            <div className="relation-legend" aria-label="Relationship legend">
              <span className="alliance"><i />Alliance</span><span className="rivalry"><i />Rivalry</span><span className="kinship"><i />Kinship</span><span className="caution"><i />Caution</span>
            </div>
          </div>

          <aside className={`relationship-detail ${activeRelationship.type}`} aria-live="polite">
            <p className="detail-eyebrow">Selected connection <span>{activeRelationship.type}</span></p>
            <div className="relationship-names"><button onClick={() => scrollToId(activeSource.id)}>{activeSource.name}</button><i>×</i><button onClick={() => scrollToId(activeTarget.id)}>{activeTarget.name}</button></div>
            <h3>{activeRelationship.label}</h3>
            <p>{activeRelationship.detail}</p>
            <div className="relationship-nodes"><span>{activeSource.house.split(" · ")[0]}</span><i /><span>{activeTarget.house.split(" · ")[0]}</span></div>
            <div className="relationship-ledger" aria-label="Select a relationship">
              {relationshipEdges.map((edge) => {
                const source = relationshipNodes.find((node) => node.id === edge.source)!;
                const target = relationshipNodes.find((node) => node.id === edge.target)!;
                return <button key={edge.id} className={`${edge.type} ${activeRelationship.id === edge.id ? "is-active" : ""}`} onClick={() => setActiveRelationshipId(edge.id)}><i /><span>{source.name.split(" ")[0]} · {target.name.split(" ")[0]}</span></button>;
              })}
            </div>
          </aside>
        </div>
      </section>

      <div className="chronicle-rule" aria-hidden="true"><span /><img className="transition-mark" src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" /></div>

      <section className="houses" aria-label="House profiles">
        {houses.map((house, index) => (
          <article className={`house-spread ${house.id}`} id={house.id} key={house.id} aria-labelledby={`${house.id}-title`}>
            <div className="spread-ornament" aria-hidden="true">{house.chapter}</div>
            <div className="house-meta">
              <p>Chapter {house.chapter}</p>
              <p>{house.region}</p>
            </div>

            <div className="portrait-frame">
              <img src={house.image} alt={`Original heraldic atlas plate representing House ${house.name}`} />
              <div className="portrait-caption"><span>{house.seal}</span><i /></div>
            </div>

            <div className="house-story">
              <div className="crest" aria-hidden="true"><img src={house.image} style={{ objectPosition: house.sealPosition }} alt="" /></div>
              <p className="eyebrow dark">House of {house.name}</p>
              <h2 id={`${house.id}-title`}>{house.epithet}</h2>
              <p className="words">“{house.words}”</p>
              <p className="house-copy">{house.copy}</p>
              <button className="text-link" onClick={() => enterHouseChapter(house.id as HouseId)}>Enter this house record <ArrowUpRight size={16} /></button>
            </div>

            <section className="character-profile" id={`${house.id}-profile`} aria-labelledby={`${house.id}-character`}>
              <div>
                <p className="profile-label">Notable archive</p>
                <h3 id={`${house.id}-character`}>{house.character}</h3>
                <p className="profile-role">{house.role}</p>
              </div>
              <p className="profile-bio">{house.bio}</p>
              <ul className="trait-list" aria-label={`${house.character} defining traits`}>
                {house.traits.map((trait) => <li key={trait}>{trait}</li>)}
              </ul>
            </section>

            <div className="spread-foot"><span>{house.accent}</span><span>House record / {String(index + 1).padStart(2, "0")}</span></div>
          </article>
        ))}
      </section>

      <footer className="footer">
        <div className="footer-mark"><img src="/manus-storage/atlas-compass-mark_34df19f2.png" alt="" /><span>Westeros House Atlas</span></div>
        <p>An original fan-made editorial interface. Character and house names are referenced for descriptive, noncommercial fan context.</p>
        <div className="footer-actions">
          <button onClick={() => { setIntroVisible(true); window.scrollTo({ top: 0, behavior: "auto" }); }}>Replay intro <ArrowUpRight size={15} /></button>
          <button onClick={() => scrollToId("top")}>Return to the index <ArrowUpRight size={15} /></button>
          <button className="preference-reset" onClick={resetSoundPreferences} aria-label="Clear saved sound preferences and mute ambient audio">Clear sound settings</button>
        </div>
      </footer>
    </main>
  );
}
