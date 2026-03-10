<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let { onrecordingEvent } = $props();
  
  async function startRecord() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert("Your browser does not support recording.");
      return;
    }
    let audioTrack, videoTrack, stream;
    navigator.mediaDevices.getDisplayMedia({video: true})
      .then(async displayStream => {
        [videoTrack] = displayStream.getVideoTracks();
        const audioStream = await navigator.mediaDevices.getUserMedia({audio: true}).catch(e => {throw e});
        [audioTrack] = audioStream.getAudioTracks();
        stream = new MediaStream([videoTrack, audioTrack]);
        
        // Use prop callback or dispatch event
        if (onrecordingEvent) {
          onrecordingEvent({detail: {stream: stream}});
        } else {
          dispatch('recordingEvent', {stream: stream});
        }
      })
  }
</script>

<button onclick={startRecord} class="startRecordButton">
  <img src="images/startRecord.png" alt="startRecord" class="startRecordIcon" />
  Record bug
</button>

<style>
   .startRecordButton {
      all: unset;
      box-sizing: border-box;
      display: flex;
      width: 170px;
      height: 52px;
      align-items: center;
      justify-content: center;
      gap: 4px;
      position: relative;
      background-color: #62d84e;
      border-radius: 32px;
      overflow: hidden;
      font-size: 16px;
   }
   
   @media (max-width: 768px) {
      .startRecordButton {
         width: 126px;
         height: 36px;
         font-size: 12px;
      }
   }

   .startRecordIcon{
      height: 20px;
   }

   @media (max-width: 768px) {
      .startRecordIcon {
         height: 16px;
      }
   }
</style>