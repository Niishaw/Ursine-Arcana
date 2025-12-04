import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import type { UserProfile } from "@ursine-arcana/shared";

interface SignUpData {
  dateOfBirth: Date;
  termsAcceptedAt: Date;
  privacyAcceptedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<string>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, data: SignUpData) => {
    setLoading(true);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Create initial user document in Firestore
      const userDoc: Partial<UserProfile> = {
        uid: newUser.uid,
        email: newUser.email || email,
        phone: null,
        displayName: "",
        dateOfBirth: data.dateOfBirth as unknown as UserProfile["dateOfBirth"],
        ageVerifiedAt: new Date() as unknown as UserProfile["ageVerifiedAt"],
        consents: {
          termsAcceptedAt:
            data.termsAcceptedAt as unknown as UserProfile["consents"]["termsAcceptedAt"],
          privacyAcceptedAt:
            data.privacyAcceptedAt as unknown as UserProfile["consents"]["privacyAcceptedAt"],
          specialPersonalInfoConsentAt: null,
          locationConsentAt: null,
          analyticsOptOut: false,
        },
        bio: "",
        species: "other",
        customSpecies: null,
        profileImageUrl: null,
        galleryImageUrls: [],
        tribes: [],
        lookingFor: [],
        position: null,
        tags: [],
        locationEnabled: false,
        location: null,
        locationUpdatedAt: null,
        profileVisibility: "public",
        showDistance: true,
        showOnlineStatus: true,
        isOnline: true,
        lastActiveAt: new Date() as unknown as UserProfile["lastActiveAt"],
        accountStatus: "active",
        createdAt: new Date() as unknown as UserProfile["createdAt"],
        updatedAt: new Date() as unknown as UserProfile["updatedAt"],
      };

      await setDoc(doc(db, "users", newUser.uid), userDoc);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendPhoneVerification = async (
    phoneNumber: string,
  ): Promise<string> => {
    // Note: In a real app, you'd use Firebase Phone Auth with reCAPTCHA
    // This is a simplified version - actual implementation requires
    // platform-specific setup (expo-firebase-recaptcha or similar)
    const provider = new PhoneAuthProvider(auth);
    // This would need a reCAPTCHA verifier in production
    // For now, return a placeholder
    console.log("Phone verification requested for:", phoneNumber);
    return "verification-id-placeholder";
  };

  const verifyPhoneCode = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await signInWithCredential(auth, credential);
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  // Check if user has completed onboarding (has display name and species set)
  const hasCompletedOnboarding = Boolean(
    userProfile?.displayName &&
    userProfile?.species &&
    userProfile.species !== "other",
  );

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    hasCompletedOnboarding,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendPhoneVerification,
    verifyPhoneCode,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
