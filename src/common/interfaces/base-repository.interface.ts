export interface BaseRepositoryInterface<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(conditions: Partial<T>): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(conditions?: Partial<T>): Promise<number>;
  exists(conditions: Partial<T>): Promise<boolean>;
} 