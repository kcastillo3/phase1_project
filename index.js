document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch artist data from the JSON file
    fetch('http://localhost:3000/artists')
     .then(response => response.json())
     .then(artists => {
       renderArtists(artists);
       if (artists.length > 0) {
         showArtistDetails(artists[0]); // Display the first artist by default
       }
     })
     .catch(error => console.error('Error fetching artists:', error));
});

    // Function to render artists in the navigation
    function renderArtists(artists) {
        const artistsContainer = document.querySelector('.artists');

        artists.forEach(artist => {
            const artistItem = document.createElement('div');
            artistItem.classList.add('artist-item');
            artistItem.innerText = artist.name;

            artistItem.addEventListener('click', () => showArtistDetails(artist));

            artistsContainer.appendChild(artistItem);
        });
    }

    // Function to show artist details
    function showArtistDetails(artist) {
        const artistInfoSection = document.querySelector('.artist-info');
        const existingCommentsContainer = document.querySelector('.existing-comments');

        // Clear existing content
        artistInfoSection.innerHTML = '';
        existingCommentsContainer.innerHTML = '';

        // Display artist details
        const artistName = document.createElement('h2');
        artistName.innerText = artist.name;

        const artistDescription = document.createElement('p');
        artistDescription.innerText = artist.description;

        const artistImage = document.createElement('img');
        artistImage.src = artist.image;
        artistImage.alt = artist.name;

        const soundcloudLink = document.createElement('a');
        soundcloudLink.href = artist.soundcloudUrl;
        soundcloudLink.innerText = 'Listen on SoundCloud';

        artistInfoSection.appendChild(artistName);
        artistInfoSection.appendChild(artistDescription);
        artistInfoSection.appendChild(artistImage);
        artistInfoSection.appendChild(soundcloudLink);

        // Display comments
        const artistComments = artist.comments;

        artistComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.innerText = comment;

            existingCommentsContainer.appendChild(commentItem);
        });
    }

    // Function to handle comment submission
    document.getElementById('submitComment').addEventListener('click', function () {
        const commentInput = document.getElementById('commentInput');
        const newCommentText = commentInput.value;

        if (newCommentText.trim() !== '') {
            const existingCommentsContainer = document.querySelector('.existing-comments');

            const newCommentItem = document.createElement('div');
            newCommentItem.classList.add('comment-item');
            newCommentItem.innerText = newCommentText;

            existingCommentsContainer.appendChild(newCommentItem);

            // Clear the input field after submitting a comment
            commentInput.value = '';
        }
    });

    // Fetch artist data and render on page load
    fetchArtistData().then(artists => renderArtists(artists));

