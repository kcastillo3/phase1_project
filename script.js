document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/artists')
     .then(response => response.json())
     .then(artists => {
       populateArtistNav(artists);
       if (artists.length > 0) {
         updateArtistDetails(artists[0]); // Display the first artist by default
       }
     })
     .catch(error => console.error('Error fetching artists:', error));
});

function populateArtistNav(artists) {
    const nav = document.querySelector('.artists-nav .artists');
    nav.innerHTML = ''; // Clear existing artist elements
    artists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'artist-item';
        artistDiv.dataset.artistId = artist.id;
        artistDiv.innerHTML = `<img src="${artist.image}" alt="${artist.name}" />`;
        artistDiv.addEventListener('click', () => updateArtistDetails(artist));
        nav.appendChild(artistDiv);
    });
}

function updateArtistDetails(artist) {
    const artistInfoSection = document.querySelector('.artist-info');
    artistInfoSection.innerHTML = ''; // Clear the artist info section

    // Create new elements for the artist's details
    const artistImage = document.createElement('img');
    artistImage.src = artist.image;
    artistImage.alt = artist.name;
    artistInfoSection.appendChild(artistImage);

    const artistName = document.createElement('h2');
    artistName.textContent = artist.name;
    artistInfoSection.appendChild(artistName);

    const artistDescription = document.createElement('p');
    artistDescription.textContent = artist.description;
    artistInfoSection.appendChild(artistDescription);

    const audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.src = artist.soundcloudUrl;
    artistInfoSection.appendChild(audioPlayer);

    // Highlight the selected artist
    document.querySelectorAll('.artist-item').forEach(item => {
        item.classList.remove('selected');
        if(item.dataset.artistId == artist.id){
            item.classList.add('selected');
        }
    });

    // Update comments
    const commentsSection = document.querySelector('.comments-section');
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = ''; // Clear existing comments
    artist.comments.forEach(comment => {
        const commentElement = document.createElement('li');
        commentElement.textContent = comment;
        commentsList.appendChild(commentElement);
    });
}

document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const newComment = commentInput.value.trim();
    if (newComment) {
        const selectedArtistDiv = document.querySelector('.artist-item.selected');
        const artistId = selectedArtistDiv.dataset.artistId;
        addCommentToArtist(artistId, newComment);
        commentInput.value = ''; // Clear the input field
    } else {
        alert('Please enter a comment.');
    }
});

function addCommentToArtist(artistId, comment) {
    fetch(`http://localhost:3000/artists/${artistId}`)
     .then(response => response.json())
     .then(artist => {
       artist.comments.push(comment); // Add the new comment
       return fetch(`http://localhost:3000/artists/${artistId}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(artist),
       });
     })
     .then(response => response.json())
     .then(updatedArtist => {
       updateArtistDetails(updatedArtist); // Update the UI with the new artist details
     })
     .catch(error => console.error('Error updating artist comments:', error));
}

   