$(document).ready(function() {
  // ===============================================
  // Materialize JS

  // Materialize jQuery Dropdown effects
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false,
    hover: false,
    gutter: 0,
    belowOrigin: true,
    alignment: 'right',
    stopPropagation: false
  });

  // Materialize Parallax
  $('.parallax').parallax();

  // Materialize Collapsible
  $('.collapsible').collapsible();

  // Materialize Carousel
  $('.carousel.carousel-slider').carousel({ fullWidth: true });

  // ===============================================
  // API Calls
  // ===============================================


  // ===============================================
  // Events Section
  // ===============================================

  // Event Listener
  $('#events').click(function(e) {
    e.preventDefault();

    let activity = $('#activity').val()

    let location = $('#location').val()

    // Google Geocode API  (Obtaining lat and lng for given city)

    $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBZ9imHU9dHqUneptSnitcfLXYpMQPe3mg`,
      dataType: 'json',
      success: (data) => {
        let lat = data['results'][0]['geometry']['location']['lat']

        let lng = data['results'][0]['geometry']['location']['lng']

        // Meetup API for open events by category and location (lat and long)

        $.ajax({
          method: 'GET',
          url: `https://api.meetup.com/2/open_events.json?lat=${lat}&lon=${lng}&text=${activity}&radius=smart&key=594a79527746634d156775972484441`,
          dataType: 'jsonp',
          success: (events) => {
            let count = 0

            for (let i = 0; i < 5; i++) {
              count += 1

              let objects = events['results'][i]
              let name = objects['name']
              let desc = objects['description']
              let dist = objects['distance']
              let url = objects['event_url']

              $('#eventName' + count).text(name)
              $('#eventDesc' + count).html(desc)
              $('#eventDist' + count).text(dist.toFixed(2) + ' Miles Away')
              $('#href' + count).attr('href', url)
            }
          },

          error: () => {
            console.log('MeetUp error');
          }
        })
      },

      // End MeetUp

      error: () => {
        console.log('Geocode error');
      }
    })

    // End Google Maps Geocode
  })

    // End of Events Event Listener

  // ===============================================
  // Photos Section (Flickr API)
  // ===============================================

  $('#photos').click(function(e) {
    e.preventDefault();

    let activity = $('#activity').val()

    $.ajax({
      method: 'GET',
      url: `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5eb1290fad108fcb3f0ad12433f1695c&tags=${activity}&sort=relevance&safe_search=1&content_type=1&format=json&nojsoncallback=1`,
      dataType: 'json',
      success: (data) => {
        let count = 0

        let photo = data['photos']['photo']

        for (let i = 0; i < 5; i++) {
          count += 1

          let farm = photo[i]['farm']
          let id = photo[i]['id']
          let secret = photo[i]['secret']
          let server = photo[i]['server']

          let src = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`

          $('#photo' + count).attr('src', src)
        }
      },
      error: () => {
        console.log('flickr error');
      }
    })
  })

    // End Flickr

    // ===============================================
    // Equipment Section (Sierra Trading Post API)
    // ===============================================

  $('#gear').click(function(e) {
    e.preventDefault();

    let activity = $('#activity').val()

    $.ajax({
      method: 'GET',
      url: `http://api.sierratradingpost.com/api/1.0/products/search~${activity}/?sort=SearchRanking&api_key=dba71d51306d5a5553d22d616a922d83`,
      dataType: 'jsonp',
      success: (equipment) => {
        let count = 0

        for (let i = 0; i < 5; i++) {
          count += 1

          let gear = equipment['Result'][i]
          let name = gear['Name']
          let img = gear['Images']['PrimaryMedium']
          let price = gear['SuggestedRetailPrice']
          let desc = gear['DescriptionHtmlSimple']
          let rating = gear['Reviews']['AverageRating']
          let url = gear['AffiliateWebUrl']

          $('#gearName' + count).text(name)
          $('#gearImg' + count).attr('src', img)
          $('#gearPrice' + count).text('$' + price)
          $('#gearDesc' + count).html(desc)
          $('#gearRate' + count).text('Average Rating: ' + rating)
          $('#gearHref' + count).attr('href', url)
        }
      },

      error: () => {
        console.log('Sierra Trading Post error')
      }
    })
  })

    // End Sierra Trading Post

    // ===============================================
    // Books Section (Google Books API)
    // ===============================================

  $('#books').click(function(e) {
    e.preventDefault();

    let activity = $('#activity').val()

    $.ajax({
      method: 'GET',
      url: `https://www.googleapis.com/books/v1/volumes?q=${activity}&key=AIzaSyAfBw0XchRVK1lbYdTOK2uJraJgisb2o-M`,
      dataType: 'jsonp',
      success: (bookObject) => {
        let count = 0

        for (let i = 0; i < 5; i++) {
          count += 1

          let book = bookObject['items'][i]
          let title = book['volumeInfo']['title']
          let subtitle = book['volumeInfo']['subtitle']
          let authorArr = []
          let authorList = book['volumeInfo']['authors']

          if (authorList !== undefined) {
            for (let j = 0; j < authorList.length; j++) {
              let author = book['volumeInfo']['authors'][i]

              authorArr.push(author)
            }
          }

          let img = book['volumeInfo']['imageLinks']['smallThumbnail']
          let desc = book['volumeInfo']['description']
          let url = book['saleInfo']['buyLink']

          $('#bookTitle' + count).text(title + ': ' + subtitle)
          $('#bookImg' + count).attr('src', img)
          $('#bookDesc' + count).html(desc)
          $('#authors' + count).text('By: ' + authorArr)
          $('#bookHref' + count).attr('href', url)
        }
      },
      error: () => {
        console.log('Google Books error');
      }
    })
  })

    // End Google Books

// End 'document ready' function
})
