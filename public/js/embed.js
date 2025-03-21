document.addEventListener('DOMContentLoaded', function () {
    const selectButtons = document.querySelectorAll('.select-track-btn');
  
  selectButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const trackId = event.target.getAttribute('data-track-id');
      const trackElement = event.target.closest('li');
      const trackName = trackElement.querySelector('img').alt;       const trackArtist = trackElement.querySelector('.artist-name').textContent; 
            updateTrackControls(trackId, trackName, trackArtist);
    });
  });

  function updateTrackControls(trackId, trackName, trackArtist) {
        const trackControlsDiv = document.getElementById('track-controls');
    trackControlsDiv.innerHTML = `
      <div id="player-container">
        <div id="track-name">${trackName} by ${trackArtist}</div>
        <div id="player">
          <button id="play-btn">▶ Play</button>
          <button id="pause-btn" style="display: none;">❚❚ Pause</button>
        </div>
      </div>
    `;

    const playButton = document.getElementById('play-btn');
    const pauseButton = document.getElementById('pause-btn');
    const trackUrl = `/tracks/oembed/${trackId}`;  
    fetch(trackUrl)
      .then(response => response.json())
      .then(oEmbedData => {
                const embedContainer = document.getElementById('player');
        embedContainer.innerHTML = oEmbedData.html;       })
      .catch(error => {
        console.error('Error fetching oEmbed data:', error);
      });

        let audio = new Audio(trackUrl); 
    playButton.addEventListener('click', () => {
      audio.play();
      playButton.style.display = "none";
      pauseButton.style.display = "inline-block";
    });

    pauseButton.addEventListener('click', () => {
      audio.pause();
      playButton.style.display = "inline-block";
      pauseButton.style.display = "none";
    });
  }
});
