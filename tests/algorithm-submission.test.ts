import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let algorithmCount = 0;
const algorithms = new Map();

// Simulated contract functions
function submitAlgorithm(name: string, description: string, implementation: string, submitter: string) {
  const algorithmId = ++algorithmCount;
  algorithms.set(algorithmId, {
    submitter,
    name,
    description,
    implementation,
    status: 'pending',
    certificationDate: null
  });
  return algorithmId;
}

function certifyAlgorithm(algorithmId: number, certifier: string) {
  const algorithm = algorithms.get(algorithmId);
  if (!algorithm) throw new Error('Invalid algorithm');
  if (certifier !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  algorithm.status = 'certified';
  algorithm.certificationDate = Date.now();
  algorithms.set(algorithmId, algorithm);
  return true;
}

function revokeCertification(algorithmId: number, revoker: string) {
  const algorithm = algorithms.get(algorithmId);
  if (!algorithm) throw new Error('Invalid algorithm');
  if (revoker !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  algorithm.status = 'revoked';
  algorithm.certificationDate = null;
  algorithms.set(algorithmId, algorithm);
  return true;
}

describe('Algorithm Submission and Certification Contract', () => {
  beforeEach(() => {
    algorithmCount = 0;
    algorithms.clear();
  });
  
  it('should submit a new algorithm', () => {
    const algorithmId = submitAlgorithm('Test Algorithm', 'A test cryptographic algorithm', 'function test() {}', 'user1');
    expect(algorithmId).toBe(1);
    expect(algorithms.size).toBe(1);
    const algorithm = algorithms.get(algorithmId);
    expect(algorithm.name).toBe('Test Algorithm');
    expect(algorithm.status).toBe('pending');
  });
  
  it('should certify an algorithm', () => {
    const algorithmId = submitAlgorithm('Certifiable Algorithm', 'An algorithm ready for certification', 'function secure() {}', 'user2');
    expect(certifyAlgorithm(algorithmId, 'CONTRACT_OWNER')).toBe(true);
    const algorithm = algorithms.get(algorithmId);
    expect(algorithm.status).toBe('certified');
    expect(algorithm.certificationDate).not.toBeNull();
  });
  
  it('should revoke certification', () => {
    const algorithmId = submitAlgorithm('Revocable Algorithm', 'An algorithm to be revoked', 'function revoke() {}', 'user3');
    certifyAlgorithm(algorithmId, 'CONTRACT_OWNER');
    expect(revokeCertification(algorithmId, 'CONTRACT_OWNER')).toBe(true);
    const algorithm = algorithms.get(algorithmId);
    expect(algorithm.status).toBe('revoked');
    expect(algorithm.certificationDate).toBeNull();
  });
  
  it('should not allow unauthorized certification', () => {
    const algorithmId = submitAlgorithm('Unauthorized Algorithm', 'An algorithm for unauthorized test', 'function unauthorized() {}', 'user4');
    expect(() => certifyAlgorithm(algorithmId, 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow unauthorized revocation', () => {
    const algorithmId = submitAlgorithm('Secure Algorithm', 'An algorithm for unauthorized revocation test', 'function secure() {}', 'user5');
    certifyAlgorithm(algorithmId, 'CONTRACT_OWNER');
    expect(() => revokeCertification(algorithmId, 'unauthorized_user')).toThrow('Not authorized');
  });
});

