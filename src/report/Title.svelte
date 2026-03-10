<script>
  import { titleInStore } from "./store.js";
  import { updateErrorMsg } from "./utils.js";
  
  let titleError = $state("");

  function validateTitle() {
    if (titleInStore.value.trim() === "") {
      titleError = "Title is required";
    } else {
      titleError = "";
    }
    updateErrorMsg('.text', 'titleError', titleError);
  }
</script>

<div class="container">
   <div class="titleImageContatiner">
    <img src="images/title.png" class="titleImage" alt="titleImage">
    <div class="title">Title</div>
   </div>
   <div class="inputContainer">
       <input placeholder="Type a title" bind:value={titleInStore.value} class="text" oninput={validateTitle}>
       <span class="error-message"  id="titleError">{titleError}</span>
   </div>
</div>

<style>
  .container {
      margin-bottom: 16px;
      height: 127px;
      background: white;
      border-radius: 32px;
      padding: 20px 32px 16px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
   }

   @media (max-width: 768px) {
      .container {
         margin-bottom: 15px;
         height: 130px;
         padding: 20px;
      }
   }

    .titleImageContatiner {
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      display: flex;
   }

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

   .title {
      color: #222222;
      font-size: 20px;
      font-weight: 600;
      word-wrap: break-word;
      flex-grow: 1;
   }

   @media (max-width: 768px) {
      .title {
         font-size: 16px;
      }
   }

   .text {
      font-size: 16px;
      align-self: stretch;
      height: 34px;
      padding-left: 32px;
      padding-right: 32px;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      border: 0.50px solid transparent;
      background: 
         linear-gradient(white 0 0) padding-box, 
         linear-gradient(to right, #482969, #3C67B0) border-box;
      justify-content: flex-start;
      align-items: center;
      display: inline-flex;
      width: 100%;
   }

   @media (max-width: 768px) {
      .text {
         height: 42px;
         font-size: 12px;
      }
   }

.error-message {
    position: absolute;
    bottom: -20px;
    left: 10px;
    color: red;
    font-size: 14px;
    display: none;
}

.inputContainer{
    position: relative;
    width: 100%;
}
</style>