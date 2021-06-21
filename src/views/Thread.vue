<template>
  <v-container :key="componentKey">
    <v-app-bar dense style="padding-top: 7px; height: 55px">
      <h2>{{ thread.title }}</h2>
    </v-app-bar>

    <v-col>
      <v-card elevation="11" outlined shaped tile style="text-align: left">
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
                  :center="mapCenter.position"
                  :zoom="13"
                  :options="mapOptions"
                  map-type-id="terrain"
                  style="height: 200pt"
              >
                <GmapMarker
                    :position="m.position"
                    :key="index"
                    v-for="(m, index) in markers"
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

        <v-card-actions>
          <v-btn v-if="shouldShowThreadEditButton(thread)"
                 color="primary" text x-small dark
                 @click.stop="loadEditThreadDialog(thread)"
          >
            Edit
          </v-btn>
          <v-btn v-if="shouldShowThreadDeleteButton(thread)"
                 color="primary" text x-small dark
                 @click.stop="threadDeleteDialog = true"
          >
            Delete
          </v-btn>

          <v-dialog
              v-model="threadDeleteDialog"
              max-width="290"
          >
            <v-card>
              <v-card-title class="text-h6" style="text-align: left">Delete thread</v-card-title>
              <v-card-text style="text-align: left">Are you sure you want to delete the thread?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="threadDeleteDialog = false">Cancel</v-btn>
                <v-btn color="primary" text @click="threadDeleteDialog = false, deleteThread(thread.id)">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
              v-model="threadEditDialog"
              max-width="800"
          >
            <v-card>
              <v-card-title class="text-h6" style="text-align: left">Edit thread</v-card-title>
              <v-card-text>
                <v-form ref="threadEditForm">
                  <v-text-field
                      v-model="threadEditInput.title"
                      :counter="160"
                      label="Thread title"
                      :rules="titleRules"
                      required
                      validate-on-blur
                      solo-inverted
                  ></v-text-field>

                  <v-textarea
                      v-model="threadEditInput.description"
                      :rules="descriptionRules"
                      required
                      validate-on-blur
                      filled
                      label="Description"
                      auto-grow
                      placeholder="Type in all the details of your post here..."
                  ></v-textarea>

                  <v-select
                      v-model="threadEditInput.type"
                      :items="threadTypes"
                      validate-on-blur
                      item-text="id"
                      item-value="id"
                      label="Thread type"
                  ></v-select>
                  <v-row>
                    <v-select
                        v-model="threadEditInput.animalClass"
                        :items="animalClasses"
                        validate-on-blur
                        item-text="name"
                        item-value="id"
                        label="Animal class"
                        @input="getAnimalBreeds"
                        style="width: 50%; float:left; display: inline-block; padding-right: 10px"
                    ></v-select>

                    <v-select
                        v-model="threadEditInput.animalBreed"
                        :items="animalBreeds"
                        :rules="animalBreedRules"
                        validate-on-blur
                        item-text="name"
                        item-value="id"
                        label="Animal breed"
                        style="width: 50%; float:left; display: inline-block; padding-left: 10px"
                    ></v-select>
                  </v-row>
                </v-form>

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="threadEditDialog = false">Cancel</v-btn>
                <v-btn color="primary" text @click="threadEditDialog = false, editThread(thread.id)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>

    </v-col>

    <br/>

    <v-col>
      <v-row
          :key="post.id"
          v-for="post in this.thread.posts"
          style="margin-left: 10px; margin-right: 10px;"
      >
        <v-card elevation="11" outlined shaped tile style="text-align: left">
          <v-row style="padding-bottom: 20px; padding-right: 30px;">
            <v-col>
              <v-card-title style="font-size: 18px">
                {{ post.poster.firstName }} {{ post.poster.lastName }}
              </v-card-title>

              <v-card-subtitle>
                {{ post.created.replace('T', ' ').substring(0, 16) }}
              </v-card-subtitle>

              <v-card-text>
                {{ post.text }}
              </v-card-text>

              <v-card-actions>
                <v-btn v-if="shouldShowPostEditButton(post)"
                       color="primary" text x-small dark
                       @click.stop="postEditDialog = true"
                >
                  Edit
                </v-btn>
                <v-btn v-if="shouldShowPostDeleteButton(post)"
                       color="primary" text x-small dark
                       @click.stop="postDeleteDialog = true"
                >
                  Delete
                </v-btn>

                <v-dialog
                    v-model="postDeleteDialog"
                    max-width="290"
                >
                  <v-card>
                    <v-card-title class="text-h6" style="text-align: left">Delete post</v-card-title>
                    <v-card-text style="text-align: left">Are you sure you want to delete the post?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="postDeleteDialog = false">Cancel</v-btn>
                      <v-btn color="primary" text @click="postDeleteDialog = false, deletePost(post.id)">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-dialog
                    v-model="postEditDialog"
                    max-width="600"
                >
                  <v-card>
                    <v-card-title class="text-h6" style="text-align: left">Edit post</v-card-title>
                    <v-card-text>

                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="postEditDialog = false">Cancel</v-btn>
                      <v-btn color="primary" text @click="postEditDialog = false, editPost(post.id)">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-col>

            <v-col class="shrink" v-if="post.hasPhoto" style="margin-top: 20px">
              <!--                            <v-col align="left">-->
              <!--                              <h6>Last known photo:</h6>-->
              <!--                            </v-col>-->
              <v-img :src="post.photos[0].image" width="300" class="ml-3"></v-img>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-col>

    <br/>
    <v-form ref="form" v-if="isLoggedInUserActive()">
      <v-row>
        <v-col sm="2"></v-col>
        <v-col sm="4">
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

  </v-container>
</template>

<script>
export default {
  name: "Thread",

  data() {
    return {
      componentKey: 1,
      postRules: [
        v => !!v || 'Field is required'
      ],
      id: this.$route.params.id,
      thread: {},
      image: null,
      mapOptions: {
        disableDefaultUI: false,
      },
      mapCenter: {position: {lat: 46.7712, lng: 23.6236}},
      markers: [],
      newMarker: {position: null},
      lastKnownLocation: null,
      photo: null,
      photos: [],
      post: "",
      hasLocation: false,
      hasPhoto: false,
      threadDeleteDialog: null,
      threadEditDialog: null,
      postDeleteDialog: null,
      postEditDialog: null,
      threadEditInput: {},
      threadTypes: [],
      animalClasses: [],
      animalBreeds: [],
      titleRules: [
        v => !!v || 'Title is required',
        v => !!v && v <= 160 || 'Title should have less than 160 characters'
      ],
      descriptionRules: [
        v => !!v || 'Description is required'
      ],
      animalBreedRules: [
        v => !!v && v.id !== null || 'Animal breed is required'
      ],
    }
  },

  methods: {

    deletePost(id) {
      this.$http.delete('/api/v1/posts/' + id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      })
          .then(() => this.$router.go(0))
    },

    deleteThread(id) {
      this.$http.delete('/api/v1/threads/' + id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      })
          .then(() => this.$router.push('/dashboard'))
    },

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
          .then(() => this.$router.go(0))
          .catch(error => console.log(error))
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

    getThread() {
      this.$http.get('/api/v1/threads/' + this.id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => {
        this.thread = response.data;
        if (this.thread.photos != null && this.thread.photos.length > 0) {
          this.image = 'data:image/jpeg;base64,' + this.thread.photos[0].image;
          this.hasPhoto = true;
        }
        if (this.thread.lastKnownLocation != null) {
          this.mapCenter = {
            position: {
              lat: this.thread.lastKnownLocation.latitude,
              lng: this.thread.lastKnownLocation.longitude
            }
          };
          this.markers.push(this.mapCenter);
          this.hasLocation = true;
        }
        this.computePostFields(this.thread.posts);
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
    },

    computePostFields(posts) {
      if (posts == null) {
        return;
      }
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].spottedAt != null) {
          this.mapCenter = {
            position: {
              lat: posts[i].spottedAt.latitude,
              lng: posts[i].spottedAt.longitude
            }
          };
          this.markers.push(this.mapCenter);
          this.hasLocation = true;
        }
        if (posts[i].photos != null && posts[i].photos.length > 0) {
          posts[i].hasPhoto = true;
          posts[i].photos[0].image = 'data:image/jpeg;base64,' + posts[i].photos[0].image;
        }
      }
    },

    shouldShowPostDeleteButton(post) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      let poster = post.poster;
      return currentUser.role === 'ADMIN' || (currentUser.id === poster.id && currentUser.active === true);
    },

    shouldShowThreadDeleteButton(thread) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      let creator = thread.creator;
      return currentUser.role === 'ADMIN' || (currentUser.id === creator.id && currentUser.active === true);
    },

    shouldShowPostEditButton(post) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      return currentUser.id === post.poster.id && currentUser.active === true;
    },

    shouldShowThreadEditButton(thread) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      return currentUser.id === thread.creator.id && currentUser.active === true;
    },

    loadEditThreadDialog(thread) {
      this.threadEditDialog = true;
      this.getThreadTypes();
      this.getAnimalClasses();
      this.getAnimalBreeds(thread.animalClassId);

      this.threadEditInput = {
        title: thread.title,
        description: thread.description,
        type: thread.type,
        animalClass: {
          id: thread.animalClassId,
          name: thread.animalClassName
        },
        animalBreed: {
          id: thread.animalBreedId,
          name: thread.animalBreedName
        }
      }
    },

    editThread(threadId) {
      if (!this.$refs.threadEditForm.validate()) {
        return;
      }
      console.log(threadId);
    },

    editPost(postId) {
      console.log(postId);
    },

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

    getAnimalBreeds(animalClassId) {
      this.$http.get('/api/v1/breeds?animalClassId=' + animalClassId,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.animalBreeds = response.data;
          })
    },

    isLoggedInUserActive() {
      let user = localStorage.getItem('user');
      if (user === null) {
        return false;
      }
      return JSON.parse(user).active;
    }

  },

  beforeMount() {
    this.getThread();
  },

}
</script>

<style scoped>

</style>