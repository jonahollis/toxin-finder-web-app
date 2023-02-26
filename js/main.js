// Prevent default on input textarea, apply "Enter" to getFetch() 

var input = document.getElementById("input");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("zipbutton").click();
  }
});

// Back to top button

let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// API request to EPA Database based on input zipcode

document.querySelector('#zipbutton').addEventListener('click', getFetch)

async function getFetch(){
  document.getElementById('spinner').innerHTML =	`<div class="d-flex justify-content-center m-5">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  </div>`

  const zipcode = document.querySelector('input').value
  console.log(zipcode)
  const url = `https://bypass-cors.j0n4h.repl.co/get?url=https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${zipcode}/JSON`

  try {
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)

        document.getElementById('spinner').innerHTML =	''

        document.querySelector('#result-header').innerHTML = `<h2>Results: ${data.length}</h2>`
        
        let count = 1

        const apiResults = item => 
          `<tr>
          <th scope="col">${count++}</th>
          <td><b>${item.FACILITY_NAME}</b><br>EPA ID: ${item.EPA_REGISTRY_ID}</td>
          <td>${item.PARENT_CO_NAME}</td>
          <td>${item.MAIL_STREET_ADDRESS}, ${item.MAIL_CITY}, ${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}<br>PH: ${item.ASGN_PUBLIC_PHONE}</td></tr>`

        document.querySelector("tbody").innerHTML = data.map(item => apiResults(item)).join('')
      })

  }catch(error){
    console.log(error)
  }
}
