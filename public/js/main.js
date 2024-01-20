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

async function getFetch() {
    document.getElementById('spinner').innerHTML = `
      <div class="d-flex justify-content-center m-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`;
  
    const zipcode = document.querySelector('input').value;
    const url = `https://data.epa.gov/efservice/tri_facility/zip_code/BEGINNING/${zipcode}/tri_reporting_form/`;
  
    try {
      const response = await fetch('/get?url=' + encodeURIComponent(url));
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
  
      const dataObject = await response.json();
      let data = dataObject.tri_facilityList.tri_facility;
      let resultCount = data.length;
  
      document.getElementById('spinner').innerHTML = '';
  
      document.querySelector('#result-header').innerHTML = `<h2>Results: ${resultCount}</h2>`;
  
      let count = 1;

        const apiResults = item => {
          const facilityName = item.FACILITY_NAME[0];
          const epaId = item.EPA_REGISTRY_ID[0];
          const parentCoName = item.PARENT_CO_NAME[0];
          const address = `${item.MAIL_STREET_ADDRESS[0]}, ${item.MAIL_CITY[0]}, ${item.MAIL_ZIP_CODE[0]} ${item.MAIL_STATE_ABBR[0]}, PH: ${item.ASGN_PUBLIC_PHONE[0]}`;
        
          let resultHtml = `<tr>
                              <th scope="col">${count++}</th>
                              <td><b>${facilityName}</b><br>EPA ID: ${epaId}</td>
                              <td>${parentCoName}</td>
                              <td>${address}</td>
                              <td>No Results</td>
                            </tr>`;
        
          if (Array.isArray(item.TRI_REPORTING_FORM) && item.TRI_REPORTING_FORM.length > 0) {
            let buttonID = `button-${count}`;
            let detailRowID = `detail-${count}`;
        
            const reportingForms = item.TRI_REPORTING_FORM.flatMap(form => form.TRI_REPORTING_FORM_ROW);
        
            resultHtml = `<tr>
                            <th scope="col">${count}</th>
                            <td><b>${facilityName}</b><br>EPA ID: ${epaId}</td>
                            <td>${parentCoName}</td>
                            <td>${address}</td>
                            <td class="button-container"><button id="${buttonID}" class="btn btn-sm btn-dark toggle-detail">Expand Results</button></td>
                          </tr>
                          <tr id="${detailRowID}" class="hidden">
                            <td colspan="5"> 
                              <table class="table table-striped table-responsive table-sm">
                                <thead>
                                  <tr>
                                    <th scope="col">Year Reported</th>
                                    <th scope="col">Date Certified</th>
                                    <th scope="col">Chemical Name</th>
                                    <th scope="col">Amount Onsite</th>
                                    <th scope="col">Amount Released (lb)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${reportingForms.map(reportingForm => {
                                    const reportingYear = reportingForm.REPORTING_YEAR[0] || '';
                                    const certifDate = reportingForm.CERTIF_DATE_SIGNED[0] || '';
                                    const chemName = reportingForm.CAS_CHEM_NAME[0] || '';
                                    const amountOnsite = reportingForm.MAX_AMOUNT_OF_CHEM[0] || '';
                                    const amountReleased = reportingForm.ONE_TIME_RELEASE_QTY[0] || '';
                                    return `<tr>
                                              <td>${reportingYear}</td>
                                              <td>${certifDate}</td>
                                              <td>${chemName}</td>
                                              <td>${amountOnsite}</td>
                                              <td>${amountReleased}</td>
                                            </tr>`;
                                  }).join('')}
                                </tbody>
                              </table>
                            </td>
                          </tr>`;
          }
        
          return resultHtml;
        };
        

        document.querySelector("tbody").innerHTML = data.map(item => apiResults(item)).join('');

        document.querySelectorAll('.toggle-detail').forEach(button => {
          button.addEventListener('click', function() {
            const detailID = this.id.replace('button-', 'detail-');
            const detailRow = document.getElementById(detailID);
            detailRow.classList.toggle('hidden');
            this.textContent = detailRow.classList.contains('hidden') ? 'Expand Results' : 'Collapse Results';
          });
        });
      } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('spinner').innerHTML = ''; 
      }
    }
