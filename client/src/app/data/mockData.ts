export interface Credential {
  id: string;
  type: string;
  issuer: string;
  issuerLogo?: string;
  holderName: string;
  issueDate: string;
  expiryDate?: string;
  status: 'verified' | 'pending' | 'revoked' | 'expiring';
  claims: {
    label: string;
    value: string;
    zkpCapable?: boolean;
  }[];
  metadata: {
    issuerDID: string;
    schemaID: string;
    proofType: string;
  };
}

export interface Activity {
  id: string;
  type: 'received' | 'shared' | 'expiring' | 'revoked' | 'rotated';
  title: string;
  description: string;
  timestamp: string;
}

export interface ProofRequest {
  id: string;
  verifierName: string;
  verifierLogo?: string;
  requestedFields: {
    field: string;
    zkpPredicate?: string;
  }[];
  expiresAt: string;
  createdAt: string;
}

export const mockCredentials: Credential[] = [
  {
    id: 'cred-001',
    type: 'University Degree',
    issuer: 'Stanford University',
    issuerLogo: '🎓',
    holderName: 'Alex Chen',
    issueDate: '2024-05-15',
    expiryDate: '2034-05-15',
    status: 'verified',
    claims: [
      { label: 'Degree Type', value: 'Master of Science' },
      { label: 'Major', value: 'Computer Science' },
      { label: 'GPA', value: '3.89', zkpCapable: true },
      { label: 'Graduation Date', value: 'May 2024' },
      { label: 'Student ID', value: 'STF-982634' },
      { label: 'Honors', value: 'Cum Laude' },
      { label: 'Thesis Title', value: 'Zero-Knowledge Proofs in Decentralized Identity Systems' },
    ],
    metadata: {
      issuerDID: 'did:indy:sovrin:8Ps2w3kJTHjqUDf8nK9nR7',
      schemaID: 'schema:degree:university:v1.4',
      proofType: 'BbsBlsSignature2020',
    },
  },
  {
    id: 'cred-002',
    type: 'Professional License',
    issuer: 'California Medical Board',
    issuerLogo: '⚕️',
    holderName: 'Alex Chen',
    issueDate: '2023-08-20',
    expiryDate: '2025-08-20',
    status: 'expiring',
    claims: [
      { label: 'License Type', value: 'Medical Doctor' },
      { label: 'License Number', value: 'CA-MD-456789' },
      { label: 'Specialization', value: 'Internal Medicine' },
      { label: 'Issue Date', value: 'August 20, 2023' },
      { label: 'Expiry Date', value: 'August 20, 2025' },
      { label: 'Board Certified', value: 'Yes' },
    ],
    metadata: {
      issuerDID: 'did:indy:sovrin:5BzCb3h8WxNJVnT3pYrKc9',
      schemaID: 'schema:license:medical:v2.1',
      proofType: 'Ed25519Signature2020',
    },
  },
  {
    id: 'cred-003',
    type: 'Employment Verification',
    issuer: 'Tech Innovations Inc',
    issuerLogo: '💼',
    holderName: 'Alex Chen',
    issueDate: '2024-01-10',
    status: 'verified',
    claims: [
      { label: 'Job Title', value: 'Senior Software Engineer' },
      { label: 'Department', value: 'Blockchain R&D' },
      { label: 'Start Date', value: 'January 10, 2024' },
      { label: 'Employment Type', value: 'Full-time' },
      { label: 'Salary Range', value: '$150k - $180k', zkpCapable: true },
      { label: 'Employee ID', value: 'TI-2024-0156' },
    ],
    metadata: {
      issuerDID: 'did:indy:sovrin:9Qx4k2mLPv3rNh8TzYcW1s',
      schemaID: 'schema:employment:standard:v1.0',
      proofType: 'EcdsaSecp256k1Signature2019',
    },
  },
  {
    id: 'cred-004',
    type: 'Government ID',
    issuer: 'Department of Motor Vehicles',
    issuerLogo: '🪪',
    holderName: 'Alex Chen',
    issueDate: '2022-03-14',
    expiryDate: '2027-03-14',
    status: 'verified',
    claims: [
      { label: 'ID Type', value: "Driver's License" },
      { label: 'License Number', value: 'D1234567' },
      { label: 'Date of Birth', value: '1995-06-22', zkpCapable: true },
      { label: 'Address', value: '123 Main St, San Francisco, CA 94102' },
      { label: 'Issue Date', value: 'March 14, 2022' },
      { label: 'Expiry Date', value: 'March 14, 2027' },
    ],
    metadata: {
      issuerDID: 'did:indy:sovrin:7Hy5n9xQm2vLpWk4RtBcJ6',
      schemaID: 'schema:government:id:v3.2',
      proofType: 'BbsBlsSignature2020',
    },
  },
  {
    id: 'cred-005',
    type: 'Membership Card',
    issuer: 'Global Blockchain Consortium',
    issuerLogo: '🌐',
    holderName: 'Alex Chen',
    issueDate: '2023-11-01',
    expiryDate: '2024-11-01',
    status: 'expiring',
    claims: [
      { label: 'Membership Level', value: 'Gold' },
      { label: 'Member Since', value: 'November 2023' },
      { label: 'Member ID', value: 'GBC-2023-4892' },
      { label: 'Benefits', value: 'Conference Access, Voting Rights' },
    ],
    metadata: {
      issuerDID: 'did:indy:sovrin:3Px8r5qMn4vTk2YwJsB7c1',
      schemaID: 'schema:membership:professional:v1.2',
      proofType: 'Ed25519Signature2020',
    },
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'received',
    title: 'New credential received',
    description: 'Employment Verification from Tech Innovations Inc',
    timestamp: '2024-03-07T08:30:00Z',
  },
  {
    id: 'act-002',
    type: 'shared',
    title: 'Credential shared',
    description: 'University Degree shared with LinkedIn Verifier',
    timestamp: '2024-03-06T14:22:00Z',
  },
  {
    id: 'act-003',
    type: 'expiring',
    title: 'Credential expiring soon',
    description: 'Professional License expires in 14 days',
    timestamp: '2024-03-06T09:00:00Z',
  },
  {
    id: 'act-004',
    type: 'shared',
    title: 'Proof presented',
    description: 'Age verification (>21) shared with Event Organizer',
    timestamp: '2024-03-05T19:45:00Z',
  },
  {
    id: 'act-005',
    type: 'received',
    title: 'Credential updated',
    description: 'Membership Card renewed by Global Blockchain Consortium',
    timestamp: '2024-03-04T11:15:00Z',
  },
  {
    id: 'act-006',
    type: 'rotated',
    title: 'Key rotation completed',
    description: 'DID verification method updated successfully',
    timestamp: '2024-03-03T16:30:00Z',
  },
  {
    id: 'act-007',
    type: 'shared',
    title: 'Selective disclosure used',
    description: '3 of 7 fields shared with Background Check Service',
    timestamp: '2024-03-02T10:12:00Z',
  },
  {
    id: 'act-008',
    type: 'received',
    title: 'New credential received',
    description: 'Government ID from Department of Motor Vehicles',
    timestamp: '2024-03-01T13:40:00Z',
  },
];

export const mockProofRequests: ProofRequest[] = [
  {
    id: 'req-001',
    verifierName: 'LinkedIn Credential Verification',
    verifierLogo: '💼',
    requestedFields: [
      { field: 'Degree Type' },
      { field: 'University' },
      { field: 'Graduation Date' },
      { field: 'GPA', zkpPredicate: 'GPA ≥ 3.5' },
    ],
    expiresAt: '2024-03-07T18:00:00Z',
    createdAt: '2024-03-07T10:00:00Z',
  },
  {
    id: 'req-002',
    verifierName: 'Conference Registration Portal',
    verifierLogo: '🎫',
    requestedFields: [
      { field: 'Age', zkpPredicate: 'Age ≥ 18' },
      { field: 'Professional License' },
    ],
    expiresAt: '2024-03-07T23:59:00Z',
    createdAt: '2024-03-07T09:30:00Z',
  },
  {
    id: 'req-003',
    verifierName: 'Bank of America - KYC',
    verifierLogo: '🏦',
    requestedFields: [
      { field: 'Full Name' },
      { field: 'Date of Birth', zkpPredicate: 'Age ≥ 21' },
      { field: 'Address' },
      { field: 'Government ID' },
    ],
    expiresAt: '2024-03-08T12:00:00Z',
    createdAt: '2024-03-07T08:00:00Z',
  },
];

export const userDID = 'did:indy:sovrin:Sobr8k4mP9x2nQ5vLh3TzW1aKx';

export const mockKPIData = {
  totalCredentials: 12,
  totalCredentialsTrend: 8.3,
  activeVerifications: 23,
  activeVerificationsTrend: 12.5,
  credentialsExpiring: 2,
  credentialsExpiringTrend: -25.0,
  securityScore: 87,
};

export const mockIssuanceData = {
  totalIssued: 3456,
  revokedToday: 12,
  pendingDelivery: 45,
  activeTemplates: 8,
  credentialHealth: 94.2,
  chartData: [
    { date: 'Feb 5', issued: 98, revoked: 2 },
    { date: 'Feb 12', issued: 112, revoked: 5 },
    { date: 'Feb 19', issued: 125, revoked: 3 },
    { date: 'Feb 26', issued: 134, revoked: 8 },
    { date: 'Mar 4', issued: 145, revoked: 4 },
  ],
  recentIssuances: [
    {
      id: 'iss-001',
      subjectDID: 'did:indy:sovrin:8Qx2k3mL...',
      template: 'Employee Badge',
      status: 'delivered',
      timestamp: '2024-03-07T09:15:00Z',
    },
    {
      id: 'iss-002',
      subjectDID: 'did:indy:sovrin:3Pr7n4xM...',
      template: 'Security Clearance',
      status: 'pending',
      timestamp: '2024-03-07T08:45:00Z',
    },
    {
      id: 'iss-003',
      subjectDID: 'did:indy:sovrin:9Ty5m8qN...',
      template: 'Access Pass',
      status: 'delivered',
      timestamp: '2024-03-07T08:30:00Z',
    },
    {
      id: 'iss-004',
      subjectDID: 'did:indy:sovrin:4Kx9r2vP...',
      template: 'Training Certificate',
      status: 'delivered',
      timestamp: '2024-03-07T08:00:00Z',
    },
    {
      id: 'iss-005',
      subjectDID: 'did:indy:sovrin:7Lp3s6wQ...',
      template: 'Employee Badge',
      status: 'failed',
      timestamp: '2024-03-07T07:45:00Z',
    },
  ],
  bulkJobs: [
    {
      id: 'job-001',
      name: 'Q1 2024 Employee Onboarding',
      progress: 78,
      total: 250,
      success: 195,
      failed: 0,
      eta: '45 min',
    },
    {
      id: 'job-002',
      name: 'Annual Compliance Recertification',
      progress: 34,
      total: 1200,
      success: 408,
      failed: 2,
      eta: '3.5 hrs',
    },
  ],
};
