import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAP6ZWfkpeydLqVfgq8LXF-6RKMobxLP84',
    libraries: 'places,drawing,visualization'
  },
  installComponents: true,
})

Vue.use(VueResource)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
