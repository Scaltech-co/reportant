const jq = window.jQuery;

export function updateErrorMsg(inputSelector, errorElementId, errorMessage) {
    const inputElement = document.querySelector(inputSelector);
    const errorElement = document.getElementById(errorElementId);
    if (errorMessage) {
        // Display error message and set red outline
        inputElement.focus();
        errorElement.style.display = 'block'; // Show error message
        errorElement.textContent = errorMessage;
    } else {
        // If no error message, hide error message
        errorElement.style.display = 'none';
    }
}

export function resetErrorMessage() {
    const $errorElement = jq(".error-message");
    const $sendButton = jq(
        ""
    );
    updateErrorMsgChat("", $errorElement,$sendButton , "");
}

export function updateErrorMsgChat($inputSelector, $errorElement, $sendButton, errorMessage) {
    if (errorMessage !== "") {
        $inputSelector.focus();
        $errorElement.show();
        $errorElement.text(errorMessage);
        $sendButton.prop('disabled', true);
    } else {
        $errorElement.hide();
        $errorElement.text("");
        $sendButton.prop('disabled', false);
    }
}