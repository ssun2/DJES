/* eslint-disable */
var searchBtn = document.getElementById("search-btn");
var input = document.querySelector("#search-input");
var requestBtn = document.getElementById("request-btn");
var borrowerName = document.querySelector("#name-input");
var borrowerEmail = document.querySelector("#email-input");
var itemIdInput = document.getElementById('item-id');
var successDiv= document.getElementById('success');
var reqForm = document.getElementById('request-form');

function request(url, method, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(null, xhr.responseText);
    } else {
      cb("error" + xhr.responseType);
    }
  };
  xhr.open(method, url, true);
  xhr.send();
}

// functions to clear population on each button click
function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

requestBtn.addEventListener("click", function(e) {
  e.preventDefault();
  var name = borrowerName.value;
  var email = borrowerEmail.value;
  var id = itemIdInput.value;
  var xhrPost = new XMLHttpRequest();
  xhrPost.onreadystatechange = function() {
    if (xhrPost.readyState === 4 && xhrPost.status === 200) {
      console.log("post data response successful");
      reqForm.classList.add('hidden');
      var success = document.createElement('div');
      success.innerText = 'Loan requested! :)';
      successDiv.appendChild(success);
    } else {
      // cb("error" + xhrPost.responseType);
    }
  };
  xhrPost.open('POST', '/request-item', true);
  xhrPost.setRequestHeader('content-type', 'application/json');
  var postData = {
    name: name,
    email: email,
    item: id
  };
  xhrPost.send(JSON.stringify(postData));
  
});

function borrow(id){
  reqForm.classList.remove('hidden');
  itemIdInput.value = id;
}

searchBtn.addEventListener("click", function(e) {
  e.preventDefault();
  var inputValue = encodeURIComponent(input.value);
  console.log("input " + inputValue);

  // add validation alert if buttons gets clicked without input val
  if (inputValue.trim() == "") {
    alert("Please enter a search Term");
    return;
  } else {
    // requestData uses a callback populate/ musicPopulate to populate the DOM
    request("/search?q=" + inputValue, 'GET', updateDom);
  }
});


function updateDom(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("updateDom reached");

    var items = JSON.parse(data);
    var table = document.getElementById("items-table");
    clearList(table);

    items.forEach(function(item) {
      // adding our item names
      var row = document.createElement("tr");
      var name = document.createElement("td");
      var loanBtn = document.createElement('button');
      loanBtn.textContent = 'borrow';
      loanBtn.setAttribute('id', item.id);
      loanBtn.setAttribute('onclick', "borrow(this.id)");
      name.innerHTML = item.name;
      row.appendChild(name);

      // adding our item descriptions
      var description = document.createElement("td");
      description.innerHTML = item.description;
      row.appendChild(description);
      row.appendChild(loanBtn);
      // add everything to the table
      table.appendChild(row);
      
    });
  }
}

request("/testing", 'GET', updateDom);
