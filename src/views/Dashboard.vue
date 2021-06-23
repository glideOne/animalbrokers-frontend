<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
        <h2>Dashboard</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="3" style="text-align: left">
        <v-btn
            elevation="2"
            depressed
            color="primary"
            to="/threads"
            width="200"
        >Search threads
        </v-btn>
      </v-col>
      <v-col sm="6"></v-col>
      <v-col sm="3" style="text-align: right">
        <v-btn
            elevation="2"
            depressed
            color="primary"
            to="/createthread"
            v-if="isLoggedInUserActive()"
            width="200"
        >Create new thread
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <GmapMap
            ref="viewMapRef"
            :center="center"
            :zoom="15"
            :options="mapOptions"
            map-type-id="terrain"
            style="height: 400px"
        >
          <GmapMarker
              :position="m.position"
              :key="index"
              v-for="(m, index) in markers"
              @click="displayThread($event, m)"
          ></GmapMarker>
          <GmapMarker
              :position="center"
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          ></GmapMarker>
        </GmapMap>
      </v-col>
    </v-row>

    <v-row style="padding-top: 20px">
      <h2 style="text-align: left">Latest announcements</h2>
    </v-row>
    <v-row>

      <v-col cols="12" sm="4">
        <h5>Lost</h5>

        <v-data-table
            :headers="headers"
            :items="lostThreads"
            class="elevation-1"
            hide-default-footer
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="12" sm="4">
        <h5>Found</h5>

        <v-data-table
            :headers="headers"
            :items="foundThreads"
            class="elevation-1"
            hide-default-footer
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="12" sm="4">
        <h5>Other</h5>

        <v-data-table
            :headers="headers"
            :items="otherThreads"
            class="elevation-1"
            hide-default-footer
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
          <template #item.shortDescription="{ item }">
            {{ item.shortDescription }}
          </template>
        </v-data-table>

      </v-col>
    </v-row>

    <v-menu
        v-model="viewThread.openMenu"
        :close-on-content-click="false"
        :position-x="viewThread.menuX"
        :position-y="viewThread.menuY"
    >
      <v-card
          color="grey lighten-4"
          min-width="400px">
        <v-toolbar height="50" color="primary">
          <v-toolbar-title
              v-html="viewThread.selectedThread.title"
              style="font-size: 16px; font-weight: bold; color: white"
          ></v-toolbar-title>
        </v-toolbar>
        <v-card-text style="text-align: left">
          <div>
            <b>Animal Class: </b>{{ viewThread.selectedThread.animalClassName }}
          </div>
          <div>
            <b>Animal Breed: </b>{{ viewThread.selectedThread.animalBreedName }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="$router.push('/thread/' + viewThread.selectedThread.id)">
            Go to thread
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="viewThread.openMenu = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-col></v-col>


  </v-container>


</template>

<script>
export default {
  name: "Dashboard",

  data() {
    return {
      lostThreads: [],
      foundThreads: [],
      otherThreads: [],
      center: {lat: 46.7712, lng: 23.6236},
      markers: [],
      mapOptions: {
        disableDefaultUI: false,
      },
      viewThread: {
        selectedThread: {},
        openMenu: false,
        menuX: 0,
        menuY: 0,
      },
      headers: [
        {text: 'Title', value: 'title'},
        {text: 'Creator', value: 'creatorName'},
        {text: 'Description', value: 'shortDescription'}
      ],

    }
  },

  methods: {
    searchThreads() {
      this.$http.get('/api/v1/threads',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.markers = [];
            for (let i = 0; i < response.data.length; i++) {
              let thread = response.data[i];
              if (thread.lastKnownLocation !== null && thread.lastKnownLocation !== undefined) {
                thread.position = {
                  lat: thread.lastKnownLocation.latitude,
                  lng: thread.lastKnownLocation.longitude
                }
                this.markers.push(thread);
              }
            }
          })
    },

    displayThread(event, thread) {
      this.viewThread.menuX = event.domEvent.pageX;
      this.viewThread.menuY = event.domEvent.pageY;
      this.viewThread.openMenu = true;
      this.viewThread.selectedThread = thread;
    },

    searchLostThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'LOST'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              if (i < 5) {
                let thread = response.data[i];
                thread.shortDescription = this.trimText(thread.description);
                this.lostThreads.push(thread);
              }
            }
          })
    },

    searchFoundThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'FOUND'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              if (i < 5) {
                let thread = response.data[i];
                thread.shortDescription = this.trimText(thread.description);
                this.foundThreads.push(thread);
              }
            }
          })
    },

    searchOtherThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'OTHER'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              if (i < 5) {
                let thread = response.data[i];
                thread.shortDescription = this.trimText(thread.description);
                this.otherThreads.push(thread);
              }
            }
          })
    },

    handleClick(thread) {
      this.$router.push("/thread/" + thread.id)
    },

    trimText(text) {
      if (text == null) {
        return "";
      }
      if (text.length < 50) {
        return text;
      }
      return text.substr(0, 50) + '...';
    },

    isLoggedInUserActive() {
      let user = localStorage.getItem('user');
      if (user === null) {
        return false;
      }
      return JSON.parse(user).active;
    },

    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },

  },

  beforeMount() {
    this.searchLostThreads();
    this.searchFoundThreads();
    this.searchOtherThreads();
  },

  mounted() {
    this.searchThreads();
    this.geolocate();
  }
}
</script>

<style scoped>
td {
  text-align: left;
}
</style>