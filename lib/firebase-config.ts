/**
 * Firebase Configuration Switcher
 * Switch between Mock (testing) and Real Firebase (production)
 */

// Detect environment
const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                 process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'sorkroom-test' ||
                 typeof window !== 'undefined' && localStorage.getItem('useMockFirebase') === 'true';

console.log(`🔧 Firebase Mode: ${USE_MOCK ? '🎭 MOCK (Testing)' : '🔥 REAL (Production)'}`);

// Export appropriate module
export async function getFirebaseData(path: string): Promise<any> {
  if (USE_MOCK) {
    const { getFirebaseData: getMock } = await import('./firebase-mock');
    return getMock(path);
  } else {
    const { getFirebaseData: getReal } = await import('./firebase');
    return getReal(path);
  }
}

export async function setFirebaseData(path: string, data: any): Promise<boolean> {
  if (USE_MOCK) {
    const { setFirebaseData: setMock } = await import('./firebase-mock');
    return setMock(path, data);
  } else {
    const { setFirebaseData: setReal } = await import('./firebase');
    return setReal(path, data);
  }
}

export async function updateFirebaseData(path: string, data: any): Promise<boolean> {
  if (USE_MOCK) {
    const { updateFirebaseData: updateMock } = await import('./firebase-mock');
    return updateMock(path, data);
  } else {
    const { updateFirebaseData: updateReal } = await import('./firebase');
    return updateReal(path, data);
  }
}

export function subscribeToData(path: string, callback: (data: any) => void) {
  if (USE_MOCK) {
    const { subscribeToData: subMock } = require('./firebase-mock');
    return subMock(path, callback);
  } else {
    const { subscribeToData: subReal } = require('./firebase');
    return subReal(path, callback);
  }
}

// Helper to switch mode (for testing)
export function setMockMode(useMock: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('useMockFirebase', useMock ? 'true' : 'false');
    window.location.reload();
  }
}

export function isMockMode(): boolean {
  return USE_MOCK;
}

console.log('💡 Tip: To use mock data, set NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-test in .env.local');
