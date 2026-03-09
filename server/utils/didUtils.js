
const { v4: uuidv4 } = require('uuid');
const { DID_METHOD }  = require('../config');

// ─── GENERATE DID ─────────────────────────────────────────────────────────────
// A DID looks like: did:indy:z6MkhaXgBZDovsmznQ5YRen
// Format: did:<method>:<unique-identifier>
function generateDID(method = DID_METHOD) {
  // Generate a URL-safe base58-like identifier from UUID
  const raw = uuidv4().replace(/-/g, '');          // remove hyphens
  const b58 = Buffer.from(raw, 'hex').toString('base64url').slice(0, 22);
  return `did:${method}:${b58}`;
}

// ─── BUILD DID DOCUMENT ───────────────────────────────────────────────────────
// A DID Document is a JSON-LD document published to the ledger.
// It lists the public keys and service endpoints for a DID.
function buildDIDDocument(did) {
  const keyId = `${did}#key-1`;
  const keyAgreementId = `${did}#key-2`;

  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
    id: did,
    verificationMethod: [
      {
        id: keyId,
        type: 'Ed25519VerificationKey2020',
        controller: did,
        publicKeyMultibase: 'z' + Buffer.from(uuidv4().replace(/-/g, ''), 'hex').toString('base64url'),
      },
    ],
    authentication: [keyId],
    assertionMethod: [keyId],
    keyAgreement: [keyAgreementId],
    service: [
      {
        id: `${did}#sovereign-wallet`,
        type: 'SovereignWalletService',
        serviceEndpoint: 'https://sovereign.app/wallet',
      },
    ],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
}

// ─── ISSUE VERIFIABLE CREDENTIAL ──────────────────────────────────────────────
// Returns a W3C Verifiable Credential structure
function issueCredential({ issuerDID, holderDID, type, claims }) {
  const credentialId = `urn:uuid:${uuidv4()}`;
  const now = new Date();
  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + 10);

  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://sovereign.app/contexts/v1',
    ],
    id: credentialId,
    type: ['VerifiableCredential', type],
    issuer: issuerDID,
    issuanceDate: now.toISOString(),
    expirationDate: expiry.toISOString(),
    credentialSubject: {
      id: holderDID,
      ...claims,
    },
    proof: {
      type: 'BbsBlsSignature2020',
      created: now.toISOString(),
      verificationMethod: `${issuerDID}#key-1`,
      proofPurpose: 'assertionMethod',
      proofValue: 'simulated-bbs-proof-' + Buffer.from(credentialId).toString('base64url').slice(0, 32),
    },
  };
}

// ─── GENERATE ZKP PROOF ───────────────────────────────────────────────────────
// Simulates a Zero-Knowledge Proof response for selective disclosure
// Real implementation uses BBS+ (Hyperledger AnonCreds)
function generateZKPProof({ credentialId, revealedFields, predicates }) {
  return {
    proofId: `zkp-${uuidv4()}`,
    credentialId,
    proofType: 'AnonCreds',
    revealedAttributes: revealedFields || [],
    predicates: predicates || [],
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
    proofValue: 'simulated-zkp-' + Buffer.from(credentialId + Date.now()).toString('base64url').slice(0, 64),
    verified: true,
    note: 'In production: uses BBS+ Signatures (Hyperledger AnonCreds library)',
  };
}

// ─── VERIFY DID FORMAT ────────────────────────────────────────────────────────
function isValidDID(did) {
  return typeof did === 'string' && /^did:[a-z]+:[a-zA-Z0-9._-]+$/.test(did);
}

// ─── MODULE EXPORT ────────────────────────────────────────────────────────────
module.exports = {
  generateDID,
  buildDIDDocument,
  issueCredential,
  generateZKPProof,
  isValidDID,
};
