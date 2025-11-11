/**
 * Basic tests for storage utility
 * These tests verify the localStorage wrapper functions work correctly
 */

import { storage } from '../../utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should set and get item', () => {
    const testData = { name: 'Test', value: 123 };
    storage.set('test-key', testData);
    const result = storage.get<typeof testData>('test-key');
    
    expect(result).toEqual(testData);
  });

  test('should return null for non-existent key', () => {
    const result = storage.get('non-existent');
    expect(result).toBeNull();
  });

  test('should remove item', () => {
    storage.set('test-key', { data: 'test' });
    storage.remove('test-key');
    const result = storage.get('test-key');
    
    expect(result).toBeNull();
  });

  test('should clear all items', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    
    expect(storage.get('key1')).toBeNull();
    expect(storage.get('key2')).toBeNull();
  });
});
