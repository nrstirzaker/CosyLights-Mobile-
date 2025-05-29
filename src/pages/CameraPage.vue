<template>
  <q-page class="constrain q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        ref="cameraRef"
        v-show="!imageCaptured"
        class="full-width"
        autoplay
        playsinline
      ></video>
      <canvas v-show="imageCaptured" ref="canvasRef" class="full-width" height="240" />
    </div>
    <div class="q-pa-md example-row-equal-width">
      <div class="row">
        <div class="col">
          <div class="text-center q-pa-md">
            <q-btn
              color="primary"
              icon="fa-solid fa-floppy-disk"
              size="md"
              round
              @click="showSaveDialogue"
              :disabled="!imageCaptured"
              ref="saveButton"
            />
          </div>
        </div>
        <div class="col">
          <div class="text-center q-pa-md">
            <q-btn
              color="grey-10"
              icon="eva-camera"
              size="md"
              round
              @click="captureImage"
              ref="captureButton"
              :disabled="imageCaptured"
            />
          </div>
        </div>
        <div class="col">
          <div class="text-center q-pa-md">
            <q-btn
              color="primary"
              icon="fa-solid fa-trash"
              size="md"
              round
              @click="discardImage"
              :disabled="!imageCaptured"
              ref="discardButton"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Save" v-close-popup @click="saveImage"/>
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
//import { onMounted, onBeforeUnmount, ref } from 'vue'
import Localbase from 'localbase'

import { DateTime } from 'luxon'
//import { v4 as uuidv4 } from 'uuid'



const cameraRef = ref(null)
const canvasRef = ref(null)
const saveButton = ref()
const discardButton = ref()
const captureButton = ref()
const localDB = ref()
let stream = null
const imageCaptured = ref(false)
const prompt = ref(false)

//const forPhoto = document.getElementById('forPhotoId')

onMounted(async () => {
  await initCamera()
  localDB.value = new Localbase('CosyLights')
  const success = function(param){
    console.log(param)
    console.log("success")
  }

  //window.webkitPersistentStorage.requestQuota(1024*1024, function() {
    window.webkitRequestFileSystem(window.PERSISTENT , 1024*1024, success);
  //})
})

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })

    if (cameraRef.value) {
      cameraRef.value.srcObject = stream
    }
  } catch (err) {
    console.error('Error accessing webcam:', err)
  }
}

onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
})

function captureImage() {
  let video = cameraRef.value
  let canvas = canvasRef.value
  canvas.width = video.getBoundingClientRect().width
  canvas.height = video.getBoundingClientRect().height
  let canvasContext = canvas.getContext('2d')
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height)
  imageCaptured.value = true
  //post.photo = dataURItoBlob(canvas.toDataURL())

}

function discardImage() {
  let canvas = canvasRef.value
  let canvasContext = canvas.getContext('2d')
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  imageCaptured.value = false
}

function showSaveDialogue(){
  prompt.value = true
}

function saveImage() {

  const canvas = canvasRef.value
  const image = canvas.toDataURL("image/png");


  //const photoBlob = dataURItoBlob(canvas.toDataURL());
  //const photoURI = URL.createObjectURL(photoBlob);
  const post = {
    id: DateTime.now().toMillis(),
    name: "bottle",
    photo: image,
    date: DateTime.now().toFormat('yyyy-MM-dd:HH:mm:ss'),
  }
  console.log(post)
  imageCaptured.value = false
  localDB.value.collection('images').add(post)
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], {type: mimeString});


}



//
</script>
<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
