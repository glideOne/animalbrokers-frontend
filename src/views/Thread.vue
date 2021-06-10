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
              Animal Breed: {{ thread.animalBreedName }} <br>
              Time of last sighting: {{ thread.lastSeenTime }}
            </v-card-subtitle>

            <v-card-text>
              {{ thread.description }}
            </v-card-text>
          </v-col>

          <v-col v-if="hasLocation">
            <v-col align="left">
              <h6>Last known location:</h6>
            </v-col>
            <div>
              <GmapMap
                  ref="viewMapRef"
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

          <v-col class="shrink" v-if="hasPhoto">
            <v-col align="left">
              <h6>Last known photo:</h6>
            </v-col>
            <v-img :src="image" width="300" class="ml-3"></v-img>
          </v-col>
        </v-row>
      </v-card>

    </v-col>

    <v-form ref="form">
      <v-row>
        <v-col sm="2"></v-col>

        <v-col
            sm="4"
        >
          <v-textarea
              v-model="post"
              :rules="postRules"
              required
              validate-on-blur
              name="input-7-1"
              filled
              label="Post a comment"
              auto-grow
              height="250px"
              placeholder="Add a comment to this thread here..."
          ></v-textarea>

        </v-col>

        <v-col sm="4">
          <v-file-input
              counter
              show-size
              truncate-length="12"
              v-model="photo"
          ></v-file-input>


          <h6 style="text-align: left">Last known location:</h6>

          <div>
            <GmapMap
                ref="editMapRef"
                :center="{lat:46.7712, lng:23.6236}"
                :zoom="12"
                :options="mapOptions"
                map-type-id="terrain"
                style="height: 155px"
                @click="handleMapClick"
            >n
              <GmapMarker
                  :position="newMarker.position"
                  :clickable="true"
                  :draggable="true"
                  @drag="handleMarkerDrag"
                  @click="panToMarker"
              />
            </GmapMap>
          </div>
        </v-col>

        <v-col sm="2"></v-col>

      </v-row>


      <v-col style="">
        <v-btn
            @click="addPost"
            class="btn btn-primary"
            color="primary"
            elevation="3"
        >Post
        </v-btn>
      </v-col>
    </v-form>


  </div>
</template>

<script>
export default {
  name: "Thread",

  data() {
    return {
      postRules: [
        v => !!v || 'Field is required'
      ],
      id: this.$route.params.id,
      thread: {},
      image: null,
      mapOptions: {
        disableDefaultUI: false,
      },
      marker: {position: null},
      newMarker: {position: null},
      lastKnownLocation: null,
      photo: null,
      photos: [],
      post: "",
      hasLocation: false,
      hasPhoto: false
    }
  },

  methods: {

    addPost() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.convertPhotoToDto()
          .then(() =>
              this.$http.post('/api/v1/posts',
                  {
                    posterId: JSON.parse(localStorage.getItem('user')).id,
                    threadId: this.thread.id,
                    text: this.post,
                    photos: this.photos,
                    spottedAt: this.lastKnownLocation
                  }, {
                headers: {
                  'Authorization': localStorage.getItem('token')
                }
                }))
      .then(() => this.$router.push("/thread/" + this.thread.id))
      .catch(error => console.log(error))
    },

    async convertPhotoToDto(){
      if (this.photo == null) {
        return null;
      }
      this.photos.push({
        "image": await this.readFile(this.photo)
      })
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        let fr = new FileReader();
        let byteArray = [];
        fr.readAsArrayBuffer(file);

        fr.onloadend = event => {
          if (event.target.readyState === FileReader.DONE) {
            let arrayBuffer = event.target.result;
            let array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < array.length; i++) {
              byteArray.push(array[i])
            }
            resolve(byteArray);
          }
        }
        fr.onerror = reject;
      })
    },

    getThread() {
      this.$http.get('/api/v1/threads/' + this.id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => {
        this.thread = response.data;
        this.image = 'data:image/jpeg;base64,' + this.thread.photos[0].image;
        this.marker.position = {
          lat: this.thread.lastKnownLocation.latitude,
          lng: this.thread.lastKnownLocation.longitude
        };
        this.hasLocation = (this.marker.position != null);
        this.hasPhoto = (this.thread.photos[0].image != null);
      })
    },

    //sets the position of marker when dragged
    handleMarkerDrag(e) {
      this.newMarker.position = {lat: e.latLng.lat(), lng: e.latLng.lng()};
    },

    //Moves the map view port to marker
    panToMarker() {
      this.$refs.editMapRef.panTo(this.newMarker.position);
    },

    //Moves the marker to click position on the map
    handleMapClick(e) {
      this.newMarker.position = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      this.lastKnownLocation = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
      console.log(e.latLng.lat());
      console.log(e.latLng.lng());
    },

  },

  beforeMount() {
    this.getThread();
  },

}
</script>

<style scoped>

</style>