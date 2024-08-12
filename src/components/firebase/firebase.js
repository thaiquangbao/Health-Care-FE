// Import the functions you need from the SDKs you need
import { TypeHTTP, api } from "@/utils/api";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// const firebaseConfig = {
//     apiKey: "AIzaSyCyfApSOhmzntN8JTQmBVuw3uHHSXnqrC4",
//     authDomain: "qichat-c35cf.firebaseapp.com",
//     projectId: "qichat-c35cf",
//     storageBucket: "qichat-c35cf.appspot.com",
//     messagingSenderId: "751868249418",
//     appId: "1:751868249418:web:552c397998bdbceddc2db3",
//     measurementId: "G-X551QCY7NT"
// };

// const firebaseConfig = {
//     apiKey: "AIzaSyDROVWxMdW3k4GytVEZEZZbXoJKGstLFlU",
//     authDomain: "healthhaven-ba506.firebaseapp.com",
//     projectId: "healthhaven-ba506",
//     storageBucket: "healthhaven-ba506.appspot.com",
//     messagingSenderId: "446064924415",
//     appId: "1:446064924415:web:893255e3b7b5963ae59eca",
//     measurementId: "G-H6NVCRBFZJ"
// };

const firebaseConfig = {
    apiKey: "AIzaSyDROVWxMdW3k4GytVEZEZZbXoJKGstLFlU",
    authDomain: "healthhaven-ba506.firebaseapp.com",
    projectId: "healthhaven-ba506",
    storageBucket: "healthhaven-ba506.appspot.com",
    messagingSenderId: "446064924415",
    appId: "1:446064924415:web:3931f260034e7c99e59eca",
    measurementId: "G-VSDN2BRSE5"
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