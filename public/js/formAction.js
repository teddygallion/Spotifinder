document.addEventListener('DOMContentLoaded', function () {
  // Get all playlist forms
  const forms = document.querySelectorAll('.playlist-form');

  forms.forEach((form) => {
    const select = form.querySelector('select'); // Get the dropdown inside the form
    const updateFormAction = () => {
      const playlistId = select.value;
      form.action = `/playlists/${playlistId}/`; // Update the form action
    };

    // Set the initial form action
    updateFormAction();

    // Update the form action when the dropdown changes
    select.addEventListener('change', updateFormAction);
  });
});