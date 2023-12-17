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
  // const url = `https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${zipcode}/tri_reporting_form/rows/0:15/JSON`
  const url = `https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${zipcode}/tri_reporting_form/rows/JSON`

  try {
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)

        document.getElementById('spinner').innerHTML =	''

        document.querySelector('#result-header').innerHTML = `<h2>Results: ${data.length}</h2>`
        
        let count = 1

        const apiResults = item => {

          if (Array.isArray(item.TRI_REPORTING_FORM) && item.TRI_REPORTING_FORM.length > 0) {

            let buttonID = `button-${count}`
            let detailRowID = `detail-${count}`
        
            return `<tr>
                      <th scope="col">${count++}</th>
                      <td><b>${item.FACILITY_NAME}</b><br>EPA ID: ${item.EPA_REGISTRY_ID}</td>
                      <td>${item.PARENT_CO_NAME}</td>
                      <td>${item.MAIL_STREET_ADDRESS}, ${item.MAIL_CITY}, ${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}, PH: ${item.ASGN_PUBLIC_PHONE}
                      </td>
                      <td><div class="button-container"><button id="${buttonID}" class="toggle-detail">Expand Results</button><div></td>
                    </tr>
                    <td id="${detailRowID}" colspan="5" class="hidden"> 
                      <table class="table table-striped table-responsive table-sm">
                      <thead>
                        <tr>
                          <th scope="col"><b>Year Reported</b></th>
                          <th scope="col"><b></b>Date Certified</th>
                          <th scope="col"><b></b>Chemical Leaked</th>
                          <th scope="col"><b>Amount Onsite</b></th>
                          <th scope="col"><b>Amount Leaked(lb)</b></th>
                        </tr>
                      </thead>
                        ${item.TRI_REPORTING_FORM.map( reportedIncident => {
                          return `<tr class="detail-table">
                              <td>${reportedIncident.REPORTING_YEAR || ''}</td>
                              <td>${reportedIncident.CERTIF_DATE_SIGNED || ''}</td>
                              <td>${reportedIncident.CAS_CHEM_NAME || ''}</td>
                              <td>${reportedIncident.MAX_AMOUNT_OF_CHEM || ''}</td>
                              <td>${reportedIncident.ONE_TIME_RELEASE_QTY
                                || ''}</td>
                            </tr>`
                        }).join('')}
                      </table>
                    </td>
                    `;
          } else {
            // return `<tr>
            //           <th scope="col">${count++}</th>
            //           <td><b>${item.FACILITY_NAME}</b><br>EPA ID: ${item.EPA_REGISTRY_ID}</td>
            //           <td>${item.PARENT_CO_NAME}</td>
            //           <td>${item.MAIL_STREET_ADDRESS}, ${item.MAIL_CITY}, ${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}<br>PH: ${item.ASGN_PUBLIC_PHONE}</td>
            //         </tr>`;
            return `<tr>
              <th scope="col">${count++}</th>
              <td><b>${item.FACILITY_NAME}</b><br>EPA ID: ${item.EPA_REGISTRY_ID}</td>
              <td>${item.PARENT_CO_NAME}</td>
              <td>${item.MAIL_STREET_ADDRESS}, ${item.MAIL_CITY}, ${item.MAIL_ZIP_CODE} ${item.MAIL_STATE_ABBR}<br>PH: ${item.ASGN_PUBLIC_PHONE}
              </td>
              <td>No Results</td>
              <tr></tr>
            </tr>
            `;
          }
        }
        

        document.querySelector("tbody").innerHTML = data.map(item => apiResults(item)).join('')

      document.querySelectorAll('.toggle-detail').forEach(button => {
      button.addEventListener('click', function() {
        const detailID = this.id.replace('button-', 'detail-');
        const detailRow = document.getElementById(detailID);
        if (detailRow.classList.contains('hidden')) {
          detailRow.classList.remove('hidden');
          // detailRow.classList.add('show');
          this.textContent = 'Collapse Results';
        } else {
          // detailRow.classList.remove('show');
          detailRow.classList.add('hidden');
          this.textContent = 'Expand Results';
        }
      });
    });

      })
  }catch(error){
    console.log(error)
  }
}
