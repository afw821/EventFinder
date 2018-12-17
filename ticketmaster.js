let cityName = ""; //'atlanta'
const displayEvents = function (e) {
    e.preventDefault();
    $('#eventDump').empty();
    const APIKey = 'epTJybwaqGagagV0AixUnakzqCbT5q0I';

    cityName = $('#eventCity').val();
    let eventSearchTerm = $('#eventName').val(); //'music'
    let startDate = $('#startDate').val(); //'2018-10-17'
    let endDate = $('#endDate').val(); //'2018-10-29'

    console.log(cityName);

    let queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${APIKey}&startDateTime=${startDate}T00:00:00Z&endDateTime=${endDate}T23:59:59Z&keyword=${eventSearchTerm}&city=${cityName}&size=5`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
     
        try {
            $('#eventResults').empty();
            
            for (let i = 0; i < response._embedded.events.length; i++) {

                $('#eventResults').append(`<div row><div col><div class="card" style="width: 18rem;">
                <img class="card-img-top" src="${response._embedded.events[i].images[0].url}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${response._embedded.events[i].name}</h5>
                  <p class="card-text">${response._embedded.events[i].dates.start.localDate} <br />
                  ${response._embedded.events[i]._embedded.venues[0].city.name}</p>
                  <a target="_blank" href="${response._embedded.events[i].url}" class="btn btn-primary">Click here to buy tickets</a>
                </div>  <p><button class="eventFlight btn flight-btn btn-primary" data-toggle="modal" data-target="#modalOpen" data-city="${response._embedded.events[i]._embedded.venues[0].city.name}">Find flight Info</button></p></div></div>
              </div>`);
                //cityName = response._embedded.events[i]._embedded.venues[0].city.name
                //console.log(cityName)
                const stateCode = response._embedded.events[i]._embedded.venues[0].state.stateCode;
               
            }
            $('.eventFlight').on('click', function () {
                cityName = $(this).attr('data-city');
              
                // $('#flightResults').append(`Enter leave date: <input id="leaveDate" type='text'/> Enter return date: <input id="returnDate" type="text"/>
                // Enter source city: <input type="text" id="srcDes"/><button id="flightSearch">Search them flights</button>`)
                $('.searchFlight').on('click', function () {   //this is the find flight modal
               
                    let date1 = $('#leaveDate').val();
                    let date2 = $('#returnDate').val();
                    const leaveDate = date1.replace(/-/g,"");
                    const returnDate = date2.replace(/-/g,"");
                    const srcCity = $('#srcDes').val();
                    console.log(srcCity);
                    const destAirportReq = cityName;
                    console.log('dest airport' + destAirportReq);
                    const srcAirportReq = srcCity;
                    Promise.all([destAirportReq, srcAirportReq]).then(function (responses) {
                        console.log('responses' + responses);
                        let iataDest = destAirportReq;
                        let iataSrc = srcAirportReq;
                        console.log(iataDest);
                        console.log(iataSrc);
                        getFlightInfo(iataSrc, iataDest, leaveDate, returnDate);
                    });
                })
            })
        } catch (error) {
            $('#eventResults').text('No events found');
        }
        //$('#eventFlight').on('click', airportcodeAjaxcall) need to find a way to respond
        //to the button and grab city name from whicher event is in that div

    })
}

$('#searchButton').on('click', displayEvents)
