<script>
   import ReportBugHeader from "./report/ReportBugHeader.svelte";
   import Title from "./report/Title.svelte";
   import Terms from "./report/Terms.svelte";
   import RecordBug from "./report/record/RecordBug.svelte";
   import Chat from "./report/addinfo/Chat.svelte";

   function isAdmin() {
      return true;
   }
</script>

<svelte:head>
   <meta charset="utf-8" />
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
   />
   <link
      rel="stylesheet"
      href="https://cdn.metroui.org.ua/v4.3.2/css/metro-all.min.css"
   />
</svelte:head>

{#if !isAdmin()}
   <div class="error-container">
      <p class="error-message">
         You do not have permission to access this page.
      </p>
   </div>
{:else}
   <div class="logo-envelope">
      <img src="images/ScalLogo.png" class="scal-logo" alt="ScalLogo" />
   </div>

   <div class="report">
      <div>
         <ReportBugHeader />
         <div class="report-inner-container">
            <div class="title-record-column">
               <Title />
               <RecordBug />
            </div>
            <div class="chat-terms-column">
               <Chat />
               <Terms />
            </div>
         </div>
      </div>
   </div>

   <div class="p-4">
      <p class="text-bold text-center">
         Copyright © Scal 2026 All Rights Reserved
      </p>
   </div>
{/if}

<style>
.logo-envelope {
   display: flex;           
   align-items: center;     
   height: 54px;
   margin: 20px;
   gap: 10px;               
}

.scal-logo {
   height: 100%;
}

.report-inner-container {
   display: flex;
   flex-wrap: wrap;
   width: 100%;
   flex-direction: row;
   gap: 2%;
}

.title-record-column {
   flex: 1 0 auto;
   width: 59%;
   height: auto;
}

.chat-terms-column {
   display: flex;
   flex-direction: column;
   width: 39%;
   align-items: stretch;
}

.report {
   margin: 25px 80px 0px 80px;
}

@media(max-width:768px){
   .logo-envelope {
      height: 50px;
      gap: 5px;
   }

   .report-inner-container {
      flex-direction: column;
      gap: 2%;
   }
   .title-record-column,
   .chat-terms-column {
      width: 100%;
      margin: 0;
   }
   .report {
      margin: 100px 40px 40px;
   }
   .scal-logo {
      height: 30px;
   }
}

:global(p) {
   font-size: 0.75em;
}

:global(body) {
   font-family: "Poppins", sans-serif;
   background: #f8f8f8 !important;
}

.error-container {
   text-align: center;
   margin-top: 50px;
}

.error-message {
   color: #3070b4;
   font-size: 1.2em;
   font-weight: bold;
}
</style>