/**
 * AuthContext Tests
 * 
 * Note: These are example tests to verify the context implementation.
 * Run with: npm test -- AuthContext.test.tsx
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { LoginDTO } from '../../types/user';

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide initial unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const credentials: LoginDTO = {
      email: 'customer@pdiddy.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(credentials.email);
  });

  it('should identify admin user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const adminCredentials: LoginDTO = {
      email: 'admin@pdiddy.com',
      password: 'admin123',
    };

    await act(async () => {
      await result.current.login(adminCredentials);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user?.role).toBe('admin');
  });

  it('should logout user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Login first
    await act(async () => {
      await result.current.login({
        email: 'customer@pdiddy.com',
        password: 'password123',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should update user profile', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Login first
    await act(async () => {
      await result.current.login({
        email: 'customer@pdiddy.com',
        password: 'password123',
      });
    });

    const updatedData = {
      name: 'Updated Name',
      phone: '11999999999',
    };

    await act(async () => {
      await result.current.updateProfile(updatedData);
    });

    expect(result.current.user?.name).toBe(updatedData.name);
    expect(result.current.user?.phone).toBe(updatedData.phone);
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const invalidCredentials: LoginDTO = {
      email: 'nonexistent@pdiddy.com',
      password: 'wrongpassword',
    };

    await expect(async () => {
      await act(async () => {
        await result.current.login(invalidCredentials);
      });
    }).rejects.toThrow();

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
function expect(isAuthenticated: any) {
    throw new Error('Function not implemented.');
}

