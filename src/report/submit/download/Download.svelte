<script>
    import { titleInStore } from "../../store.js";
    import { fileContentFactory } from "./freeAndPro/fileFactory.js";
    import { updateErrorMsg } from "../../utils.js";

    const file = fileContentFactory();
    let titleError = "";

    async function download() {
        if (!titleInStore.value || titleInStore.value.trim() === "") {
            titleError = "Title is required";
            updateErrorMsg('.text', 'titleError', titleError);
            return;
        }
        titleError = "";
        updateErrorMsg('.text', 'titleError', titleError);
        await file.download();
    }
   
</script>

<button onclick={download}>
    <img src="images/download.png" alt="download" />
    Download
</button>

<style>
    button {
        display: block;
        background-color: white;     
        color: #482969;              
        height: 52px;
        width: 160px;
        border-radius: 32px;
        cursor: pointer;
        font-weight: 400;
        font-size: 16px;
        border: 0.5px solid #482969;  
        transition: transform 0.2s ease, outline 0.2s ease;
    }

    button:focus,
    button:hover {
        background-color: white;     
        color: #482969;              
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

