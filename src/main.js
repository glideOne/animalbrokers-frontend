import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// import firebase from "firebase";
import VueResource from "vue-resource";
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBwiITw2LKvW9AQkmv5bT-D6S5c-saWAdw',
    libraries: 'places'
  },
  installComponents: true,
})

Vue.use(VueResource)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//   apiKey: "AIzaSyAf-bGiHHW-mZUfUkIros8Am9bydTRU2cw",
//   authDomain: "animalbrokers-ab92b.firebaseapp.com",
//   projectId: "animalbrokers-ab92b",
//   storageBucket: "animalbrokers-ab92b.appspot.com",
//   messagingSenderId: "149958519538",
//   appId: "1:149958519538:web:b336055bb69359aa6d7e6b",
//   measurementId: "G-GQKLM85DDF"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// console.log(firebase);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
