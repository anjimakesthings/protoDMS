import type { WorkItem, User } from '../types'

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
    assignedToUserId: 'U1',
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
    type: 'GENERAL',
    status: 'PLANNED',
    title: 'Reparation av konferensrum – Plan 3',
    description: 'Åtgärda skador på vägg och byt ut skadade stolar.',
    reference: 'Se tidigare avtal 2024',
    assignedToUserId: 'U2',
    scheduledDate: makeDate(monday, 2, 9),         // Apr 15
    transport: undefined,
    actions: [
      { id: 'A1', text: 'Spackling av vägg', completed: true },
      { id: 'A2', text: 'Byta ut 4 skadade stolar', completed: false },
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
    assignedToUserId: 'U1',
    scheduledDate: makeDate(monday, 4, 10),        // Apr 17
    transport: {
      pickupAddress: 'Centralarkivet, Göteborg',
      deliveryAddress: 'Kommunhuset, Göteborg',
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
    type: 'GENERAL',
    status: 'CREATED',
    title: 'Inventering av förråd – Byggnad B',
    description: 'Genomför inventering och dokumentera befintligt material.',
    reference: null,
    assignedToUserId: null,
    scheduledDate: null,
    transport: undefined,
    actions: [
      { id: 'A3', text: 'Fotografera allt material', completed: false },
      { id: 'A4', text: 'Uppdatera inventarielista i systemet', completed: false },
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
    assignedToUserId: 'U3',
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
    id: 'WI-006',
    type: 'GENERAL',
    status: 'IN_PROGRESS',
    title: 'Installation av whiteboards – Mötesrum 2',
    description: 'Montera 3 st whiteboards och uppdatera belysning.',
    reference: null,
    assignedToUserId: 'U4',
    scheduledDate: makeDate(monday, 7, 11),       // Apr 20
    transport: undefined,
    actions: [
      { id: 'A5', text: 'Montera whiteboard 1', completed: true },
      { id: 'A6', text: 'Montera whiteboard 2', completed: true },
      { id: 'A7', text: 'Montera whiteboard 3', completed: false },
      { id: 'A8', text: 'Uppdatera belysning', completed: false },
    ],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, -1, 10) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 1, 16), detail: 'PLANNED' },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 7, 11), detail: 'IN_PROGRESS' },
    ],
    createdAt: makeDate(monday, -1, 10),
    updatedAt: makeDate(monday, 7, 11),
  },
  {
    id: 'WI-007',
    type: 'TRANSPORT',
    status: 'PLANNED',
    title: 'Flytt av IT-utrustning – Serverrum',
    description: 'Flytt och återinstallation av servers och nätverksutrustning.',
    reference: '24001122',
    assignedToUserId: 'U2',
    scheduledDate: makeDate(monday, 7, 14),        // Apr 20
    transport: {
      pickupAddress: 'Gamla serverrummet, Kv. 2',
      deliveryAddress: 'Nya serverrummet, Kv. 4',
      transportType: 'Specialtransport',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 0, 13) },
      { type: 'STATUS_CHANGED', timestamp: makeDate(monday, 1, 10), detail: 'PLANNED' },
    ],
    createdAt: makeDate(monday, 0, 13),
    updatedAt: makeDate(monday, 1, 10),
  },
  {
    id: 'WI-009',
    type: 'TRANSPORT',
    status: 'CREATED',
    title: 'Leverans av restaurangmöbler – Södermalm',
    description: 'Transport av bord och stolar till ny restaurang vid Medborgarplatsen.',
    reference: '240422',
    assignedToUserId: 'U4',
    scheduledDate: null,
    transport: {
      pickupAddress: 'Möbellager, Nacka',
      deliveryAddress: 'Medborgarplatsen 8, Stockholm',
      transportType: 'Lastbil',
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
    assignedToUserId: 'U3',
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
    assignedToUserId: 'U1',
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
    id: 'WI-012',
    type: 'TRANSPORT',
    status: 'CREATED',
    title: 'Returkörning av hyrmaskiner – Solna',
    description: 'Lämna tillbaka ställningar och verktyg till uthyrningsfirma efter avslutat projekt.',
    reference: null,
    assignedToUserId: 'U2',
    scheduledDate: null,
    transport: {
      pickupAddress: 'Projektplatsen, Sundbyberg',
      deliveryAddress: 'Hyrmaskiner AB, Solna',
      transportType: 'Lastbil',
    },
    actions: [],
    events: [
      { type: 'WORKITEM_CREATED', timestamp: makeDate(monday, 5, 15) },
    ],
    createdAt: makeDate(monday, 5, 15),
    updatedAt: makeDate(monday, 5, 15),
  },
]
