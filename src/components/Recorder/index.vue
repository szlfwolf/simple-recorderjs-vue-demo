
<template>
    <h1>Simple Recorder.js {{ info }}</h1>
    <div id="controls">
    <button id="recordButton"  @click="startRecording">Record</button>
    <button id="pauseButton"  @click="pauseRecording" disabled>Pause</button>
    <button id="stopButton"   @click="stopRecordingWithTrans"  disabled>Stop</button>
    <select v-model="selectedOption">
        <option v-for="option in options" :value="option">{{option.name}}</option>
    </select>
    </div>
    <div id="formats">Format: start recording to see sample rate</div>
    <p><strong>Recordings:</strong></p>
    <ol id="recordingsList" ref="recordings"></ol>
        
</template>

<script setup lang="ts">
import { onMounted,ref } from 'vue';
// import axios from 'axios';
import { startRecording,pauseRecording,stopRecording } from './app.js'


const info = ref("")
const translang = ref("eng")
const selectedOption = ref({}) ;
const options =ref([{"name":"en"}]);

function stopRecordingWithTrans(){
console.log(selectedOption.value.name);
stopRecording(selectedOption.value.name);
}

onMounted(() => {
info.value = "demo"
const data = { lang: translang.value };
// axios
//   .post( import.meta.env.VITE_APP_BASE_API +'/langoptions', data)
//   .then((response) => {
//     console.log(response.data)
//     options.value = response.data;
//     selectedOption.value = options.value[0];
//   })
//   .catch(function (error) { // 请求失败处理
//     console.log(error);
//     info.value = "error"
//   });
})
</script>
