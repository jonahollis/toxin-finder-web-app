document.querySelector('#zipbutton').addEventListener('click', getFetch)

function getFetch(){
  document.getElementById('spinner').innerHTML =	`<div class="d-flex justify-content-center m-5">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  </div>`

  const zipcode = document.querySelector('input').value
  console.log(zipcode)
  const url = `https://bypass-cors.j0n4h.repl.co/get?url=https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${zipcode}/JSON`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)

        document.getElementById('spinner').innerHTML =	''

        document.querySelector('#result-header').innerHTML = `<h2>Results: ${data.length}</h2>`

        for(i = 0; i < data.length; i++){

          let count = 1

          const apiResults = item => 
            `<tr>
            <th scope="col">${count++}</th>
            <td><b>${item.FACILITY_NAME}</b><br>EPA ID: ${item.EPA_REGISTRY_ID}</td>
            <td>${item.PARENT_CO_NAME}</td>
            <td>${item.MAIL_STREET_ADDRESS}, ${item.MAIL_CITY}, ${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}<br>PH: ${item.ASGN_PUBLIC_PHONE}</td></tr>`
          
            

          document.querySelector("tbody").innerHTML = data.map(item => apiResults(item)).join('')
        }
        
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}



