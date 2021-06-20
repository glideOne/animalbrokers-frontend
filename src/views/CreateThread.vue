<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
        <h2>Create New Thread</h2>
      </v-col>
    </v-row>

    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col
              cols="12"
              sm="6"
          >
            <v-text-field
                v-model="title"
                :counter="160"
                label="Thread title"
                :rules="titleRules"
                required
                validate-on-blur
                solo-inverted
            ></v-text-field>

            <v-textarea
                v-model="description"
                :rules="descriptionRules"
                required
                validate-on-blur
                name="input-7-1"
                filled
                label="Description"
                auto-grow
                placeholder="Type in all the details of your post here..."
            ></v-textarea>

            <v-select
                v-model="threadType"
                :items="threadTypes"
                :rules="threadTypesRules"
                required
                validate-on-blur
                item-text="id"
                item-value="id"
                label="Thread type"
                auto
                single-line
                solo
            ></v-select>

            <div style="height: 82px">
              <v-select
                  v-model="animalClass"
                  :items="animalClasses"
                  :rules="animalClassRules"
                  required
                  validate-on-blur
                  item-text="name"
                  item-value="id"
                  label="Animal class"
                  @input="changedClass"
                  auto
                  single-line
                  solo
                  style="width: 90%; float:left; display: inline-block"
              ></v-select>
              <v-btn fab text
                     color="primary"
                     width="40"
                     @click="newAnimalClass.dialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

            <div style="height: 82px">
              <v-select
                  v-model="animalBreed"
                  :items="animalBreeds"
                  :rules="animalBreedRules"
                  required
                  validate-on-blur
                  item-text="name"
                  item-value="id"
                  label="Animal breed"
                  auto
                  single-line
                  solo
                  style="width: 90%; float:left; display: inline-block"
              ></v-select>
              <v-btn fab text
                     color="primary"
                     width="40"
                     :disabled="animalClass === null"
                     @click="newAnimalBreed.dialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

          </v-col>

          <v-col
              cols="12"
              sm="6"
          >
            <v-file-input
                counter
                show-size
                truncate-length="12"
                v-model="photo"
            ></v-file-input>

            <v-col
                align="left"
            ><h5>Date and time of last sighting:</h5>
            </v-col>
            <v-row justify="center">
              <v-col cols="6">
                <v-date-picker v-model="lastSeenDate"></v-date-picker>
              </v-col>
              <v-col cols="6">
                <v-time-picker
                    format="24hr"
                    v-model="lastSeenTime"
                    scrollable
                ></v-time-picker>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col
              align="left"
          ><h5>Last known location:</h5>
          </v-col>
          <div>
            <GmapMap
                ref="mapRef"
                :center="{lat:46.7712, lng:23.6236}"
                :zoom="12"
                :options="mapOptions"
                map-type-id="terrain"
                style="height: 350pt"
                @click="handleMapClick"
            >n
              <GmapMarker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @drag="handleMarkerDrag"
                  @click="panToMarker"
              />
            </GmapMap>
          </div>
        </v-row>

        <v-col></v-col>

        <v-col style="">
          <v-btn
              @click="createThread"
              class="btn btn-primary"
              color="primary"
              elevation="2"
              large
              x-large
          >Create thread
          </v-btn>
        </v-col>

      </v-container>
    </v-form>

    <v-dialog
        v-model="newAnimalClass.dialog"
        persistent
        width="500"
    >
      <v-card>
        <v-card-title class="text-h6 primary lighten-2">
          Create Animal Class
        </v-card-title>
        <v-container>
          <v-form ref="createAnimalClassForm">
            <v-text-field
                prepend-icon="mdi-dog-side"
                v-model="newAnimalClass.name"
                label="Animal Class Name"
                clearable
                counter="64"
                :rules="nameRules"
            ></v-text-field>
          </v-form>
          <div v-if="newAnimalClass.error != null" style="margin-top: 10px; color: red; font-size: 14px">
            {{ newAnimalClass.error }}
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="newAnimalClass.dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="createAnimalClass()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="newAnimalBreed.dialog"
        persistent
        width="500"
    >
      <v-card>
        <v-card-title class="text-h6 primary lighten-2">
          Create Animal Breed
        </v-card-title>
        <v-container>
          <v-form ref="createAnimalBreedForm">
            <v-text-field
                prepend-icon="mdi-dog-side"
                v-model="newAnimalBreed.name"
                label="Animal Breed Name"
                clearable
                counter="64"
                :rules="nameRules"
            ></v-text-field>
          </v-form>
          <div v-if="newAnimalBreed.error != null" style="margin-top: 10px; color: red; font-size: 14px">
            {{ newAnimalBreed.error }}
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="newAnimalBreed.dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="createAnimalBreed()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  name: "CreateThread",

  data() {
    return {
      titleRules: [
        v => !!v || 'Title is required'
      ],
      descriptionRules: [
        v => !!v || 'Description is required'
      ],
      threadTypesRules: [
        v => !!v || 'Thread type is required'
      ],
      animalClassRules: [
        v => !!v || 'Animal class is required'
      ],
      animalBreedRules: [
        v => !!v || 'Animal breed is required'
      ],
      threadType: "",
      description: "",
      threadTypes: [],
      animalClasses: [],
      animalBreeds: [],
      title: "",
      petName: "",
      lastSeenDate: null,
      lastSeenTime: null,
      lastKnownLocation: null,
      marker: {position: {lat: 10, lng: 10}},
      mapOptions: {
        disableDefaultUI: true,
      },
      photo: null,
      photos: [],
      newAnimalClass: {
        dialog: false,
        name: null,
        error: null
      },
      animalClass: null,
      newAnimalBreed: {
        dialog: false,
        name: null,
        error: null
      },
      animalBreed: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => !!v && v.length <= 64 || 'Name must be less than 64 characters',
      ],
    }
  },

  methods: {
    getThreadTypes() {
      this.$http.get('/api/v1/threads/types',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(response => this.threadTypes = response.data)
    },

    getAnimalClasses() {
      this.$http.get('/api/v1/classes',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(response => this.animalClasses = response.data)
    },

    createThread() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.convertPhotoToDto()
          .then(() =>
              this.$http.post('/api/v1/threads',
                  {
                    creatorId: JSON.parse(localStorage.getItem('user')).id,
                    title: this.title,
                    description: this.description,
                    type: this.threadType,
                    breedId: this.animalBreed.id,
                    lastKnownLocation: this.lastKnownLocation,
                    lastSeenTime: this.computeDate(),
                    photos: this.photos
                  }, {
                    headers: {
                      'Authorization': localStorage.getItem('token')
                    }
                  }))
          .then(() => this.$router.push('/dashboard'))
          .catch(error => console.log(error))
    },

    computeDate() {
      let date = '';
      if (this.lastSeenDate != null) {
        date += this.lastSeenDate;

        if (this.lastSeenTime != null) {
          date += 'T' + this.lastSeenTime
        } else {
          date += 'T' + '00:00'
        }
      }
      return date;
    },

    async convertPhotoToDto() {
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

    changedClass(animalClassId) {
      this.$http.get('/api/v1/breeds?animalClassId=' + animalClassId,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(response => this.animalBreeds = response.data)
    },

    //sets the position of marker when dragged
    handleMarkerDrag(e) {
      this.marker.position = {lat: e.latLng.lat(), lng: e.latLng.lng()};
    },

    //Moves the map view port to marker
    panToMarker() {
      this.$refs.mapRef.panTo(this.marker.position);
    },

    //Moves the marker to click position on the map
    handleMapClick(e) {
      this.marker.position = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      this.lastKnownLocation = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
      console.log(e.latLng.lat());
      console.log(e.latLng.lng());
    },

    createAnimalClass() {
      if (!this.$refs.createAnimalClassForm.validate()) {
        return;
      }
      this.$http.post('/api/v1/classes',
          {
            name: this.newAnimalClass.name
          }, {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.newAnimalClass.dialog = false;
            this.getAnimalClasses();
            this.animalClass = response.data;
            this.$refs.createAnimalClassForm.validate();
          })
          .catch(error => this.newAnimalClass.error = error.body.message)
    },

    createAnimalBreed() {
      if (!this.$refs.createAnimalBreedForm.validate()) {
        return;
      }
      this.$http.post('/api/v1/breeds',
          {
            name: this.newAnimalBreed.name,
            animalClassId: this.animalClass
          }, {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.newAnimalBreed.dialog = false;
            this.changedClass(this.animalClass);
            this.animalBreed = response.data;
            this.$refs.createAnimalBreedForm.validate(); // todo: investiugate
          })
          .catch(error => this.newAnimalBreed.error = error.body.message)
    }

  },

  beforeMount() {
    this.getThreadTypes();
    this.getAnimalClasses();
  }

}
</script>

<style scoped>

</style>