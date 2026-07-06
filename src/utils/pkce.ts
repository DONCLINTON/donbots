// Standard cryptographic utility for secure OAuth2 PKCE token handshakes

// Generates a high-entropy random string for the verifier
export const generateCodeVerifier = (): string => {
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
};

// Hashes the verifier using SHA-256 to create the challenge string
export const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

