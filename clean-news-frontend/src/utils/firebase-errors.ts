import { FirebaseError } from "firebase/app";

export function isFirebaseError(e: unknown): e is FirebaseError {
  return e instanceof Object && "code" in e;
}

export function isCredentialError(e: FirebaseError): boolean {
  return (
    e.code === "auth/invalid-email" || e.code === "auth/invalid-credential"
  );
}
