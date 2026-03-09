
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('📁 Created data/ directory');
}

// ── 1. CREDENTIALS ────────────────────────────────────────────────────────────
const credentials = [
  {
    id: 'cred-001',
    type: 'Aadhaar Identity Card',
    issuer: 'UIDAI (Unique Identification Authority of India)',
    issuerLogo: '🇮🇳',
    holderName: 'Aarav Sharma',
    issueDate: '2020-08-15',
    expiryDate: '2030-08-15',
    status: 'verified',
    claims: [
      { label: 'Aadhaar Number', value: 'XXXX XXXX 7834', zkpCapable: false },
      { label: 'Full Name', value: 'Aarav Sharma' },
      { label: 'Date of Birth', value: '1996-04-12', zkpCapable: true },
      { label: 'Gender', value: 'Male' },
      { label: 'Address', value: '47, Lajpat Nagar II, New Delhi - 110024' },
      { label: 'Biometric Verified', value: 'Yes' },
      { label: 'VID', value: '9812 XXXX XXXX 3041', zkpCapable: false },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:UIDAI9k4mP2x3nQ7vLh1TzW5aK', schemaID: 'schema:government:aadhaar:v3.1', proofType: 'BbsBlsSignature2020' },
  },
  {
    id: 'cred-002',
    type: 'University Degree Certificate',
    issuer: 'Indian Institute of Technology, Delhi',
    issuerLogo: '🎓',
    holderName: 'Aarav Sharma',
    issueDate: '2023-07-22',
    expiryDate: '2053-07-22',
    status: 'verified',
    claims: [
      { label: 'Degree', value: 'Bachelor of Technology (B.Tech)' },
      { label: 'Specialisation', value: 'Computer Science & Engineering' },
      { label: 'CGPA', value: '8.74 / 10.0', zkpCapable: true },
      { label: 'Graduation Year', value: '2023' },
      { label: 'Roll Number', value: 'IIT-D-2019-CS-0342' },
      { label: 'Honours', value: 'Institute Silver Medal' },
      { label: 'Thesis Title', value: 'Privacy-Preserving ZKP for National Identity Systems' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:IITD8Ps2w3kJTHjqUDf8nK9nR7', schemaID: 'schema:degree:university:v1.4', proofType: 'BbsBlsSignature2020' },
  },
  {
    id: 'cred-003',
    type: 'Employment Verification',
    issuer: 'Infosys Limited',
    issuerLogo: '💼',
    holderName: 'Aarav Sharma',
    issueDate: '2023-08-07',
    status: 'verified',
    claims: [
      { label: 'Job Title', value: 'Associate Software Engineer' },
      { label: 'Employee ID', value: 'INF-BLR-2023-49821' },
      { label: 'Department', value: 'Digital Identity & Blockchain' },
      { label: 'Location', value: 'Bengaluru, Karnataka' },
      { label: 'Employment Type', value: 'Full-time' },
      { label: 'CTC Band', value: '₹10L – ₹14L per annum', zkpCapable: true },
      { label: 'Start Date', value: '07 August 2023' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:INFY9Qx4k2mLPv3rNh8TzYcW', schemaID: 'schema:employment:standard:v1.0', proofType: 'Ed25519Signature2020' },
  },
  {
    id: 'cred-004',
    type: 'Medical Registration Certificate',
    issuer: 'Medical Council of India (NMC)',
    issuerLogo: '⚕️',
    holderName: 'Dr. Priya Venkataraman',
    issueDate: '2015-03-18',
    expiryDate: '2026-03-18',
    status: 'expiring',
    claims: [
      { label: 'Registration No.', value: 'MCI-TN-2015-48763' },
      { label: 'Qualification', value: 'MBBS, MD (Internal Medicine)' },
      { label: 'Medical College', value: 'AIIMS New Delhi' },
      { label: 'Specialisation', value: 'Internal Medicine' },
      { label: 'State Council', value: 'Tamil Nadu Medical Council' },
      { label: 'Date of Birth', value: '1983-11-05', zkpCapable: true },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:NMC5BzCb3h8WxNJVnT3pYrKc9', schemaID: 'schema:license:medical:v2.1', proofType: 'Ed25519Signature2020' },
  },
  {
    id: 'cred-005',
    type: 'Driving Licence (mDL)',
    issuer: 'Parivahan Sewa, Ministry of Road Transport & Highways',
    issuerLogo: '🚗',
    holderName: 'Raju Bhatia',
    issueDate: '2019-06-10',
    expiryDate: '2039-06-10',
    status: 'verified',
    claims: [
      { label: 'DL Number', value: 'DL-0420190123456' },
      { label: 'Class', value: 'LMV, MCWG' },
      { label: 'RTO', value: 'Saket District, New Delhi' },
      { label: 'Date of Birth', value: '1964-09-30', zkpCapable: true },
      { label: 'Blood Group', value: 'B+' },
      { label: 'Valid To', value: '09 June 2039' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:PARA7Hy5n9xQm2vLpWk4RtBcJ', schemaID: 'schema:government:mDL:v2.0', proofType: 'BbsBlsSignature2020' },
  },
  {
    id: 'cred-006',
    type: 'PAN Card',
    issuer: 'Income Tax Department, Government of India',
    issuerLogo: '📄',
    holderName: 'Aarav Sharma',
    issueDate: '2014-11-20',
    status: 'verified',
    claims: [
      { label: 'PAN Number', value: 'ABCPS1234K', zkpCapable: false },
      { label: 'Full Name', value: 'AARAV SHARMA' },
      { label: "Father's Name", value: 'MOHAN SHARMA' },
      { label: 'Date of Birth', value: '1996-04-12', zkpCapable: true },
      { label: 'Category', value: 'Individual' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:ITD3Px8r5qMn4vTk2YwJsB7c1', schemaID: 'schema:government:pan:v1.0', proofType: 'Ed25519Signature2020' },
  },
  {
    id: 'cred-007',
    type: 'CBSE Class XII Marksheet',
    issuer: 'Central Board of Secondary Education (CBSE)',
    issuerLogo: '📚',
    holderName: 'Aarav Sharma',
    issueDate: '2014-06-01',
    status: 'verified',
    claims: [
      { label: 'Roll Number', value: '1234567' },
      { label: 'Year', value: '2014' },
      { label: 'Stream', value: 'Science (PCM + CS)' },
      { label: 'Percentage', value: '94.8%', zkpCapable: true },
      { label: 'Mathematics', value: '100/100' },
      { label: 'Computer Science', value: '99/100' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:CBSE4Lm9r6qPn3vTk7YwJsB8', schemaID: 'schema:education:cbse:v1.3', proofType: 'BbsBlsSignature2020' },
  },
  {
    id: 'cred-008',
    type: 'Health Insurance Card',
    issuer: 'HDFC ERGO Health Insurance',
    issuerLogo: '🏥',
    holderName: 'Aarav Sharma',
    issueDate: '2024-04-01',
    expiryDate: '2025-03-31',
    status: 'verified',
    claims: [
      { label: 'Policy Number', value: 'HDFC-HI-2024-109823' },
      { label: 'Plan Name', value: 'Optima Secure — Gold' },
      { label: 'Sum Insured', value: '₹10,00,000', zkpCapable: true },
      { label: 'Coverage Type', value: 'Individual' },
      { label: 'Network Hospitals', value: '10,000+ across India' },
      { label: 'Valid Until', value: '31 March 2025' },
    ],
    metadata: { issuerDID: 'did:indy:sovrin:HDFC6Kp2n4xQm5vLh3TzYcR', schemaID: 'schema:insurance:health:v2.0', proofType: 'Ed25519Signature2020' },
  },
];

// ── 2. DIDs ────────────────────────────────────────────────────────────────────
const dids = [
  {
    id: 'did:indy:sovrin:AaravSharma8Ps2k3nQ7vLh1TzW5',
    controller: 'Aarav Sharma',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-02-10T14:22:00Z',
    status: 'active',
    verificationMethod: [
      { id: 'did:indy:sovrin:AaravSharma8Ps2k3nQ7vLh1TzW5#keys-1', type: 'Ed25519VerificationKey2020', publicKeyMultibase: 'zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV' },
    ],
    service: [
      { id: 'did:indy:sovrin:AaravSharma8Ps2k3nQ7vLh1TzW5#didcomm', type: 'DIDCommMessaging', serviceEndpoint: 'https://mediator.sovereign.app/msg' },
    ],
    keyHistory: [
      { keyId: '#keys-0', rotatedAt: '2024-02-10T14:22:00Z', reason: 'Scheduled rotation' },
    ],
  },
  {
    id: 'did:indy:sovrin:PriyaVenkat5BzCb3h8WxNJVnT3p',
    controller: 'Dr. Priya Venkataraman',
    created: '2023-09-01T08:00:00Z',
    updated: '2023-09-01T08:00:00Z',
    status: 'active',
    verificationMethod: [
      { id: 'did:indy:sovrin:PriyaVenkat5BzCb3h8WxNJVnT3p#keys-1', type: 'Ed25519VerificationKey2020', publicKeyMultibase: 'z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp' },
    ],
    service: [],
    keyHistory: [],
  },
];

// ── 3. ISSUERS ─────────────────────────────────────────────────────────────────
const issuers = [
  {
    id: 'iss-001',
    name: 'Indian Institute of Technology, Delhi',
    shortName: 'IIT Delhi',
    did: 'did:indy:sovrin:IITD8Ps2w3kJTHjqUDf8nK9nR7',
    category: 'University',
    country: 'India',
    city: 'New Delhi',
    logo: '🎓',
    verified: true,
    onboardedAt: '2024-01-10T09:00:00Z',
    stats: { totalIssued: 18432, revokedToday: 3, pendingDelivery: 12, activeTemplates: 6, credentialHealth: 99.1 },
    templates: ['B.Tech Degree', 'M.Tech Degree', 'Ph.D Certificate', 'Student ID', 'Bonafide Certificate', 'Migration Certificate'],
    recentIssuances: [
      { id: 'iss-IITD-001', subjectDID: 'did:indy:sovrin:8Qx2k3mL...', template: 'B.Tech Degree', status: 'delivered', timestamp: '2026-03-07T09:15:00Z' },
      { id: 'iss-IITD-002', subjectDID: 'did:indy:sovrin:3Pr7n4xM...', template: 'Bonafide Certificate', status: 'delivered', timestamp: '2026-03-07T08:45:00Z' },
      { id: 'iss-IITD-003', subjectDID: 'did:indy:sovrin:9Ty5m8qN...', template: 'Migration Certificate', status: 'pending', timestamp: '2026-03-07T08:30:00Z' },
    ],
    bulkJobs: [
      { id: 'job-IITD-001', name: 'Batch 2024 Convocation Degrees', progress: 92, total: 1240, success: 1140, failed: 4, eta: '8 min', status: 'in_progress' },
    ],
    chartData: [
      { date: 'Jan 6', issued: 210, revoked: 2 }, { date: 'Jan 13', issued: 234, revoked: 1 },
      { date: 'Jan 20', issued: 198, revoked: 4 }, { date: 'Jan 27', issued: 267, revoked: 0 },
      { date: 'Feb 3', issued: 312, revoked: 3 }, { date: 'Feb 10', issued: 289, revoked: 2 },
      { date: 'Feb 17', issued: 340, revoked: 1 }, { date: 'Feb 24', issued: 401, revoked: 5 },
      { date: 'Mar 3', issued: 378, revoked: 3 },
    ],
  },
  {
    id: 'iss-002',
    name: 'UIDAI — Unique Identification Authority of India',
    shortName: 'UIDAI',
    did: 'did:indy:sovrin:UIDAI9k4mP2x3nQ7vLh1TzW5aK',
    category: 'Government',
    country: 'India',
    city: 'New Delhi',
    logo: '🇮🇳',
    verified: true,
    onboardedAt: '2023-11-01T09:00:00Z',
    stats: { totalIssued: 1247890, revokedToday: 2341, pendingDelivery: 8920, activeTemplates: 2, credentialHealth: 97.3 },
    templates: ['Aadhaar eKYC VC', 'Aadhaar Address Proof VC'],
    recentIssuances: [
      { id: 'iss-UID-001', subjectDID: 'did:indy:sovrin:4Kx9r2vP...', template: 'Aadhaar eKYC VC', status: 'delivered', timestamp: '2026-03-07T09:00:00Z' },
    ],
    bulkJobs: [
      { id: 'job-UIDAI-001', name: 'DigiLocker Migration — Q1 2026', progress: 45, total: 50000, success: 22500, failed: 120, eta: '3.2 hrs', status: 'in_progress' },
    ],
    chartData: [
      { date: 'Jan 6', issued: 12000, revoked: 340 }, { date: 'Jan 13', issued: 14500, revoked: 290 },
      { date: 'Jan 20', issued: 13200, revoked: 410 }, { date: 'Jan 27', issued: 15600, revoked: 380 },
      { date: 'Feb 3', issued: 16100, revoked: 320 }, { date: 'Feb 10', issued: 17400, revoked: 450 },
      { date: 'Feb 17', issued: 18900, revoked: 510 }, { date: 'Feb 24', issued: 20100, revoked: 480 },
      { date: 'Mar 3', issued: 21300, revoked: 520 },
    ],
  },
  {
    id: 'iss-003',
    name: 'Infosys Limited',
    shortName: 'Infosys',
    did: 'did:indy:sovrin:INFY9Qx4k2mLPv3rNh8TzYcW',
    category: 'Employer',
    country: 'India',
    city: 'Bengaluru',
    logo: '💼',
    verified: true,
    onboardedAt: '2024-02-20T09:00:00Z',
    stats: { totalIssued: 34500, revokedToday: 56, pendingDelivery: 234, activeTemplates: 5, credentialHealth: 96.8 },
    templates: ['Employment Verification', 'Experience Letter', 'Background Check Clearance', 'Training Certification', 'Access Badge'],
    recentIssuances: [
      { id: 'iss-INFY-001', subjectDID: 'did:indy:sovrin:7Lp3s6wQ...', template: 'Employment Verification', status: 'delivered', timestamp: '2026-03-07T08:00:00Z' },
      { id: 'iss-INFY-002', subjectDID: 'did:indy:sovrin:2Mx8t4yR...', template: 'Access Badge', status: 'failed', timestamp: '2026-03-07T07:45:00Z' },
    ],
    bulkJobs: [
      { id: 'job-INFY-001', name: 'FY2025 Annual Employment Refresh', progress: 67, total: 3400, success: 2278, failed: 8, eta: '45 min', status: 'in_progress' },
    ],
    chartData: [
      { date: 'Jan 6', issued: 280, revoked: 12 }, { date: 'Jan 13', issued: 310, revoked: 8 },
      { date: 'Jan 20', issued: 295, revoked: 15 }, { date: 'Jan 27', issued: 340, revoked: 6 },
      { date: 'Feb 3', issued: 390, revoked: 18 }, { date: 'Feb 10', issued: 425, revoked: 22 },
      { date: 'Feb 17', issued: 460, revoked: 14 }, { date: 'Feb 24', issued: 510, revoked: 19 },
      { date: 'Mar 3', issued: 490, revoked: 21 },
    ],
  },
];

// ── 4. ACTIVITIES ──────────────────────────────────────────────────────────────
const activities = [
  { id: 'act-001', type: 'received', title: 'New credential received', description: 'Health Insurance Card VC from HDFC ERGO Health Insurance', timestamp: '2026-03-07T09:15:00Z', actor: 'HDFC ERGO' },
  { id: 'act-002', type: 'shared', title: 'Credential shared via ZKP', description: 'IIT Delhi B.Tech Degree shared with Infosys HR Portal', timestamp: '2026-03-06T14:22:00Z', actor: 'Infosys HR' },
  { id: 'act-003', type: 'expiring', title: 'Credential expiring soon', description: 'Medical Registration Certificate expires in 18 days', timestamp: '2026-03-06T09:00:00Z', actor: 'System' },
  { id: 'act-004', type: 'shared', title: 'Age proof presented', description: 'ZKP predicate (Age ≥ 18) shared with BookMyShow — no DOB revealed', timestamp: '2026-03-05T19:45:00Z', actor: 'BookMyShow' },
  { id: 'act-005', type: 'received', title: 'Aadhaar eKYC VC received', description: 'Aadhaar Identity VC issued by UIDAI via DigiLocker', timestamp: '2026-03-04T11:15:00Z', actor: 'UIDAI' },
  { id: 'act-006', type: 'rotated', title: 'DID key rotation completed', description: 'Verification key #keys-0 rotated. New key #keys-1 active.', timestamp: '2026-03-03T16:30:00Z', actor: 'Self' },
  { id: 'act-007', type: 'shared', title: 'Selective disclosure — KYC', description: 'Name + DOB (ZKP age≥21) shared with HDFC Bank — 2 of 6 fields only', timestamp: '2026-03-02T10:12:00Z', actor: 'HDFC Bank' },
  { id: 'act-008', type: 'received', title: 'CBSE XII Marksheet VC received', description: 'Class XII marks VC issued via DigiLocker — CBSE Board', timestamp: '2026-03-01T13:40:00Z', actor: 'CBSE' },
  { id: 'act-009', type: 'shared', title: 'Employment proof shared', description: 'Employment VC (salary ZKP: CTC ≥ ₹8L) shared with SBI Home Loan', timestamp: '2026-02-28T15:00:00Z', actor: 'SBI' },
  { id: 'act-010', type: 'revoked', title: 'Old student ID revoked', description: 'IIT Delhi Student ID VC revoked after graduation', timestamp: '2026-02-25T08:30:00Z', actor: 'IIT Delhi' },
];

// ── 5. PROOF REQUESTS ──────────────────────────────────────────────────────────
const proofRequests = [
  {
    id: 'req-001',
    verifierName: 'Infosys HR Onboarding Portal',
    verifierLogo: '💼',
    verifierDID: 'did:indy:sovrin:INFYverifier9Qx4k2mLPv3r',
    requestedFields: [
      { field: 'Degree', zkpPredicate: null },
      { field: 'Specialisation', zkpPredicate: null },
      { field: 'CGPA', zkpPredicate: 'CGPA ≥ 7.0' },
      { field: 'Graduation Year', zkpPredicate: null },
    ],
    purpose: 'Employee background verification for offer letter processing',
    expiresAt: '2026-03-08T18:00:00Z',
    createdAt: '2026-03-07T10:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-002',
    verifierName: 'HDFC Bank — Digital KYC',
    verifierLogo: '🏦',
    verifierDID: 'did:indy:sovrin:HDFCbank4Kp2n4xQm5vLh3T',
    requestedFields: [
      { field: 'Full Name', zkpPredicate: null },
      { field: 'Date of Birth', zkpPredicate: 'Age ≥ 21' },
      { field: 'Address', zkpPredicate: null },
      { field: 'PAN Number', zkpPredicate: null },
    ],
    purpose: 'Savings account opening — RBI KYC compliance',
    expiresAt: '2026-03-08T23:59:00Z',
    createdAt: '2026-03-07T08:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-003',
    verifierName: 'Ola Cabs — Driver Verification',
    verifierLogo: '🚗',
    verifierDID: 'did:indy:sovrin:OLAverify5Hy5n9xQm2vLpWk',
    requestedFields: [
      { field: 'DL Number', zkpPredicate: null },
      { field: 'DL Class', zkpPredicate: null },
      { field: 'Date of Birth', zkpPredicate: 'Age ≥ 18' },
    ],
    purpose: 'Driver onboarding — Transport Aggregator compliance',
    expiresAt: '2026-03-09T12:00:00Z',
    createdAt: '2026-03-07T07:30:00Z',
    status: 'pending',
  },
];

// ── 6. WRITE ALL FILES  (fs.writeFileSync — Lecture 5-8) ──────────────────────
const writeJSON = (filename, data) => {
  const fp = path.join(DATA_DIR, filename);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅  ${fp}  (${Array.isArray(data) ? data.length : 1} record${Array.isArray(data) && data.length !== 1 ? 's' : ''})`);
};

writeJSON('credentials.json', credentials);
writeJSON('dids.json', dids);
writeJSON('issuers.json', issuers);
writeJSON('activities.json', activities);
writeJSON('proof-requests.json', proofRequests);

const kpiData = {
  totalCredentials: credentials.length,
  totalCredentialsTrend: 8.3,
  activeVerifications: 23,
  activeVerificationsTrend: 12.5,
  credentialsExpiring: credentials.filter(c => c.status === 'expiring').length,
  credentialsExpiringTrend: -25.0,
  securityScore: 91,
  userDID: dids[0].id,
  userName: 'Aarav Sharma',
};
writeJSON('kpi.json', kpiData);

console.log('\n🎉  Mock dataset seeded! Run:  node server.js');
