document.addEventListener('DOMContentLoaded', () => {
fetch('http://localhost:3000/artists')
    .then(response => response.json())
    .then(artists => {
    populateArtistNav(artists);
    if (artists.length > 0) {
        updateArtistDetails(artists[0]);
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

    // Add event listeners for mouse events
    artistItem.addEventListener('mouseover', () => handleMouseOver(artistItem));
    artistItem.addEventListener('mouseleave', () => handleMouseLeave(artistItem));

    // Show artist details when the artist item is clicked
    artistItem.addEventListener('click', () => updateArtistDetails(artist));

    artistsContainer.appendChild(artistItem);
});
}

// Handle mouseover event
function handleMouseOver(element) {
element.classList.add('hover-ring');
}

// Handle mouseleave event
function handleMouseLeave(element) {
element.classList.remove('hover-ring');
}

// Populate the artist navigation
function populateArtistNav(artists) {
const nav = document.querySelector('.artists-nav .artists');
nav.innerHTML = ''; // Clear existing artist elements

artists.forEach(artist => {
    const artistDiv = document.createElement('div');
    artistDiv.className = 'artist-item';
    artistDiv.dataset.artistId = artist.id;
    artistDiv.innerHTML = `<img src="${artist.image}" alt="${artist.name}" />`;

    // Add event listeners for click and mouse events
    artistDiv.addEventListener('click', () => updateArtistDetails(artist));
    artistDiv.addEventListener('mouseover', () => handleMouseOver(artistDiv));
    artistDiv.addEventListener('mouseleave', () => handleMouseLeave(artistDiv));

    nav.appendChild(artistDiv);
});
}

// Update artist details
function updateArtistDetails(artist) {
const artistInfoSection = document.querySelector('.artist-info');
artistInfoSection.innerHTML = ''; 

// Create new elements for the artist's details
const artistImage = document.createElement('img');
artistImage.src = artist.image;
artistImage.alt = artist.name;
artistInfoSection.appendChild(artistImage);

// Create a container for the name and genre
const nameGenreContainer = document.createElement('div');
nameGenreContainer.className = 'name-genre-container';

// Artist's Name
const artistName = document.createElement('h2');
artistName.className = 'artist-name';
artistName.textContent = artist.name;
nameGenreContainer.appendChild(artistName);

// Artist's Genre
const artistGenre = document.createElement('span');
artistGenre.className = 'artist-genre';
artistGenre.textContent = artist.genre;
nameGenreContainer.appendChild(artistGenre);

artistInfoSection.appendChild(nameGenreContainer);

const artistDescription = document.createElement('p');
artistDescription.textContent = artist.description;
artistInfoSection.appendChild(artistDescription);

// Embedding the SoundCloud track using iframe
const iframe = document.createElement('iframe');
iframe.style.width = "40%";
iframe.style.height = "166px"; 
iframe.frameBorder = "0";
iframe.allow = "autoplay";
iframe.src = `https://w.soundcloud.com/player/?url=${artist.soundcloudUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
artistInfoSection.appendChild(iframe);

// Highlight the selected artist
document.querySelectorAll('.artist-item').forEach(item => {
    item.classList.remove('selected');
    if(item.dataset.artistId == artist.id){
    item.classList.add('selected');
    }
});

// Update comments
const commentsSection = document.querySelector('.comments-section');
const commentsList = document.querySelector('.existing-comments');
commentsList.innerHTML = ''; 
artist.comments.forEach(comment => {
    const commentElement = document.createElement('li');
    commentElement.textContent = comment;
    commentsList.appendChild(commentElement);
});
}

// Form Submit
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const commentInput = document.getElementById('commentInput');
    const newComment = commentInput.value.trim();
  
    if (newComment) {
      const selectedArtistDiv = document.querySelector('.artist-item.selected');
      const artistId = selectedArtistDiv ? selectedArtistDiv.dataset.artistId : null;
  
      if (artistId) {
        addCommentToArtist(artistId, newComment);
        commentInput.value = ''; 
      } else {
        alert('Please select an artist to comment on.');
      }
    } else {
      alert('Please enter a comment.');
    }
  });

// Add Comment To Artist
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
    updateArtistDetails(updatedArtist); 
})
.catch(error => console.error('Error updating artist comments:', error));
}