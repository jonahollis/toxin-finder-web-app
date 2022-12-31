//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value
  console.log(choice)
  const url = `https://gtfo-cors--timmy_i_chen.repl.co/get?url=https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${choice}/JSON`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        
        document.getElementById('name').innerText = data[0].FACILITY_NAME

        document.getElementById('parent-co').innerText = data[0].PARENT_CO_NAME

        document.getElementById('street').innerText = data[0].MAIL_STREET_ADDRESS

        document.getElementById('town').innerText = data[0].MAIL_CITY

        document.getElementById('zip-state').innerText = `${data[0].MAIL_ZIP_CODE} ${data[0].MAIL_STATE_ABBR}`

        console.log(data[0].FACILITY_NAME)

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}


// https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/600/JSON
