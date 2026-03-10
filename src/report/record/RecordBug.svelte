<script>
   import StartRecord from "./StartRecord.svelte";
   import StopRecord from "./StopRecord.svelte";
   import Video from "./Video.svelte";
   import { videoSrcInStore } from "../store.js";
   import { videoUrlInStore } from "../store.js";
   import { fileContentFactory } from "./freeAndPro/fileFactory.js";
   import { updateErrorMsg } from "../utils.js";

   const file = fileContentFactory();
   let isRecording = $state(false);
   let isVideoRecorded = $state(false);
   let blobs = $state([]);
   let stream = $state();
   let mediaRecorder = $state();
   let videoSrc = $state();

   function setRecordingStatus(ev) {
      isRecording = true;
      isVideoRecorded = false;
      file.startCollectLogs();
      blobs = [];
      stream = ev.detail.stream;
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
         if (event.data) {
            blobs.push(event.data);
         }
      };
      stream.getVideoTracks()[0].onended = function () {
         setStoppingStatus();
      };
      mediaRecorder.onstop = doPreview;
      mediaRecorder.start(1000);
   }

   function setStoppingStatus() {
      isRecording = false;
      isVideoRecorded = true;
      stream.getTracks().forEach((track) => track.stop());
      file.stopCollectLogs();
   }

   function doPreview() {
      if (!blobs.length) return;
      const blob = new Blob(blobs, { type: mediaRecorder.mimeType });
      videoSrc = URL.createObjectURL(blob);
      videoSrcInStore.set(blob);
      videoUrlInStore.set(videoSrc);

      validateVideo();
   }

   let videoError = $state("");

   function validateVideo() {
      if (
         typeof videoSrcInStore === "undefined" ||
         videoSrcInStore.size === 0
      ) {
         videoError = "Recording is required";
      } else {
         videoError = "";
      }
      updateErrorMsg(".icon-or-video", "videoError", videoError);
   }
</script>

<div class="bg-white parent">
   <div class="child-div">
      <div class="frame">
         <div class="div">
            <div class="div-2">
               <img
                  src="images/recordBug.png"
                  alt="recordBug"
                  class="titleImage"
               />
               <div class="title">Record bug</div>
            </div>
            {#if !isRecording}
               <StartRecord onrecordingEvent={setRecordingStatus} />
            {:else}
               <StopRecord onstoppingEvent={setStoppingStatus} />
            {/if}
         </div>
         <div class="icon-or-video">
            {#if !isVideoRecorded}
               <img
                  src="images/camera.png"
                  alt="camera"
                  class="webCameraImage"
               />
               <img
                  src="images/SmartphoneCamera.png"
                  alt="recordBug"
                  class="mobileCameraImage"
               />
               <p class="uploadVideo">You haven&#39;t uploaded a video yet</p>
            {:else}
               <Video {videoSrc} />
            {/if}
         </div>
         <div>
            <span class="error-message" id="videoError">{videoError}</span>
         </div>
      </div>
   </div>
</div>

<style>
   .titleImage {
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      display: flex;
   }

   @media (max-width: 768px) {
      .titleImage {
         width: 30px;
         height: 30px;
      }
   }

   .parent {
      margin-bottom: 15px;
      border-radius: 32px;
      padding: 20px 32px 16px 32px;
   }

   @media (max-width: 768px) {
      .parent {
         border-radius: 24px;
         padding: 20px 20px 16px 20px;
      }
   }

   .frame {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      background-color: var(--white);
   }

   .frame .div {
      align-items: flex-start;
      justify-content: space-between;
      align-self: stretch;
      width: 100%;
      flex: 0 0 auto;
      display: flex;
      position: relative;
      margin-bottom: 30px;
   }

   @media (max-width: 768px) {
      .frame .div {
         margin-bottom: 20px;
      }
   }

   .frame .div-2 {
      align-items: center;
      gap: 8px;
      flex: 1;
      flex-grow: 1;
      display: flex;
      position: relative;
   }

   .frame .title {
      position: relative;
      width: fit-content;
      font-family: "Poppins", Helvetica;
      font-weight: 600;
      color: var(--black);
      font-size: 20px;
      letter-spacing: 0;
      line-height: normal;
   }

   @media (max-width: 768px) {
      .frame .title {
         font-size: 16px;
      }
   }

   .frame .icon-or-video {
      display: flex;
      flex-direction: column;
      height: 60vh;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: relative;
      align-self: stretch;
      width: 100%;
      margin: 0 auto;
      background-color: var(--white);
      border: 0.5px solid transparent;
      background:
         linear-gradient(white 0 0) padding-box,
         linear-gradient(to right, #482969, #3c67b0) border-box;
      border-radius: 24px;
      overflow: hidden;
      font-size: var(--b1-font-size);
   }

   @media (max-width: 768px) {
      .frame .icon-or-video {
         font-size: 12px;
      }
   }

   .frame .uploadVideo {
      position: relative;
      width: fit-content;
      font-family: var(--b1-font-family);
      font-weight: var(--b1-font-weight);
      color: var(--black-85);
      font-size: var(--b1-font-size);
      text-align: center;
      letter-spacing: var(--b1-letter-spacing);
      line-height: var(--b1-line-height);
      font-style: var(--b1-font-style);
   }

   @media (max-width: 768px) {
      .frame .uploadVideo {
         font-size: var(--b2-font-size);
      }
   }

   .webCameraImage {
      display: block;
   }

   .mobileCameraImage {
      display: none;
   }

   @media (max-width: 768px) {
      .webCameraImage {
         display: none;
      }

      .mobileCameraImage {
         display: block;
      }
   }

   .error-message {
      color: red;
      font-size: 14px;
      display: none;
   }

   :root {
      --white: rgba(255, 255, 255, 1);
      --black: rgba(34, 34, 34, 1);
      --black-85: rgba(0, 0, 0, 0.85);
      --bottun-font-family: "Poppins", Helvetica;
      --bottun-font-weight: 500;
      --bottun-font-size: 16px;
      --bottun-letter-spacing: 0px;
      --bottun-line-height: normal;
      --bottun-font-style: normal;
      --b1-font-family: "Poppins", Helvetica;
      --b1-font-weight: 300;
      --b1-font-size: 16px;
      --b2-font-size: 12px;
      --b1-letter-spacing: 0px;
      --b1-line-height: normal;
      --b1-font-style: normal;
      --titles-font-family: "Poppins", Helvetica;
      --titles-font-weight: 600;
      --titles-font-size: 20px;
      --titles-letter-spacing: 0px;
      --titles-line-height: normal;
      --titles-font-style: normal;
      --sheddow-new: 2px 2px 4px 0px rgba(60, 103, 176, 0.25);
   }
</style>