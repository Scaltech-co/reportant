<script>
    import { termsAgreeInStore } from "./store.js";
    import { updateErrorMsg } from "./utils.js";
    import Download from "./submit/download/Download.svelte";
    import SendEmail from "./submit/sendEmail/SendEmail.svelte";

    let termsAgreeError = $state("");

    const termsUrl = 'https://scaltech.co/Reportant_Terms_and_Privacy.pdf';

    function validateTerms() {
        if (termsAgreeInStore.value === false) {
            termsAgreeError = "Terms-agree is required";
        } else {
            termsAgreeError = "";
        }
        updateErrorMsg('.checkbox', 'termsAgreeError', termsAgreeError);
    }
</script>

<div class="container">
    <div class="terms-container">
        <div class="agree-policy">
            <input type="checkbox" id="termsAgree" name="termsAgree" class="checkbox" bind:checked={termsAgreeInStore.value} onchange={validateTerms}/>
            <label for="termsAgree" class="terms-label">
                By sending this report, you agree to Scal's access of
                the data necessary to respond to this problem, subject
                to Scal's
                <a href="{termsUrl}" target="_blank" rel="noopener noreferrer">Terms & Privacy Policy</a>
            </label>
            <span class="error-message" id="termsAgreeError">{termsAgreeError}</span>
        </div>

        <div class="action-buttons">
            <Download />
            <SendEmail />
        </div>
    </div>
</div>

<style>
.terms-container {
    display: flex;
    flex-direction: column;
    align-items: stretch; 
    width: 100%; 
    margin-top: 20px; 
}

.agree-policy {
    display: flex;
    align-items: center;
    margin-bottom: 10px; 
    position: relative;
}

.agree-policy input[type="checkbox"] {
    margin-right: 10px;
    margin-top: -7px; 
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 20px;
    height: 20px;
    border: 1px solid #482969;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}

@media (max-width: 768px) {
    .agree-policy input[type="checkbox"] {
        width: 16px;
        height: 16px;
    }
}

.agree-policy input[type="checkbox"]:checked {
    background-image: url("images/checkbox.png");
    background-size: calc(100% - 6px);
    background-repeat: no-repeat;
    background-position: center;
}

.agree-policy .terms-label {
    font-size: 11px;
    margin-top: 0px;
}

.agree-policy .terms-label a {
    color: rgba(60, 103, 176, 1);
    text-decoration: none;
}

.action-buttons {
    display: flex;
    gap: 16px;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end; 
    margin-top: 10px; 
}

@media (max-width: 768px) {
    .terms-container {
        width: 100%; 
        margin-top: 10px;
    }

    .action-buttons {
        justify-content: center;
        width: 100%;
        margin-top: 10px;
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

@media (max-width: 480px) {
    .agree-policy input[type="checkbox"] {
        width: 14px;
        height: 14px;
        border-radius: 2px;  
        aspect-ratio: 1 / 1; 
    }
}
</style>
