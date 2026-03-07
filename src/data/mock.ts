export type CredStatus = 'verified' | 'pending' | 'revoked' | 'expiring'

export interface Credential {
  id: string; title: string; issuer: string; issuerInitials: string
  status: CredStatus; issuedDate: string; expiryDate: string
  type: string; color: string; did: string; schemaId: string; proofType: string
  fields: { label: string; value: string; zkp?: boolean }[]
}

export interface Activity {
  id: string; type: 'received'|'shared'|'expiring'|'revoked'|'rotated'
  title: string; subtitle: string; timestamp: string
}

export interface ProofReq {
  id: string; verifier: string; verifierInitials: string; verifierColor: string
  fields: string[]; zkpFields: string[]; expiresIn: number; purpose: string
}

export const CREDENTIALS: Credential[] = [
  {
    id: 'c1', title: 'Bachelor of Technology', issuer: 'MIT — Massachusetts Institute of Technology',
    issuerInitials: 'MIT', status: 'verified', issuedDate: '2023-06-15', expiryDate: '2033-06-15',
    type: 'Education', color: '#00C2FF', did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx', schemaId: 'schema:edu:v2.1',
    proofType: 'BBS+ Signatures 2023',
    fields: [
      { label: 'Full Name', value: 'Aryan Mehta' },
      { label: 'Degree', value: 'Bachelor of Technology' },
      { label: 'Major', value: 'Computer Science' },
      { label: 'GPA', value: '3.92 / 4.0', zkp: true },
      { label: 'Student ID', value: 'MIT-2023-7841', zkp: true },
      { label: 'Graduation Date', value: 'June 15, 2023' },
    ]
  },
  {
    id: 'c2', title: 'Employment Verification', issuer: 'Google LLC — Human Resources',
    issuerInitials: 'G', status: 'verified', issuedDate: '2024-01-10', expiryDate: '2025-01-10',
    type: 'Employment', color: '#00FF88', did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx', schemaId: 'schema:emp:v1.3',
    proofType: 'AnonCreds 2023',
    fields: [
      { label: 'Employee Name', value: 'Aryan Mehta' },
      { label: 'Position', value: 'Senior Software Engineer' },
      { label: 'Department', value: 'Google Cloud Platform' },
      { label: 'Salary Band', value: 'L5 — Senior', zkp: true },
      { label: 'Start Date', value: 'January 10, 2024' },
      { label: 'Employee ID', value: 'GOOG-84921', zkp: true },
    ]
  },
  {
    id: 'c3', title: 'National Identity Card', issuer: 'Government of India — UIDAI',
    issuerInitials: 'IN', status: 'verified', issuedDate: '2022-03-01', expiryDate: '2032-03-01',
    type: 'Identity', color: '#7B2FFF', did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx', schemaId: 'schema:id:nat:v3',
    proofType: 'AnonCreds 2023',
    fields: [
      { label: 'Full Name', value: 'Aryan Mehta' },
      { label: 'Date of Birth', value: '—', zkp: true },
      { label: 'Gender', value: 'Male' },
      { label: 'Aadhaar No.', value: '•••• •••• ••••', zkp: true },
      { label: 'State', value: 'Punjab' },
    ]
  },
  {
    id: 'c4', title: 'Health Insurance Card', issuer: 'HDFC ERGO — Health Division',
    issuerInitials: 'HE', status: 'expiring', issuedDate: '2024-01-01', expiryDate: '2025-01-01',
    type: 'Health', color: '#F5A623', did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx', schemaId: 'schema:health:v1.1',
    proofType: 'BBS+ Signatures 2023',
    fields: [
      { label: 'Policy Holder', value: 'Aryan Mehta' },
      { label: 'Policy Number', value: '•••••••', zkp: true },
      { label: 'Coverage Type', value: 'Comprehensive' },
      { label: 'Sum Insured', value: '₹10,00,000', zkp: true },
      { label: 'Valid Until', value: 'January 01, 2025' },
    ]
  },
  {
    id: 'c5', title: 'Age Verification Token', issuer: 'Sovereign Trust Layer',
    issuerInitials: 'ST', status: 'verified', issuedDate: '2024-06-01', expiryDate: '2025-06-01',
    type: 'Verification', color: '#00C2FF', did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx', schemaId: 'schema:age:v2',
    proofType: 'ZKP Predicate',
    fields: [
      { label: 'Age Predicate', value: 'Age ≥ 18 ✓ Proven' },
      { label: 'Actual DOB', value: '—', zkp: true },
      { label: 'Issuing Authority', value: 'Sovereign Trust Layer' },
    ]
  },
]

export const ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'received', title: 'New credential received', subtitle: 'Employment Verification from Google LLC', timestamp: '2m ago' },
  { id: 'a2', type: 'shared',   title: 'Credential presented', subtitle: 'Degree proof shared with Stripe Inc.', timestamp: '1h ago' },
  { id: 'a3', type: 'received', title: 'Verification approved', subtitle: 'Age check for Netflix India', timestamp: '3h ago' },
  { id: 'a4', type: 'expiring', title: 'Credential expiring soon', subtitle: 'Health Insurance — 14 days left', timestamp: '6h ago' },
  { id: 'a5', type: 'shared',   title: 'KYC completed', subtitle: 'Identity verified for Zerodha', timestamp: 'Yesterday' },
  { id: 'a6', type: 'rotated',  title: 'DID keys rotated', subtitle: 'Signing keys rotated successfully', timestamp: '1w ago' },
]

export const PROOF_REQS: ProofReq[] = [
  {
    id: 'pr1', verifier: 'Stripe Inc.', verifierInitials: 'SI', verifierColor: '#635BFF',
    fields: ['Employment','Name'], zkpFields: ['Age ≥ 18'], expiresIn: 847,
    purpose: 'Developer account KYC verification'
  },
  {
    id: 'pr2', verifier: 'Apollo Hospitals', verifierInitials: 'AH', verifierColor: '#00C2FF',
    fields: ['Health Insurance'], zkpFields: ['Coverage ≥ ₹5L'], expiresIn: 312,
    purpose: 'Cashless admission pre-authorization'
  },
]

export const ISSUER_DATA = {
  totalIssued: 12847, revokedToday: 3, pendingDelivery: 24, activeTemplates: 7, health: 98.7,
  chart: Array.from({ length: 30 }, (_, i) => ({
    day: `D${i+1}`,
    issued: Math.floor(280 + Math.sin(i/4)*120 + Math.random()*80),
    revoked: Math.floor(Math.random()*8),
  })),
  recent: [
    { did: 'did:indy:7fK3mPq...', template: 'Degree Certificate', status: 'Delivered', time: '2m ago' },
    { did: 'did:indy:9aR1xNb...', template: 'Employment Record', status: 'Delivered', time: '8m ago' },
    { did: 'did:indy:2jW5vYc...', template: 'Health Insurance', status: 'Pending', time: '15m ago' },
    { did: 'did:indy:4kL8nQd...', template: 'Age Verification', status: 'Delivered', time: '22m ago' },
    { did: 'did:indy:6mX2oZe...', template: 'Degree Certificate', status: 'Failed', time: '1h ago' },
  ]
}

export const USER = {
  did: 'did:indy:Sobr7MFsF5YxNrHzxXpB1aKx9Qerty',
  name: 'Aryan Mehta',
  initials: 'AM',
  securityScore: 92,
  keyType: 'Ed25519',
  keyCreated: '2023-01-15',
  lastRotated: '2024-08-01',
}
