import { getPaginationOptions, createPaginatedResult } from '../src/utils/pagination';

describe('Pagination Utils', () => {
  describe('getPaginationOptions', () => {
    it('should return default values', () => {
      const result = getPaginationOptions({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should parse query values', () => {
      const result = getPaginationOptions({ page: '3', limit: '50' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(50);
    });

    it('should enforce minimum values', () => {
      const result = getPaginationOptions({ page: '0', limit: '0' });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
    });

    it('should enforce maximum limit', () => {
      const result = getPaginationOptions({ limit: '500' });
      expect(result.limit).toBe(100);
    });
  });

  describe('createPaginatedResult', () => {
    it('should create paginated result', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = createPaginatedResult(data, 100, { page: 2, limit: 2 });
      expect(result.data).toEqual(data);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.total).toBe(100);
      expect(result.pagination.totalPages).toBe(50);
    });
  });
});
