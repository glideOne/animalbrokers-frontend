<template>
  <div>

    <v-app-bar dense>
      <h2>{{ thread.title }}</h2>
    </v-app-bar>

    <v-col>

      <v-card elevation="11" outlined shaped tile style="text-align: left" margin-left="30px">
        <v-row style="padding-bottom: 20px; padding-right: 30px;">
          <v-col>
            <v-card-title>
              {{ thread.creator.firstName }} {{ thread.creator.lastName }}
            </v-card-title>

            <v-card-subtitle>
              Topic: {{ thread.type }} <br>
              Animal Class: {{ thread.animalClassName }} <br>
              Animal Breed: {{ thread.animalBreedName }}
            </v-card-subtitle>

            <v-card-text>
              {{ thread.description }}
            </v-card-text>
          </v-col>

          <v-col>
            <v-col align="left">
              <h6>Last known location:</h6>
            </v-col>
            <div>
              <GmapMap
                  ref="mapRef"
                  :center="marker.position"
                  :zoom="15"
                  :options="mapOptions"
                  map-type-id="terrain"
                  style="height: 200pt"
              >
                <GmapMarker
                  :position="marker.position"
                ></GmapMarker>
              </GmapMap>
            </div>
          </v-col>

          <v-col class="shrink" >
            <v-col align="left">
              <h6>Last known photo:</h6>
            </v-col>
            <v-img :src="image" width="300" class="ml-3"></v-img>
          </v-col>
        </v-row>
      </v-card>

    </v-col>

    <v-row>
      <v-col
          cols="12"
          sm="6"
      >

      </v-col>

      <v-col
          cols="12"
          sm="6"
      >

      </v-col>

    </v-row>


  </div>
</template>

<script>
export default {
  name: "Thread",

  data(){
    return {
      id: this.$route.params.id,
      thread: {},
      image: "",
      mapOptions: {
        disableDefaultUI: false,
      },
      marker: {position: {lat: null, lng: null}}
    }
  },

  methods: {

    getThread() {
      this.$http.get('/api/v1/threads/' + this.id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => {
        this.thread = response.data;
        this.image = 'data:image/jpeg;base64,' + this.thread.photos[0].image;
        this.marker.position.lat = this.thread.lastKnownLocation.latitude;
        this.marker.position.lng = this.thread.lastKnownLocation.longitude;
      })
    },

  },

  beforeMount() {
    this.getThread();
  },

}
</script>

<style scoped>

</style>