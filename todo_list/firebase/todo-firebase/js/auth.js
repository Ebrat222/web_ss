// Initialize FirebaseUI
let firebaseUi;
let firebaseUiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true
        }
    ],
    tosUrl: '<your-terms-of-service-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// Initialize FirebaseUI if we're in the right context
if (typeof firebaseui !== 'undefined') {
    firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());
}

// Auth State Observer
firebase.auth().onAuthStateChanged((user) => {
    const authSection = document.getElementById('auth-section');
    const app = document.getElementById('app');
    
    if (user) {
        // User is signed in
        authSection.classList.add('hidden');
        app.classList.remove('hidden');
        
        // Update user info
        document.getElementById('user-name').textContent = user.displayName || user.email;
        const userPhoto = document.getElementById('user-photo');
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.classList.remove('hidden');
        } else {
            userPhoto.classList.add('hidden');
        }
        
        // Load user's todos
        loadTodos(user.uid);
    } else {
        // User is signed out
        authSection.classList.remove('hidden');
        app.classList.add('hidden');
        
        // Start FirebaseUI auth
        if (firebaseUi) {
            firebaseUi.start('#firebaseui-auth-container', firebaseUiConfig);
        }
    }
});

// Sign out
document.getElementById('sign-out')?.addEventListener('click', () => {
    firebase.auth().signOut().catch((error) => {
        console.error('Sign out error:', error);
    });
});