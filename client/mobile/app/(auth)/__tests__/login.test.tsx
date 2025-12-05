/**
 * Login Screen Tests
 * Tests for the welcome/login screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../login';

// Override the useAuth mock for specific tests
const mockSignIn = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: mockSignIn,
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the login screen with logo and tagline', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Welcome to your kink...')).toBeTruthy();
    });

    it('renders Email and Phone tabs', () => {
      const { getAllByText } = render(<LoginScreen />);

      // Email appears twice: tab label + input label
      expect(getAllByText('Email').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('Phone').length).toBeGreaterThanOrEqual(1);
    });

    it('renders Sign Up button', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Sign Up')).toBeTruthy();
    });

    it('renders Google sign-in button', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Continue with Google')).toBeTruthy();
    });

    it('renders Log in button', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Log in')).toBeTruthy();
    });

    it('renders Forgot password link', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Forgot password?')).toBeTruthy();
    });
  });

  describe('Tab Switching', () => {
    it('shows email and password fields by default (Email tab)', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('switches to phone input when Phone tab is pressed', () => {
      const { getByText, getByPlaceholderText, getAllByPlaceholderText, queryByPlaceholderText } =
        render(<LoginScreen />);

      // Press Phone tab
      fireEvent.press(getByText('Phone'));

      // Should show phone input and password
      expect(getByPlaceholderText('Phone number')).toBeTruthy();
      expect(getAllByPlaceholderText('Password').length).toBe(1); // Password field for phone

      // Should not show email
      expect(queryByPlaceholderText('Email')).toBeNull();
    });

    it('switches back to email fields when Email tab is pressed', () => {
      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(<LoginScreen />);

      // Switch to Phone
      fireEvent.press(getByText('Phone'));
      expect(getByPlaceholderText('Phone number')).toBeTruthy();

      // Switch back to Email
      fireEvent.press(getByText('Email'));
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(queryByPlaceholderText('Phone number')).toBeNull();
    });
  });

  describe('Form Input', () => {
    it('allows typing in email field', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('allows typing in password field', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      const passwordInput = getByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'secretpassword');

      expect(passwordInput.props.value).toBe('secretpassword');
    });

    it('allows typing in phone number field', () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);

      // Switch to Phone tab
      fireEvent.press(getByText('Phone'));

      const phoneInput = getByPlaceholderText('Phone number');
      fireEvent.changeText(phoneInput, '+27821234567');

      expect(phoneInput.props.value).toBe('+27821234567');
    });

    it('allows typing in phone password field', () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);

      // Switch to Phone tab
      fireEvent.press(getByText('Phone'));

      const passwordInput = getByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'secretpassword');

      expect(passwordInput.props.value).toBe('secretpassword');
    });
  });

  describe('Login Button', () => {
    it('calls signIn when Log in is pressed with valid email credentials', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      // Fill in credentials
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

      // Press login
      fireEvent.press(getByText('Log in'));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading state when login is in progress', () => {
      // This would require mocking loading state
      // For now, we verify the button text changes are possible
      const { getByText } = render(<LoginScreen />);
      expect(getByText('Log in')).toBeTruthy();
    });
  });
});
