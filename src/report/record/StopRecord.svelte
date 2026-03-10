<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let { onstoppingEvent } = $props();

  function stopRecord() {
    // Use prop callback or dispatch event  
    if (onstoppingEvent) {
      onstoppingEvent();
    } else {
      dispatch('stoppingEvent');
    }
  }
</script>

<button onclick={stopRecord} class="stopRecordButton">
  <img src="images/stopRecord.png" alt="stopRecord" class="stopRecordIcon"/>
  Stop recording
</button>

<style>
   .stopRecordButton {
      all: unset;
      box-sizing: border-box;
      display: flex;
      width: 170px;
      height: 52px;
      align-items: center;
      justify-content: center;
      gap: 4px;
      position: relative;
      background-color: #ce352c;
      border-radius: 32px;
      overflow: hidden;
      font-size: 16px;
      color: #ffffff;
   }

   @media (max-width: 768px) {
      .stopRecordButton {
         width: 126px;
         height: 36px;
         font-size: 12px;
      }
   }

   .stopRecordIcon{
      height: 20px;
   }

   @media (max-width: 768px) {
      .stopRecordIcon {
         height: 16px;
      }
   }
</style>