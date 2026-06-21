<script>
  import {titleInStore,videoSrcInStore,getMessages,termsAgreeInStore,isRecordingStore} from "../../store.js";
  import {generatePrefix,generateSuffix,returnEmailByClass,} from "../FileFunctions.js";
  import { updateErrorMsg, resetErrorMessage,  updateErrorMsgChat, } from "../../utils.js";
  import { questions } from "../../addinfo/questions.js";
  import { validateEmail } from "../../validation/validation.js";
  import DOMPurify from 'dompurify';

  const jq = window.jQuery;
  const csrfToken = window.reportant_csrf_nonce;
  let titleError = "",
      termsAgreeError = "";
  let errorVideoMsg = "";

  function sendEmail() {
    resetErrorMessage();
    if (!csrfToken) {
     alert(" Your session may have expired or this request is invalid.\nPlease refresh the page and try again.");
     return;
    }  
    if (!titleInStore.value || titleInStore.value.trim() === "") {
      titleError = "Title is required";
      updateErrorMsg(".text", "titleError", titleError);
      return;
    }
    if (termsAgreeInStore.value === false) {
      termsAgreeError = "Terms-agree is required";
      updateErrorMsg(".checkbox", "termsAgreeError", termsAgreeError);
      return;
    }
    if (isRecordingStore.value) {
      errorVideoMsg = "Recording is still in progress. Stop the recording before submitting.";
      updateErrorMsg('.icon-or-video', 'videoError', errorVideoMsg);
      return;
    }
    if (!videoSrcInStore || videoSrcInStore.size === 0) {
      errorVideoMsg = "Recording is required.";
      updateErrorMsg('.icon-or-video', 'videoError', errorVideoMsg);
      return;
    }
    if (!validateMessages() || !validateEmailBeforSend()) {
      return;
    }   
    titleError = "";
    termsAgreeError = "";
    updateErrorMsg(".text", "titleError", titleError);
    updateErrorMsg(".checkbox", "termsAgreeError", termsAgreeError);
    let emailToSend = returnEmailByClass("emailSendTo");
    let emailResponseTo = returnEmailByClass("emailResponseTo");

    const formData = new FormData();
    formData.append("prefix", generatePrefix());
    formData.append("suffix", generateSuffix());
    formData.append("title", DOMPurify.sanitize(titleInStore.value || ""));
    formData.append("emailSendTo", emailToSend);
    formData.append("emailResponseTo", emailResponseTo);
    formData.append("videoSrcInStore", $videoSrcInStore, "video.webm");
    formData.append("chatInStore", JSON.stringify(getMessages()));

    fetch("/wp-json/reportant/v1/send-email", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
      },

      body: formData,
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.statusText);
      }
        return response;
    })
    .then((data) => {
        console.log(data);
        var html_content =
          "<h1>Thank you!</h1>" +
          "<h4><span class='mif-checkmark mif-lg fg-green'></span> Your report has been sent&nbsp;&nbsp;&nbsp;</h4>";
        Metro.infobox.create(html_content);
    })
    .catch((error) => {
        console.error("Error:", error);
        var html_content =
          "<h1>An error occurred</h1>" +
          "<h4><span class='mif-cross mif-lg fg-red'></span> Your report has not been sent&nbsp;&nbsp;&nbsp;</h4>" +
          '<div data-role="accordion" data-one-frame="false">' +
          '<div class="frame">' +
          '<div class="heading">Click here for more information</div>' +
          '<div class="content">' +
          `<div class="content p-2">${error.message}</div>` +
          "</div>" +
          "</div>";
        Metro.infobox.create(html_content);
    });
  }

  function validateEmailBeforSend() {
    const errorMessageHTML =
      '<div class="error-message" style="display: none; color: red; font-size: 14px; margin-top: 0.6px;"></div>';
    const $sendButton = jq("");
    const messages = getMessages();
    for (let i = 0; i < messages.length; i++) {
      if (i + 1 < messages.length) {
        if (
          messages[i].class === "emailSendTo" ||
          messages[i].class === "emailResponseTo"
        ) {
          const email = messages[i + 1].text;
          const $input = jq(`#${messages[i + 1].id}`);
          const $errorElement = jq(errorMessageHTML);
          $input.after($errorElement);

          if (!validateEmail(email)) {
            $input.attr("tabindex", "-1");
            updateErrorMsgChat(
              $input,
              $errorElement,
              $sendButton,
              "Invalid email address"
            );
            $input.focus();
            return false;
          }
        }
      }
    }
    return true;
  }

  function validateMessages() {
    const messages = getMessages();

    if (messages.length < questions.length * 2) {
      const $input = jq(".message-input input[data-role=input]");
      const $existingError = $input
        .parent()
        .parent()
        .find(".error-message:visible");

      if ($existingError.length === 0) {
        const errorMessageHTML =
          '<div class="error-message" style="color: red; font-size: 14px; margin-top: 5px;">You have not answered all the questions.</div>';
        const $errorElement = jq(errorMessageHTML);
        $input.parent().parent().append($errorElement);

        $errorElement.show();
      }

      return false;
    }

    const $existingError = jq(".message-input").find(".error-message");
    if ($existingError.length > 0) {
      $existingError.remove();
    }

    return true;
  }
</script>

<button onclick={sendEmail}>
  <img src="images/submit.png" alt="download" />
  Send Report
</button>

<style>
 button {
  display: block;
  color: white;
  background: linear-gradient(94deg, #482969 3%, #3c67b0 100%);
  height: 52px;
  width: 160px;
  border-radius: 32px;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  border: none; 
  outline: none;
  transition: transform 0.2s ease, outline 0.2s ease;
}

button:focus,
button:hover {
  outline: 2px solid #482969;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  button {
    font-size: 12px;
    height: 36px;
    width: 130px;
  }
}
</style>