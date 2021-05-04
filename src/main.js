import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import VueResource from "vue-resource";

Vue.config.productionTip = false;

Vue.use(VueResource)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAf-bGiHHW-mZUfUkIros8Am9bydTRU2cw",
  authDomain: "animalbrokers-ab92b.firebaseapp.com",
  projectId: "animalbrokers-ab92b",
  storageBucket: "animalbrokers-ab92b.appspot.com",
  messagingSenderId: "149958519538",
  appId: "1:149958519538:web:b336055bb69359aa6d7e6b",
  measurementId: "G-GQKLM85DDF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
