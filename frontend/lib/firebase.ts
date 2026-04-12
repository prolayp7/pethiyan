import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";
import { API_BASE } from "@/lib/api";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
};

const envFirebaseConfig: FirebaseWebConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
};

let configPromise: Promise<FirebaseWebConfig> | null = null;

// Singleton — avoid re-initialising on hot reload
let app: FirebaseApp;
let auth: Auth;

function hasRequiredFirebaseConfig(config: FirebaseWebConfig): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId);
}

async function getFirebaseConfig(): Promise<FirebaseWebConfig> {
  if (hasRequiredFirebaseConfig(envFirebaseConfig)) {
    return envFirebaseConfig;
  }

  if (!configPromise) {
    configPromise = fetch(`${API_BASE}/api/settings/firebase-config`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Firebase config request failed with status ${response.status}`);
        }

        const payload = await response.json() as {
          data?: Partial<FirebaseWebConfig>;
        };

        const config: FirebaseWebConfig = {
          apiKey: payload.data?.apiKey ?? "",
          authDomain: payload.data?.authDomain ?? "",
          projectId: payload.data?.projectId ?? "",
        };

        if (!hasRequiredFirebaseConfig(config)) {
          throw new Error("Firebase config is missing required values.");
        }

        return config;
      })
      .catch((error) => {
        configPromise = null;
        throw error;
      });
  }

  return configPromise;
}

async function getFirebase() {
  if (!app) {
    const firebaseConfig = await getFirebaseConfig();
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return { app, auth };
}

export async function signInWithGoogle(): Promise<{ idToken: string; name: string | null; email: string | null }> {
  const { auth } = await getFirebase();
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    name:  result.user.displayName,
    email: result.user.email,
  };
}
