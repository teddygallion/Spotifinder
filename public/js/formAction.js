document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("playlist-form");
  const select = document.getElementById('playlist');

  select.addEventListener('change', function() {
    const playlistId = select.value;
    form.action = `/playlists/${playlistId}/`; 
  });

 
  const initialPlaylistId = select.value;
  form.action = `/playlists/${initialPlaylistId}/`;
});