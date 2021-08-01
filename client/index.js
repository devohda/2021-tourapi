import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import App from './app/App';

import * as firebase from "firebase";

// firebase 연동
const firebaseConfig = {
    apiKey: "AIzaSyAS0DrsLq7TOEIORPQHjGmOpoRqhAskA4k",
    authDomain: "tourapi-321202.firebaseapp.com",
    projectId: "tourapi-321202",
    storageBucket: "tourapi-321202.appspot.com",
    messagingSenderId: "481459429337",
    appId: "1:481459429337:web:4459f5eabdbc43b78a83c8",
    measurementId: "G-06PY1R2CYG"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

registerRootComponent(App);