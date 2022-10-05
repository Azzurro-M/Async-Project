//BOOTSTRAP TABLE

{
  /* <div>
<table id ="employees">
  <tr>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Hire Date</th>
    <th>Salary</th>
  </tr>
</table>
</div> */
}

const dataURLBase = "https://docs.google.com/spreadsheets/d/";
const dataURLEnd = "/gviz/tq?tqx=out:json&tq&gid=";
const id = "1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE";
const gids = ["0", "1574569648", "1605451198"];
var employees = [];

/**
 ** Reusable method to call the enpoint, parse the response and return reponse.
 **/
async function fetchGoogleData(url) {
  const response = await fetch(url);
  const text = await response.text();
  const employeeResponse = JSON.parse(text.slice(47, -2));
  return employeeResponse.table.rows;
}

/**
 ** Method to take the employees array and populate the table
 **/
function createEmployeeTable(employeeData) {
  let table = document.getElementById("employees");
  table.border = "1";
  for (let employee of employeeData) {
    var tr = document.createElement("tr");
    table.appendChild(tr);
    for (let property in employee) {
      var td = document.createElement("td");
      td.innerHTML = employee[property];
      tr.appendChild(td);
    }
  }
}

async function main() {
  // calling Sheet#1 - name endpoint

  let url = dataURLBase + id + dataURLEnd + gids[0];
  let rows = await fetchGoogleData(url);
  let i = 0;
  for (let row of rows) {
    if (row.c[0].v == "first") {
      continue;
    }
    employees[i] = {
      firstName: row.c[0].v,
      lastName: row.c[1].v,
    };
    ++i;
  }

  // calling Sheet#2 -- hireDate endpoint
  url = dataURLBase + id + dataURLEnd + gids[1];
  rows = await fetchGoogleData(url);
  i = 0;
  for (let row of rows) {
    employees[i] = {
      ...employees[i],
      hireDate: new Date(row.c[0].f).toDateString().slice(4, 15),
    };
    ++i;
  }

  // calling Sheet#3 -- salary endpoint
  url = dataURLBase + id + dataURLEnd + gids[2];
  rows = await fetchGoogleData(url);
  i = 0;
  for (let row of rows) {
    employees[i] = {
      ...employees[i],
      salary: Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(row.c[0].f),
    };
    ++i;
  }

  //calling the method to create the table with the populated employees array
  createEmployeeTable(employees);
}

main();

//

// let number  = 140000
// let locales = [
//   'en-US',    // United States
//   'de-DE',    // Germany
//   'ru-RU',    // Russia
//   'hi-IN',    // India
//   'de-CH',    // Switzerland
// ];
// let opts = { minimumFractionDigits: 2 };
// for (var i = 0; i < locales.length; i++) {
//   console.log(locales[i], number.toLocaleString(locales[i], opts));
// }

// ////

// let number  = 14000
// let value = Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
//   maximumFractionDigits: 0
// }).format(number)

// console.log(value)
