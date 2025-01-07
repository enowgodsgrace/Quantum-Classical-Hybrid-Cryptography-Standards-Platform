import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastTokenId = 0;
const tokenMetadata = new Map();
const tokenOwners = new Map();

// Simulated contract functions
function mint(name: string, description: string, algorithmId: number, certificationDate: number, minter: string) {
  if (minter !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const tokenId = ++lastTokenId;
  tokenMetadata.set(tokenId, { name, description, algorithmId, certificationDate });
  tokenOwners.set(tokenId, minter);
  return tokenId;
}

function transfer(tokenId: number, sender: string, recipient: string) {
  if (tokenOwners.get(tokenId) !== sender) throw new Error('Not authorized');
  tokenOwners.set(tokenId, recipient);
  return true;
}

describe('Certified Algorithm NFT Contract', () => {
  beforeEach(() => {
    lastTokenId = 0;
    tokenMetadata.clear();
    tokenOwners.clear();
  });
  
  it('should mint a new NFT', () => {
    const tokenId = mint('Quantum Resistant Algorithm', 'A certified quantum-resistant cryptographic algorithm', 1, Date.now(), 'CONTRACT_OWNER');
    expect(tokenId).toBe(1);
    expect(tokenOwners.get(tokenId)).toBe('CONTRACT_OWNER');
    const metadata = tokenMetadata.get(tokenId);
    expect(metadata.name).toBe('Quantum Resistant Algorithm');
    expect(metadata.algorithmId).toBe(1);
  });
  
  it('should transfer an NFT', () => {
    const tokenId = mint('Post-Quantum Cryptography', 'Another certified algorithm', 2, Date.now(), 'CONTRACT_OWNER');
    expect(transfer(tokenId, 'CONTRACT_OWNER', 'user1')).toBe(true);
    expect(tokenOwners.get(tokenId)).toBe('user1');
  });
  
  it('should not allow unauthorized minting', () => {
    expect(() => mint('Unauthorized Algorithm', 'This should fail', 3, Date.now(), 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow unauthorized transfer', () => {
    const tokenId = mint('Secure Algorithm', 'A securely owned algorithm', 4, Date.now(), 'CONTRACT_OWNER');
    expect(() => transfer(tokenId, 'unauthorized_user', 'user2')).toThrow('Not authorized');
  });
});
