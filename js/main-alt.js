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

        for(i = 0; i < data.length; i++){
  
          const API_Results = item => `<div id="single-result"><h3 id="label">Facility Name:</h3>
          <h3 class="name">${item.FACILITY_NAME}</h3>
          <h4 id="label">Parent Company Name:</h4> <h4 id="parent-co">${item.PARENT_CO_NAME}</h4><h4 id="label">Address:</h4> 
          <h4 id="street">${item.MAIL_STREET_ADDRESS} </h4><h4 id="town">${item.MAIL_CITY}</h4><h4 id="zip-state">${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}</h4></div>`;
  
          document.querySelector("#results").innerHTML = data.map(item => API_Results(item)).join('');

        }
        

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}


/* <h2>Results</h2>
<div id="results">
  <div id="single-result">
    <h3 id="label">Facility Name:</h3> <h3 id="name"></h3>
    <h4 id="label">Parent Company Name:</h4> <h4 id="parent-co"></h4>
    <h4 id="label">Address:</h4> 
    <h4 id="street"></h4>
    <h4 id="town"></h4> 
    <h4 id="zip-state"></h4> 
    <h4></h4>
  </div>
</div> */



// https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/600/JSON
