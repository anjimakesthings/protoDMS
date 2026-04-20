import type { WorkItem, User, Order } from '../types'

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function makeDate(weekStart: Date, dayOffset: number, hour: number, minute = 0): string {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const monday = getMonday(new Date())

export const MOCK_ORDERS: Order[] = [
  {
    orderNumber: '240315',
    orderDate: makeDate(monday, -14, 9),
    customerName: 'Strandvägen Fastigheter AB',
    customerEmail: 'kontakt@strandvagen.se',
    storageLocation: 'Hall B – Sektion 3',
    pickupDate: makeDate(monday, 0, 10),
    pickupStorageAddress: 'Lagervägen 4, Stockholm – Rad 7, Plats 12',
    deliveryAddress: 'Strandvägen 12, 114 56 Stockholm',
    products: [
      {
        id: 'P1',
        name: 'Kontorsstol Ergon Pro',
        description: 'Ergonomisk kontorsstol med justerbart ryggstöd och höjdjusterbart sittsäte. Levereras i 15 exemplar.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Kontorsstol',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Stol',
        quantity: 15,
        unit: 'st',
      },
      {
        id: 'P2',
        name: 'Skrivbord Standard 160',
        description: 'Höj- och sänkbart skrivbord 160×80 cm, vitlackerad MDF-skiva med elmotor.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Skrivbord',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Bord',
        quantity: 5,
        unit: 'st',
      },
    ],
  },
  {
    orderNumber: '241087',
    orderDate: makeDate(monday, -5, 9),
    customerName: 'Järva Krog & Konferens AB',
    customerEmail: 'info@jarvakrog.se',
    storageLocation: 'Hall A – Sektion 1',
    pickupDate: null,
    pickupStorageAddress: 'Järva krog 2, Spånga – Lastbrygga väster',
    deliveryAddress: 'Återbrukscenter, Ulvsundaleden 22, Bromma',
    products: [
      {
        id: 'P3',
        name: 'Köksutrustning – Blandat',
        description: 'Begagnad köksutrustning inklusive stekbord, fritös och kylskåp. Totalt 8 enheter för återbruk.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=K%C3%B6ksutrustning',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Kök',
        quantity: 8,
        unit: 'st',
      },
    ],
  },
  {
    orderNumber: '240289',
    orderDate: makeDate(monday, -10, 14),
    customerName: 'Kungsholmen Möbler & Design',
    customerEmail: 'order@kungsholmenmobler.se',
    storageLocation: 'Hall C – Sektion 5',
    pickupDate: makeDate(monday, 0, 8),
    pickupStorageAddress: 'Kungsholmsgatan 18, Stockholm – Plan 1',
    deliveryAddress: 'Återbrukslager, Gustavslundsvägen 151, 167 51 Bromma',
    products: [
      {
        id: 'P4',
        name: 'Returmöbler – Blandat',
        description: 'Begagnade kontorsmöbler för återbruk. Innehåller stolar, bord och hyllor i varierande skick.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Returm%C3%B6bler',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Möbler',
        quantity: 1,
        unit: 'lot',
      },
    ],
  },
  {
    orderNumber: '240422',
    orderDate: makeDate(monday, 2, 8),
    customerName: 'Medborgarplatsen Restaurang AB',
    customerEmail: 'bestellung@medborgarplatsen.se',
    storageLocation: 'Hall D – Sektion 2',
    pickupDate: null,
    pickupStorageAddress: 'Möbellager, Kungens Kurva – Lastbrygga B',
    deliveryAddress: 'Medborgarplatsen 4, 118 26 Stockholm',
    products: [
      {
        id: 'P5',
        name: 'Restaurangbord Rondo',
        description: 'Runda restaurangbord, diameter 80 cm, laminatskiva. Levereras med montageanvisning.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Restaurangbord',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Bord',
        quantity: 12,
        unit: 'st',
      },
      {
        id: 'P6',
        name: 'Restaurangstol Bistro',
        description: 'Stapelbar bistrostol i lackad metall med sittkudde. Lämplig för inomhusbruk.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Restaurangstol',
        quantity: 48,
        unit: 'st',
      },
    ],
  },
  {
    orderNumber: '240509',
    orderDate: makeDate(monday, 3, 7),
    customerName: 'Östermalm Bygg & Projekt AB',
    customerEmail: 'projekt@ostermalmbygg.se',
    storageLocation: 'Utomhuslager – Sektion 9',
    pickupDate: makeDate(monday, 9, 8),
    pickupStorageAddress: 'Byggmax, Lidingö – Utlastning 3',
    deliveryAddress: 'Byggarbetsplats, Karlavägen 45, 114 31 Stockholm',
    products: [
      {
        id: 'P7',
        name: 'Byggmaterial – Träpall',
        description: 'Träreglar 45×95 mm, längd 4,2 m. Levereras på EUR-pall, 48 st per pall.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Byggmaterial',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Träpall',
        quantity: 4,
        unit: 'pallar',
      },
    ],
  },
  {
    orderNumber: '240611',
    orderDate: makeDate(monday, 4, 8),
    customerName: 'Vasastan Musikskola',
    customerEmail: 'administration@vasastanmusik.se',
    storageLocation: 'Hall E – Sektion 1 (Specialgods)',
    pickupDate: makeDate(monday, 14, 11),
    pickupStorageAddress: 'Gamla lokalen, Upplandsgatan 4, Vasastan – Port B',
    deliveryAddress: 'Musikskolan, Fridhemsplan 1, 112 46 Stockholm',
    products: [
      {
        id: 'P8',
        name: 'Konsertpiano Steinway B',
        description: 'Konsertflygel, 211 cm. Kräver specialtransport med pianomövers. Tre exemplar.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Konsertpiano',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Piano',
        quantity: 3,
        unit: 'st',
      },
    ],
  },
  {
    orderNumber: '240813',
    orderDate: makeDate(monday, 1, 9),
    customerName: 'Nacka Kontor & Inredning',
    customerEmail: 'logistik@nackakontor.se',
    storageLocation: 'Hall B – Sektion 7',
    pickupDate: makeDate(monday, 3, 9),
    pickupStorageAddress: 'Industrivägen 8, Nacka – Lastbrygga 2',
    deliveryAddress: 'Återbrukslager, Gustavslundsvägen 151, 167 51 Bromma',
    products: [
      {
        id: 'P9',
        name: 'Kontorsmöbler – Blandat',
        description: 'Begagnade skrivbord 140×80 cm och kontorsstolar. Blandad kvalitet, godkänd för återbruk.',
        imageUrl: 'https://placehold.co/400x300/e5e7eb/374151?text=Kontorsm%C3%B6bler',
        thumbnailUrl: 'https://placehold.co/80x60/d1d5db/374151?text=Möbler',
        quantity: 20,
        unit: 'st',
      },
    ],
  },
]

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'Anna Svensson',    initials: 'AS' },
  { id: 'U2', name: 'Erik Lindqvist',   initials: 'EL' },
  { id: 'U3', name: 'Maria Johansson',  initials: 'MJ' },
  { id: 'U4', name: 'Lars Bergström',   initials: 'LB' },
]

export const MOCK_WORK_ITEMS: WorkItem[] = [
  {
    id: 'WI-001',
    type: 'TRANSPORT',
    status: 'IN_PROGRESS',
    title: 'Flytt av kontorsmöbler – Strandvägen 12',
    description: 'Transport av 15 kontorsstolar och 5 skrivbord från lager till kund.',
    reference: '240315',
    assignedToUserIds: ['U1'],
    scheduledDate: makeDate(monday, 0, 10),       // Apr 13
    transport: {
      pickupAddress: 'Lagervägen 4, Stockholm',
      deliveryAddress: 'Strandvägen 12, Stockholm',
      transportType: 'Lastbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, -3, 10) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, -1, 11), detail: 'IN_PROGRESS' },
    ],
    createdAt: makeDate(monday, -3, 10),
    updatedAt: makeDate(monday, -1, 11),
  },
  {
    id: 'WI-002',
    type: 'TRANSPORT',
    status: 'PLANNED',
    title: 'Leverans av kontorsmöbler – Kungsholmen',
    description: 'Transport av skrivbord och stolar till nytt kontor på Kungsholmen.',
    reference: '240315',
    assignedToUserIds: ['U2'],
    scheduledDate: makeDate(monday, 2, 9),
    transport: {
      pickupAddress: 'Möbellager, Bromma',
      deliveryAddress: 'Fleminggatan 22, Stockholm',
      transportType: 'Lastbil',
    },
    actions: [
      { id: 'A1', text: 'Lasta möbler på lastbil', completed: true },
      { id: 'A2', text: 'Lossa och placera möbler', completed: false },
    ],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, -2, 9) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, -1, 14), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, -2, 9),
    updatedAt: makeDate(monday, -1, 14),
  },
  {
    id: 'WI-003',
    type: 'TRANSPORT',
    status: 'PLANNED',
    title: 'Leverans av arkivmaterial – Kommunhuset',
    description: 'Leverera 20 arkivlådor från centralarkivet till kommunhuset.',
    reference: '2403871',
    assignedToUserIds: ['U1'],
    scheduledDate: makeDate(monday, 4, 10),        // Apr 17
    transport: {
      pickupAddress: 'Centralarkivet, Göteborg',
      deliveryAddress: 'Kommunhuset, Haninge',
      transportType: 'Skåpbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, -1, 8) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 0, 9), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, -1, 8),
    updatedAt: makeDate(monday, 0, 9),
  },
  {
    id: 'WI-004',
    type: 'TRANSPORT',
    status: 'CREATED',
    title: 'Upphämtning av begagnad utrustning – Järva',
    description: 'Hämta upp begagnad köksutrustning för vidare transport till återbrukscenter.',
    reference: '241087',
    assignedToUserIds: [],
    scheduledDate: null,
    transport: {
      pickupAddress: 'Järva krog 2, Spånga',
      deliveryAddress: 'Återbrukscenter, Ulvsunda',
      transportType: '',
    },
    actions: [
      { id: 'A3', text: 'Packa och säkra utrustning', completed: false },
      { id: 'A4', text: 'Lämna kvittens på återbrukscentret', completed: false },
    ],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 0, 11) },
    ],
    createdAt: makeDate(monday, 0, 11),
    updatedAt: makeDate(monday, 0, 11),
  },
  {
    id: 'WI-005',
    type: 'TRANSPORT',
    status: 'COMPLETED',
    title: 'Hämtning av returmöbler – Kungsholmen',
    description: 'Hämta begagnade möbler för återbruk.',
    reference: '240289',
    assignedToUserIds: ['U3'],
    scheduledDate: makeDate(monday, 0, 8),        // Apr 13
    transport: {
      pickupAddress: 'Kungsholmsgatan 18, Stockholm',
      deliveryAddress: 'Återbrukslager, Bromma',
      transportType: 'Lastbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, -4, 14) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, -3, 9), detail: 'PLANNED' },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 6, 8, 30), detail: 'IN_PROGRESS' },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 6, 11), detail: 'COMPLETED' },
    ],
    createdAt: makeDate(monday, -4, 14),
    updatedAt: makeDate(monday, 6, 11),
  },
  {
    id: 'WI-007',
    type: 'TRANSPORT',
    status: 'CANCELLED',
    title: 'Flytt av IT-utrustning – Serverrum',
    description: 'Flytt och återinstallation av servers och nätverksutrustning.',
    reference: '24001122',
    assignedToUserIds: ['U2'],
    scheduledDate: makeDate(monday, 7, 14),        // Apr 20
    transport: {
      pickupAddress: 'Gamla serverrummet, Kv. 2',
      deliveryAddress: 'Nya serverrummet, Kv. 4',
      transportType: 'Specialtransport',
    },
    actions: [],
    cancellationComment: 'Kunden avbokade transporten med kort varsel. Nytt datum ej bekräftat.',
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 0, 13) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 1, 10), detail: 'PLANNED' },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 2, 9), detail: 'CANCELLED' },
    ],
    createdAt: makeDate(monday, 0, 13),
    updatedAt: makeDate(monday, 2, 9),
  },
  {
    id: 'WI-009',
    type: 'TRANSPORT',
    status: 'CREATED',
    title: 'Leverans av restaurangmöbler – Södermalm',
    description: 'Transport av bord och stolar till ny restaurang vid Medborgarplatsen.',
    reference: '240422',
    assignedToUserIds: [],
    scheduledDate: null,
    transport: {
      pickupAddress: 'Möbellager, Kungens Kurva',
      deliveryAddress: 'Medborgarplatsen 4, Stockholm',
      transportType: '',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 2, 10) },
    ],
    createdAt: makeDate(monday, 2, 10),
    updatedAt: makeDate(monday, 2, 10),
  },
  {
    id: 'WI-010',
    type: 'TRANSPORT',
    status: 'PLANNED',
    title: 'Hämtning av byggmaterial – Lidingö',
    description: 'Hämta pallar med byggmaterial från leverantör och kör till byggarbetsplats.',
    reference: '240509',
    assignedToUserIds: ['U3'],
    scheduledDate: makeDate(monday, 9, 8),         // Apr 22
    transport: {
      pickupAddress: 'Byggmax, Lidingö',
      deliveryAddress: 'Byggarbetsplats, Östermalm',
      transportType: 'Skåpbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 3, 8) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 3, 14), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, 3, 8),
    updatedAt: makeDate(monday, 3, 14),
  },
  {
    id: 'WI-011',
    type: 'TRANSPORT',
    status: 'PLANNED',
    title: 'Flytt av pianon – Musikskolan',
    description: 'Transport av tre konsertpianon till ny lokal efter renovering.',
    reference: '240611',
    assignedToUserIds: ['U1'],
    scheduledDate: makeDate(monday, 14, 11),       // Apr 27
    transport: {
      pickupAddress: 'Gamla lokalen, Vasastan',
      deliveryAddress: 'Musikskolan, Fridhemsplan',
      transportType: 'Specialtransport',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 4, 9) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 5, 10), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, 4, 9),
    updatedAt: makeDate(monday, 5, 10),
  },
  {
    id: 'WI-013',
    type: 'PICKUP',
    status: 'PLANNED',
    title: 'Upphämtning av kontorsmöbler – Nacka',
    description: 'Hämta begagnade skrivbord och stolar från företag som byter kontor.',
    reference: '240813',
    assignedToUserIds: ['U4'],
    scheduledDate: makeDate(monday, 3, 9),
    transport: {
      pickupAddress: 'Industrivägen 8, Nacka',
      deliveryAddress: 'Återbrukslager, Bromma',
      transportType: 'Lastbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 1, 10) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 1, 14), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, 1, 10),
    updatedAt: makeDate(monday, 1, 14),
  },
  {
    id: 'WI-014',
    type: 'PICKUP',
    status: 'PLANNED',
    title: 'Upphämtning av elektronik – Täby',
    description: 'Hämta upp kasserade datorer och skärmar för återvinning.',
    reference: '240914',
    assignedToUserIds: ['U2'],
    scheduledDate: makeDate(monday, 5, 11),
    transport: {
      pickupAddress: 'Täby centrum, Täby',
      deliveryAddress: 'Återvinningsstation, Sollentuna',
      transportType: 'Skåpbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 2, 9) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 2, 13), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, 2, 9),
    updatedAt: makeDate(monday, 2, 13),
  },
  {
    id: 'WI-012',
    type: 'PICKUP',
    status: 'CREATED',
    title: 'Returkörning av hyrmaskiner – Solna',
    description: 'Lämna tillbaka ställningar och verktyg till uthyrningsfirma efter avslutat projekt.',
    reference: '240731',
    assignedToUserIds: [],
    scheduledDate: null,
    transport: {
      pickupAddress: 'Byggarbetsplats, Solna strand',
      deliveryAddress: 'Hyrcenter, Järfälla',
      transportType: '',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 5, 15) },
    ],
    createdAt: makeDate(monday, 5, 15),
    updatedAt: makeDate(monday, 5, 15),
  },
]
