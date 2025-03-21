document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('.playlist-form');

  forms.forEach((form) => {
    const select = form.querySelector('select');     const updateFormAction = () => {
      const playlistId = select.value;
      form.action = `/playlists/${playlistId}/`;     };

        updateFormAction();

        select.addEventListener('change', updateFormAction);
  });
});