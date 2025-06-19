import { OrganizationMapper } from '../mappers/organization.mapper';
import { Organization } from '../entities/organization.entity';

describe('OrganizationMapper - Basic Tests', () => {
  const mockOrganization: Organization = {
    id: 'org-uuid-1',
    name: 'Test Organization',
    description: 'Test Description',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    organizationOwners: [],
    constructor: jest.fn(),
  } as any;

  describe('toResponse', () => {
    it('should transform Organization entity to response format', () => {
      const result = OrganizationMapper.toResponse(mockOrganization);

      expect(result).toEqual({
        id: 'org-uuid-1',
        name: 'Test Organization',
        description: 'Test Description',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });

    it('should not include organizationOwners in basic response', () => {
      const result = OrganizationMapper.toResponse(mockOrganization);
      expect(result).not.toHaveProperty('organizationOwners');
      expect(result).not.toHaveProperty('owners');
    });
  });

  describe('toResponseArray', () => {
    it('should transform array of organizations', () => {
      const mockOrg2 = { ...mockOrganization, id: 'org-uuid-2', name: 'Second Org' };
      const organizations = [mockOrganization, mockOrg2];
      
      const result = OrganizationMapper.toResponseArray(organizations);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('org-uuid-1');
      expect(result[1].id).toBe('org-uuid-2');
    });
  });

  describe('toPaginatedResponse', () => {
    it('should transform paginated result correctly', () => {
      const paginatedOrgs = {
        data: [mockOrganization],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const result = OrganizationMapper.toPaginatedResponse(paginatedOrgs);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('toDeleteResponse', () => {
    it('should return default delete message', () => {
      const result = OrganizationMapper.toDeleteResponse();

      expect(result).toEqual({
        message: 'Organización eliminada exitosamente',
      });
    });

    it('should return custom delete message', () => {
      const customMessage = 'Custom delete message';
      const result = OrganizationMapper.toDeleteResponse(customMessage);

      expect(result).toEqual({
        message: customMessage,
      });
    });
  });
}); 