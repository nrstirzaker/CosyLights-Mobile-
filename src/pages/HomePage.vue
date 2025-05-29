<template>
  <q-page>
    <q-pull-to-refresh @refresh="refresh">
      <div class="q-gutter-md">
        <q-card v-for="(light, index) in lights" :key="index" class="q-mb-sm">
          <q-card-section class="q-pt-none">

            <div class="camera-frame q-pa-md">
              <img :src=light.photo width="307" height="230" :alt="light.name"/>
            </div>

            <div class="text-subtitle1">
              <div class="text-caption text-grey">Current Pattern: {{ light.patternName }}</div>
              <div class="text-caption text-grey">Last Updated: {{ light.lastUpdated }}</div>
          </div>
          </q-card-section>

          <q-card-actions>
            <q-btn-dropdown color="primary" label="New Pattern">
              <q-list v-for="(pattern, index) in patterns"
                      :key="index"
                      class="q-mb-sm">
                <q-item clickable v-close-popup @click="patternSelected(pattern)">
                  <q-item-section>
                    <q-item-label>{{ pattern }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-actions>
        </q-card>
      </div>
    </q-pull-to-refresh>



  </q-page>
</template>

<script setup>
import { onMounted, onBeforeMount, ref, reactive } from 'vue'
import { api } from 'boot/axios'
import Localbase from 'localbase'

//import { DateTime } from 'luxon'
//import { useQuasar } from 'quasar'

const baseUrl = 'http://127.0.0.1:3001'
//const baseUrl = 'https://cosy-lights-8bda6cc81054.herokuapp.com'
let db = new Localbase('CosyLights')

onBeforeMount(async () => {
  await loadMainData()
  loadAllPatterns()
})

const lights = ref([])
const patterns = ref([])
const canvasRef = ref()


function patternSelected(pattern) {
  console.log("clicked:" + pattern)
}

function refresh(done) {
  setTimeout(() => {
    loadMainData()
    loadAllPatterns()
    done()
  }, 1000)
}

async function loadMainData() {
  api
    .get(baseUrl + '/registered')
    .then(async (response) => {
      console.log('/registered:response.data: ' + JSON.stringify(response.data))
      if (response.data) {
        lights.value = response.data.lights
        await loadImages()
      } else {
        lights.value = []
      }
    })
    .catch((e) => {
      alert("unable to access server:" + e )
    })
}

function loadAllPatterns() {
  api
    .get(baseUrl + '/allpatterns')
    .then((response) => {
      console.log('/allpattern:response.data: ' + JSON.stringify(response.data))
      if (response.data) {
        patterns.value = response.data
      } else {
        patterns.value = []
      }
    })
    .catch((e) => {
      alert("unable to access server:" + e )
    })
}

async function loadImages() {

  for(const light of lights.value) {
    const name = light.name;
    const document  = await db.collection('images').doc({name:name}).get()
    light.photo = document.photo
  }
}

// function blobToImage (light,blob) {
//   return new Promise(resolve => {
//     const url = URL.createObjectURL(blob)
//     let img = new Image()
//     img.onload = () => {
//       URL.revokeObjectURL(url)
//       resolve(img)
//     }
//     light.photo = url
//     console.log(url)
//   })
// }


function BlobToBase64 (blob){
  let blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then(img => {
    URL.revokeObjectURL(blobUrl);
    // Limit to 256x256px while preserving aspect ratio
    let [w,h] = [img.width,img.height]
    let aspectRatio = w/h
    // Say the file is 1920x1080
    // divide max(w,h) by 256 to get factor
    let factor = Math.max(w,h)/256
    w = w/factor
    h = h/factor

    let canvas = document.getElementById("img");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
  })
}

// function blobToImageData(blob) {
//
//     let canvas = document.createElement("img");
//     //canvas.width = w;
//     //canvas.height = h;
//     let ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);



  // let blobUrl = URL.createObjectURL(blob);
  // let img = new Image();
  // //URL.revokeObjectURL(blobUrl);
  // img.src = blobUrl;
  // return blobUrl;
//}

  // return new Promise((resolve, reject) => {
  //
  //   img.onload = () => resolve(img);
  //   img.onerror = err => reject(err);
  //
  // }).then(img => {
  //
  //   // Limit to 256x256px while preserving aspect ratio
  //   //let [w,h] = [img.width,img.height]
  //   //let aspectRatio = w/h
  //   // Say the file is 1920x1080
  //   // divide max(w,h) by 256 to get factor
  //   //let factor = Math.max(w,h)/256
  //   //w = w/factor
  //   //h = h/factor
  //
  //   // REMINDER
  //   // 256x256 = 65536 pixels with 4 channels (RGBA) = 262144 data points for each image
  //   // Data is encoded as Uint8ClampedArray with BYTES_PER_ELEMENT = 1
  //   // So each images = 262144bytes
  //   // 1000 images = 260Mb
  //   // let canvas = document.createElement("canvas");
  //   // canvas.width = w;
  //   // canvas.height = h;
  //   // let ctx = canvas.getContext("2d");
  //   // ctx.drawImage(img, 0, 0);
  //
  //   return img;//ctx.getImageData(0, 0, w, h);    // some browsers synchronously decode image here
  // })
//}
</script>
<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
