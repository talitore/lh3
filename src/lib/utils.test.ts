/**
 * Tests for utility functions
 */

import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class');
    expect(result).toBe('base-class additional-class');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should handle empty strings', () => {
    const result = cn('base-class', '', 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should merge Tailwind classes correctly', () => {
    // Test that conflicting Tailwind classes are properly merged (later classes override earlier ones)
    const result = cn('p-4 bg-red-500', 'p-2 bg-blue-500');
    expect(result).toBe('p-2 bg-blue-500');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'base-class': true,
      'conditional-class': true,
      'hidden-class': false,
    });
    expect(result).toBe('base-class conditional-class');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'btn',
      'btn-primary',
      {
        'btn-active': isActive,
        'btn-disabled': isDisabled,
      },
      isActive && 'active-state',
      'final-class'
    );
    expect(result).toBe('btn btn-primary btn-active active-state final-class');
  });

  it('should return empty string for no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle nested arrays and objects', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      {
        'obj1': true,
        'obj2': false,
      },
      [
        'nested-array',
        {
          'nested-obj': true,
        }
      ]
    );
    expect(result).toBe('base array1 array2 obj1 nested-array nested-obj');
  });
});
