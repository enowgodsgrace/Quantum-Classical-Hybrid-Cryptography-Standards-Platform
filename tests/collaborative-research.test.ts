import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let projectCount = 0;
const researchProjects = new Map();
const projectContributions = new Map();

// Simulated contract functions
function createProject(title: string, description: string, creator: string) {
  const projectId = ++projectCount;
  researchProjects.set(projectId, {
    title,
    description,
    leadResearcher: creator,
    collaborators: [creator],
    status: 'active'
  });
  return projectId;
}

function addCollaborator(projectId: number, collaborator: string, adder: string) {
  const project = researchProjects.get(projectId);
  if (!project) throw new Error('Invalid project');
  if (project.leadResearcher !== adder) throw new Error('Not authorized');
  if (project.collaborators.length >= 20) throw new Error('Maximum collaborators reached');
  project.collaborators.push(collaborator);
  researchProjects.set(projectId, project);
  return true;
}

function addContribution(projectId: number, contribution: string, contributor: string) {
  const project = researchProjects.get(projectId);
  if (!project) throw new Error('Invalid project');
  if (!project.collaborators.includes(contributor)) throw new Error('Not authorized');
  const contributionKey = `${projectId}-${contributor}`;
  projectContributions.set(contributionKey, {
    contribution,
    timestamp: Date.now()
  });
  return true;
}

describe('Collaborative Research Platform Contract', () => {
  beforeEach(() => {
    projectCount = 0;
    researchProjects.clear();
    projectContributions.clear();
  });
  
  it('should create a new research project', () => {
    const projectId = createProject('Quantum-Resistant Signatures', 'Research on post-quantum digital signatures', 'researcher1');
    expect(projectId).toBe(1);
    const project = researchProjects.get(projectId);
    expect(project.title).toBe('Quantum-Resistant Signatures');
    expect(project.collaborators).toContain('researcher1');
  });
  
  it('should add a collaborator to the project', () => {
    const projectId = createProject('Lattice-Based Cryptography', 'Exploring lattice-based post-quantum schemes', 'researcher2');
    expect(addCollaborator(projectId, 'researcher3', 'researcher2')).toBe(true);
    const project = researchProjects.get(projectId);
    expect(project.collaborators).toContain('researcher3');
  });
  
  it('should add a contribution to the project', () => {
    const projectId = createProject('Quantum Key Distribution', 'Advancements in QKD protocols', 'researcher4');
    addCollaborator(projectId, 'researcher5', 'researcher4');
    expect(addContribution(projectId, 'Implemented new QKD protocol simulation', 'researcher5')).toBe(true);
    const contributionKey = `${projectId}-researcher5`;
    const contribution = projectContributions.get(contributionKey);
    expect(contribution.contribution).toBe('Implemented new QKD protocol simulation');
  });
  
  it('should not allow unauthorized collaborator addition', () => {
    const projectId = createProject('Post-Quantum Cryptanalysis', 'Analyzing the security of post-quantum schemes', 'researcher6');
    expect(() => addCollaborator(projectId, 'researcher7', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow contributions from non-collaborators', () => {
    const projectId = createProject('Quantum-Safe Blockchain', 'Developing quantum-resistant blockchain protocols', 'researcher8');
    expect(() => addContribution(projectId, 'Unauthorized contribution', 'non_collaborator')).toThrow('Not authorized');
  });
  
  it('should handle multiple collaborators and contributions', () => {
    const projectId = createProject('Hybrid Quantum-Classical Cryptography', 'Combining quantum and classical techniques', 'researcher9');
    addCollaborator(projectId, 'researcher10', 'researcher9');
    addCollaborator(projectId, 'researcher11', 'researcher9');
    addContribution(projectId, 'Quantum part of hybrid scheme', 'researcher10');
    addContribution(projectId, 'Classical part of hybrid scheme', 'researcher11');
    const project = researchProjects.get(projectId);
    expect(project.collaborators.length).toBe(3);
    expect(projectContributions.size).toBe(2);
  });
});

