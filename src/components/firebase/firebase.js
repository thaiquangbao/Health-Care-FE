// Import the functions you need from the SDKs you need
import { TypeHTTP, api } from "@/utils/api";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcesHdThiEsFH-KCLRmgSJcKooNEo0yx8",
    authDomain: "autonomous-time-443911-i3.firebaseapp.com",
    projectId: "autonomous-time-443911-i3",
    storageBucket: "autonomous-time-443911-i3.firebasestorage.app",
    messagingSenderId: "450494084881",
    appId: "1:450494084881:web:7a37a93d068d4aa2bf3eb0",
    measurementId: "G-6R2WCQ9G9E"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()
export const signWithGoogle = (type) => new Promise((rejects, resolve) => {
    signInWithPopup(auth, provider)
        .then(result => {
            const { email, photoURL } = result.user
            if (type === 'sign-up') {
                api({ body: { email, avatar: photoURL }, path: '/sign-up-with-google', type: TypeHTTP.POST, sendToken: false })
                    .then(user => {
                        rejects(user)
                    })
                    .catch(error => {
                        resolve(error)
                    })
            } else if (type === 'sign-in') {
                api({ body: { email }, path: '/sign-in-with-google', type: TypeHTTP.POST, sendToken: false })
                    .then(user => {
                        rejects(user)
                    })
                    .catch(error => {
                        resolve(error)
                    })
            }
        })
        .catch(error => {
            resolve(error)
        })
})
export const connectToGoogle = (type) => new Promise((resolve, rejects) => {
    signInWithPopup(auth, provider)
        .then(result => {
            const { email } = result.user
            resolve(email)
        })
        .catch(error => {
            rejects(error)
        })
})