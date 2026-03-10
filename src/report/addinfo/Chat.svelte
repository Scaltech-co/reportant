<script>
  import { onMount } from "svelte";
  import * as store from "../store.js";
  import { questions } from "./questions.js";
  import DOMPurify from "dompurify";

  import { resetErrorMessage, updateErrorMsgChat } from "../utils.js";
  import { validateEmail } from "../validation/validation.js";

  const jq = window.jQuery;
  
  let currentIndex = $state(1);
  let chatContainer = $state();
  let editButtonTimeout = $state();
  let isEditButtonAdded = $state(false);

  onMount(() => {
    document.getElementById("chat").addEventListener("send", saveUserMessage);
    chatContainer = document.getElementById("chat");
    addFirstMessage();
    customizeChatUI();
    addEditButtonToText();

    (() => {
      const css = `
        .chat .message .message-time{
          width:100% !important;
          position:static !important;
          margin:0 0 6px 0 !important;
          line-height:1 !important;
          opacity:.7 !important;
          text-align:left !important;
          pointer-events:none !important;
        }
        .chat .message.right .message-time{ text-align:right !important; }
      `;
      let s = document.getElementById('chat-fix');
      if (!s) { 
        s = document.createElement('style'); 
        s.id='chat-fix'; 
        document.head.appendChild(s); 
      }
      s.textContent = css;

      function normalizeMessageDom(root = document.getElementById('chat')) {
        if (!root) return;
        root.querySelectorAll('.message .message-text .message-time').forEach(t => {
          const msg = t.closest('.message');
          const item = msg?.querySelector('.message-item');
          if (msg && item && t.parentElement !== msg) {
            msg.insertBefore(t, item); 
          }
        });
      }

      normalizeMessageDom();

      const host = document.getElementById('chat');
      if (host && !host._timeFixObserver) {
        const obs = new MutationObserver(() => normalizeMessageDom(host));
        obs.observe(host, { childList: true, subtree: true });
        host._timeFixObserver = obs;
      }
    })();
  });

  function addFirstMessage() {
    var FirstMessage = {
      time: new Date(),
      avatar: "images/ScalChat.png",
      text: questions[0].text,
      position: "left",
      class: questions[0].class,
    };
    store.addMessage(FirstMessage);
  }

  function customizeChatUI() {
    const observer = new MutationObserver(() => {
      jq("img.message-avatar").prop("src", "images/ScalChat.png");
      const button = jq(
        "button.button.input-custom-button.buttonSend.js-chat-send-button"
      );
      button.empty();
      button.append(`<img src="images/SendMsg.png" alt="Button Image">`);

      const input = jq(".message-input input[data-role=input]");
      input.attr("placeholder", "Type your message...");
      addValidation(validateInputFromHtml);
      addValidation(validateInputFromEmail);
      observer.disconnect();
    });
    observer.observe(document.getElementById("chat"), {
      childList: true,
      subtree: true,
    });
  }

  function saveUserMessage(event) {
    const userMessage = event.detail.msg;
    const sanitizedUserText = DOMPurify.sanitize(userMessage.text);
    const sanitizedUserMessage = {
      ...userMessage,
      text: sanitizedUserText,
    };
    event.detail.msg = sanitizedUserMessage;
    store.addMessage(sanitizedUserMessage);
    addSystemMessage();
  }
  
  function styleButton(button) {
    button.style.borderRadius = "24px";
    button.style.backgroundColor = "white";
    button.style.padding = "10px";
    button.style.width = "100px";
    button.style.height = "30px";
    button.style.gap = "10px";
    button.style.position = "relative";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
  }

function addSystemMessage() {
  var chat = Metro.getPlugin("#chat", "chat");

  if (currentIndex < questions.length) {
    const nextQuestion = questions[currentIndex];
    currentIndex += 1;
    if (
      nextQuestion.class !== "emailSendTo" &&
      nextQuestion.class !== "emailResponseTo"
    ) {
      resetErrorMessage();
    }

    setTimeout(() => {
      const questionSystemMessage = {
        time: new Date(),
        avatar: "images/ScalChat.png",
        text: nextQuestion.text,
        position: "left",
        class: nextQuestion.class,
        options: nextQuestion.options || [] 
      };

      store.addMessage(questionSystemMessage);
      chat.add(questionSystemMessage);

        if (nextQuestion.options) {
          const optionsSystemMessage = {
            time: new Date(),
            avatar: "images/ScalChat.png",
            text: "",
            position: "left",
          };

        const container = document.createElement("div");

        function createStyledButton(optionText) {
          const button = document.createElement("button");
          button.textContent = optionText;
          styleButton(button);

          switch (optionText) {
            case "High":
              button.style.border = "0.5px solid rgb(206, 53, 44)";
              button.style.color = "rgb(206, 53, 44)";
              break;
            case "Medium":
              button.style.border = "0.5px solid rgb(206, 171, 44)";
              button.style.color = "rgb(206, 171, 44)";
              break;
            case "Low":
              button.style.border = "0.5px solid rgb(98, 216, 78)";
              button.style.color = "rgb(98, 216, 78)";
              break;
            case "Yes":
              button.style.border = "0.5px solid rgb(98, 216, 78)";
              button.style.color = "rgb(98, 216, 78)";
              break;
            case "No":
              button.style.border = "0.5px solid rgb(206, 53, 44)";
              button.style.color = "rgb(206, 53, 44)";
              break;
          }

          return button;
        }

        nextQuestion.options.forEach(optionText => {
          const btn = createStyledButton(optionText);
          container.appendChild(btn);
        });

          store.addMessage(optionsSystemMessage);
          chat.add(optionsSystemMessage);

        requestAnimationFrame(() => {
          const messageTexts = chatContainer.querySelectorAll(".message .message-text");
          const last = messageTexts[messageTexts.length - 1];
          if (last) {
            last.textContent = "";
            last.appendChild(container);
          }
        });

        if (!chatContainer._buttonClickListenerAdded) {
          chatContainer.addEventListener("click", (event) => {
            const target = event.target;
            if (target.tagName === "BUTTON") {
              const userSystemMessage = {
                time: new Date(),
                avatar: "images/UserChat.png",
                text: target.textContent,
                position: "right"
              };
              store.addMessage(userSystemMessage);
              chat.add(userSystemMessage);
              addSystemMessage(); 
            }
          });
          chatContainer._buttonClickListenerAdded = true;
        }
      }
    }, 1000);
  }
}

  function addValidation(validationFunction) {
    const input = jq(".message-input input[data-role=input]");
    const errorMessageHTML =
      '<div class="error-message" style="display: none; color: red; font-size: 14px; margin-top: 5px;"></div>';
    const errorElement = jq(errorMessageHTML);
    input.parent().parent().append(errorElement);
    const sendButton = jq(
      "button.button.input-custom-button.buttonSend.js-chat-send-button"
    );
    input.on("input", function (event) {
      const userInput = event.target.value;
      validationFunction(input, errorElement, sendButton, userInput);
    });
  }

  function validateInputFromEmail(
    input,
    errorElement,
    sendButton,
    userInput
  ) {
    const currentQuestion = store.getMessages().slice(-1)[0];
    if (
      currentQuestion &&
      (currentQuestion.class === "emailSendTo" ||
        currentQuestion.class === "emailResponseTo")
    ) {
      const isValidEmail = validateEmail(userInput);
      if (!isValidEmail) {
        updateErrorMsgChat(
          input,
          errorElement,
          sendButton,
          "Invalid email address"
        );
      } else {
        updateErrorMsgChat(input, errorElement, sendButton, "");
      }
    }
  }

  function validateInputFromHtml(
    $input,
    $errorElement,
    $sendButton,
    userInput
  ) {
    const htmlRegex = /<[^>]*>/g;
    const containsHTML = htmlRegex.test(userInput);
    const sanitizedInput = DOMPurify.sanitize(userInput, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    if (userInput !== sanitizedInput || containsHTML) {
      updateErrorMsgChat(
        $input,
        $errorElement,
        $sendButton,
        "HTML tags are not allowed"
      );
    } else {
      updateErrorMsgChat($input, $errorElement, $sendButton, "");
    }
  }

  function addEditButtonToText() {
    const textElement = document.getElementById("chat");
    textElement.addEventListener("mouseover", showEditButton);
    textElement.addEventListener("mouseout", hideEditButton);
    
    function showEditButton(event) {
      if (
        event.target.classList.contains("message-text") &&
        event.target.classList.contains("rightMessage3") &&
        !isEditButtonAdded &&
        !event.relatedTarget?.classList.contains("edit-button")
      ) {
        clearTimeout(editButtonTimeout);
        const editButton = document.createElement("button");
        styleButton(editButton);
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", editText);
        event.target.appendChild(editButton);
        isEditButtonAdded = true;
      }
    }
    
    function hideEditButton(event) {
      if (
        !event.relatedTarget ||
        !event.relatedTarget.classList.contains("edit-button")
      ) {
        isEditButtonAdded = false;
        const editButton = event.target.querySelector(".edit-button");
        if (editButton) {
          editButton.remove();
        }
      }
    }

    function editText(event) {
      event.stopPropagation();
      const textToEdit = event.target.parentNode.textContent.replace(
        "Edit",
        ""
      );
      const messageElement = event.target.closest(".message");
      const messageId = messageElement.id;
      const newText = prompt("Edit text:", textToEdit);

      if (newText !== null) {
        event.target.parentNode.textContent = newText;
        store.editMessage(messageId, newText);
        if (validateEmail(newText)) {
          const errorElement = jq(messageElement)
            .nextAll(".error-message")
            .first();
          const sendButton = jq("");
          updateErrorMsgChat("", errorElement, sendButton, "");
        }
      }
    }
  }
</script>

<div class="chat-container">
  <div class="chat-wrapper">
    <div class="frame-5">
      <img class="scalbot-img" src="images/scalbot.png" alt="scalbot" />
      <div class="scalbot-title">ReportantBot</div>
    </div>
  </div>

  <div
    id="chat"
    class="mx-auto"
    data-role="chat"
    data-height="100%"
    data-name=""
    data-title=""
    data-welcome={questions[0].text}
    data-avatar="images/UserChat.png"
    message-sender=""
    data-cls-chat="frameChat"
    data-cls-time="timeText"
    data-cls-message-left="leftMessage3"
    data-cls-message-right="rightMessage3"
    data-cls-send-button="buttonSend"
  ></div>
  <div
    class="error-message"
    style="display: none; color: red; font-size: 14px; margin-top: 5px;"
  >
    HTML tags are not allowed.
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(257px + 60vh);
    align-items: flex-start;
    position: relative;
    border-radius: 32px;
    overflow: hidden;
  }

  #chat {
    flex: 1;
    width: 100%;
    max-height: 100vh;
    overflow-y: auto;
  }

  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: auto;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    padding: 10px 32px;
    position: relative;
    align-self: stretch;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgb(72, 41, 105) 3.38%,
      rgb(60, 103, 176) 100%
    );
  }
  @media (max-width: 768px) {
    .chat-wrapper {
      height: 52px;
    }
  }
  .frame-5 {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    position: relative;
    flex: 0 0 auto;
  }
  .scalbot-title {
    position: relative;
    width: fit-content;
    font-family: "Poppins", Helvetica;
    font-weight: 600;
    color: var(--white);
    font-size: 20px;
    letter-spacing: 0;
    line-height: normal;
  }
  @media (max-width: 768px) {
    .scalbot-title {
      font-size: 16px;
    }
  }
  .scalbot-img {
    position: relative;
    width: 42px;
    height: 42px;
  }
  .error-message {
    display: none;
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }

  :global(.chat .message .message-item .message-text::before) {
    border: 0px solid transparent !important;
  }
  :global(.chat .title) {
    border-bottom: 0px solid #dfdfdf !important;
  }
  :global(.input) {
    align-self: center !important;
    margin-right: auto !important;
    margin-left: -25px !important;
    max-width: 290px !important;
    width: 100% !important;
    border-radius: 10px !important;
    border-color: #482969 !important;
  }

  :global(.chat .message .message-sender) {
    display: none !important;
  }

  :global(.input input[type="text"]) {
    height: 100% !important;
    margin: auto !important;
    font-size: var(--b1-font-size) !important;
    font-family: var(--b1-font-family) !important;
    padding: 12px 18px !important;
  }

  @media (max-width: 768px) {
    :global(.input input[type="text"]) {
      font-size: var(--b2-font-size) !important;
    }
  }

  :global(.input input) {
    background-color: transparent !important;
  }

  :global(.buttonSend) {
    display: flex !important;
    width: 50px !important;
    height: 50px !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
    padding: 10px !important;
    position: relative !important;
    cursor: pointer !important;
    border: none !important;
    background: none !important;
  }
  :global(.input .button-group) {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
  }
    :global(.leftMessage3) {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 4px !important;
    padding: 5px 10px !important;
    position: relative !important;
    flex: 1 !important;
    flex-grow: 1 !important;
    background-color: var(--white) !important;
    border-radius: 10px !important;
    border: 0.2px solid !important;
    border-color: rgb(225, 224, 224) !important;

    width: 220px !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;

    position: relative !important;
    align-self: stretch !important;
    margin-top: -0.5px !important;
    font-family: var(--b1-font-family) !important;
    font-weight: var(--b1-font-weight) !important;
    color: var(--black) !important;
    font-size: var(--b1-font-size) !important;
    letter-spacing: var(--b1-letter-spacing) !important;
    line-height: var(--b1-line-height) !important;
    font-style: var(--b1-font-style) !important;
  }

  @media (max-width: 768px) {
    :global(.leftMessage3) {
      font-size: var(--b2-font-size) !important;
    }
  }

  :global(.chat .message .message-time) {
    width: 100% !important;
    font-size: 12px;
    text-align: left !important;
    order: -1 !important;
    opacity: 1;
    position: static !important;
    margin: 0 0 4px 0 !important;
    line-height: 1;
    z-index: 0 !important;
  }

  :global(.chat .message .message-text) {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    position: relative !important;
  }

  :global(.frameChat) {
    overflow-y: auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 16px !important;
    padding: 30px !important;
    position: relative !important;
    background-color: var(--white) !important;
    border: none !important;
  }

  :global(.rightMessage3) {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 4px !important;
    padding: 5px 10px !important;
    position: relative !important;
    flex: 1 !important;
    flex-grow: 1 !important;
    background-color: var(--gray-background) !important;
    border-radius: 10px;
    border: 0.2px solid;
    border-color: transparent;
    border-color: #482969 !important;
    width: 220px !important;

    position: relative !important;
    align-self: stretch !important;
    margin-top: -0.5px !important;
    font-family: var(--b1-font-family) !important;
    font-weight: var(--b1-font-weight) !important;
    color: var(--black) !important;
    font-size: var(--b1-font-size) !important;
    letter-spacing: var(--b1-letter-spacing) !important;
    line-height: var(--b1-line-height) !important;
    font-style: var(--b1-font-style) !important;
  }
  :global(.buttonSend) {
    display: flex !important;
    width: 50px !important;
    height: 50px !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
    padding: 10px !important;
    position: relative !important;
    cursor: pointer !important;
    border: none !important;
    background: none !important;
    margin-top: -8px !important;
    margin-right: -50px !important;
  }
  :global(.button img) {
    height: 30px !important;
  }

  :global(.chat .message .message-item img.message-avatar) {
    border-radius: 50%;
    border: 0.1px solid rgb(225, 224, 224) !important;
    width: 30px !important;
    height: 30px !important;
  }

:global(.edit-button) {
  background-color: white !important;  
  color: #6a0dad !important;           
  border: 2px solid #6a0dad !important; 
  padding: 5px 12px !important;
  font-size: 14px !important;
  cursor: pointer !important;
  border-radius: none !important;
  font-weight: bold !important;
}

  :global(.edit-button:hover) {
    background-color: #542285 !important; 
    color: white !important; 
  }
</style>
