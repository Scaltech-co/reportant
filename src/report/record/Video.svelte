<script>
  export let videoSrc;
</script>

<div class="video-container">
  <div class="bg-white p-4 win-shadow">
    <video
      src={videoSrc}
      poster="images/ScalLogo.png"
      autoplay
      controls
    >
      <!-- אם אין כתוביות, אפשר להשאיר ריק או להוסיף קובץ captions בעתיד -->
      <track kind="captions" src="" srclang="en" label="English" />
    </video>
  </div>
</div>

<style>
  .video-container {
    margin: 0 auto;
    margin-top: 2rem;
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 60vh;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
