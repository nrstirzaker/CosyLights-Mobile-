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
              @click="saveImage"
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
  </q-page>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'
//import { onMounted, onBeforeUnmount, ref } from 'vue'

import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

const cameraRef = ref(null)
const canvasRef = ref(null)
const saveButton = ref()
const discardButton = ref()
const captureButton = ref()
let stream = null
const imageCaptured = ref(false)
const post = reactive({
  id: uuidv4(),
  name: '',
  photo: ref(),
  date: DateTime.now(),
})
//const forPhoto = document.getElementById('forPhotoId')

onMounted(async () => {
  await initCamera()
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
  post.photo.value = canvas.toDataURL('image/png')
  console.log(post)
}

function discardImage() {
  let canvas = canvasRef.value
  let canvasContext = canvas.getContext('2d')
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  imageCaptured.value = false
}

function saveImage() {
  let canvas = canvasRef.value
  let canvasContext = canvas.getContext('2d')
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  imageCaptured.value = false
}

//
</script>
<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
