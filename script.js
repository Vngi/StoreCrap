// Array to store all store data
let allStores = [];

// Function to show the input form
function showInputForm(event) {
  event.stopPropagation();

  var newStoreForm = document.getElementById('newStoreForm');
  newStoreForm.innerHTML = `
    <form id="newStoreForm" onclick="formClick(event)">
      <label for="fileInput">Upload JSON File:</label>
      <input type="file" id="fileInput" accept=".json" onchange="handleFileUpload(event)">

      <label for="storeNumber">Store Number:</label>
      <input type="text" id="storeNumber" name="storeNumber" required>

      <label for="storeName">Store Name:</label>
      <input type="text" id="storeName" name="storeName" required>

      <!-- Add other input fields for store information -->

      <label for="proxyId">Proxy ID:</label>
      <input type="text" id="proxyId" name="proxyId" required>

      <label for="location">Location:</label>
      <input type="text" id="location" name="location" required>

      <label for="proxyInfo">Proxy Information:</label>
      <input type="text" id="proxyInfo" name="proxyInfo" required>

      <label for="outboundIp">Outbound IP:</label>
      <input type="text" id="outboundIp" name="outboundIp" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>

      <label for="bank">Bank:</label>
      <input type="text" id="bank" name="bank" required>

      <label for="cardNumber">Card Number:</label>
      <input type="text" id="cardNumber" name="cardNumber" required>

      <label for="billingAddress">Billing Address:</label>
      <input type="text" id="billingAddress" name="billingAddress" required>

      <label for="backupCodes">Backup Codes:</label>
      <input type="text" id="backupCodes" name="backupCodes" placeholder="Optional If There Is No Backup Codes">

      <button type="button" onclick="addNewStore()">Add Store</button>
    </form>
  `;
  newStoreForm.classList.toggle('hidden');
}

// Function to handle file upload
function handleFileUpload(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const jsonData = JSON.parse(e.target.result);
      if (Array.isArray(jsonData)) {
        // If JSON data is an array, assume it's an array of stores
        jsonData.forEach(storeData => displayStore(storeData));
        allStores = allStores.concat(jsonData);
      } else {
        // If not an array, assume it's a single store
        displayStore(jsonData);
        allStores.push(jsonData);
      }
    };

    reader.readAsText(file);
  }
}

// Function to prevent form click propagation
function formClick(event) {
  event.stopPropagation();
}

// Function to toggle the visibility of the store information
function toggleStoreVisibility(storeId) {
  var storeInfo = document.getElementById(storeId);
  if (storeInfo) {
    storeInfo.classList.toggle('hidden');
  }
}

// Function to delete a store
function deleteStore(storeName) {
  // Find the index of the store in the array
  const index = allStores.findIndex(store => store.storeName === storeName);

  if (index !== -1) {
    // Remove the store from the array
    allStores.splice(index, 1);

    // Remove the store from the page
    const storeElement = document.getElementById('store-' + storeName);
    if (storeElement) {
      storeElement.parentNode.removeChild(storeElement);
    }

    // Save the updated store data to the stores.json file
    saveAllStoresToJsonFile();
  }

  // Update the "Download All Store Data" link
  updateDownloadLink();
}

// Function to add a new store
function addNewStore() {
  // Retrieve input values
  var storeNumber = document.getElementById('storeNumber').value;
  var storeName = document.getElementById('storeName').value;
  var proxyId = document.getElementById('proxyId').value;
  var location = document.getElementById('location').value;
  var proxyInfo = document.getElementById('proxyInfo').value;
  var outboundIp = document.getElementById('outboundIp').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var bank = document.getElementById('bank').value;
  var cardNumber = document.getElementById('cardNumber').value;
  var billingAddress = document.getElementById('billingAddress').value;
  var backupCodes = document.getElementById('backupCodes').value;

  // Check if all fields are filled
  if (!storeNumber ||!storeName || !proxyId || !location || !proxyInfo || !outboundIp || !email || !password || !bank || !cardNumber || !billingAddress) {
    alert('Please fill in all fields');
    return;
  }

  // Create an object with store data
  const storeData = {
    storeNumber,
    storeName,
    proxyId,
    location,
    proxyInfo,
    outboundIp,
    email,
    password,
    bank,
    cardNumber,
    billingAddress,
    backupCodes,
  };

  // Display the new store on the page
  displayStore(storeData);

  // Add the new store data to the array
  allStores.push(storeData);

  // Save all store data to the stores.json file
  saveAllStoresToJsonFile();

  // Hide the form after adding the store
  var newStoreForm = document.getElementById('newStoreForm');
  newStoreForm.classList.add('hidden');
}

// Function to display an existing store on the page
function displayStore(storeData) {
    const newStore = document.createElement('div');
    newStore.className = 'store';
    newStore.innerHTML = `
      <div class="store-header">
        <h2 onclick="toggleStoreVisibility('store-${storeData.storeName}')">${storeData.storeName}</h2>
      </div>
      <div class="store-info hidden" id="store-${storeData.storeName}">
        <p>Store Number: ${storeData.storeNumber}</p>
        <p>Proxy ID: ${storeData.proxyId}</p>
        <p>Location: ${storeData.location}</p>
        <p>Proxy Information: ${storeData.proxyInfo}</p>
        <p>Outbound IP: ${storeData.outboundIp}</p>
        <p>Email: ${storeData.email}</p>
        <p onclick="toggleSensitiveInfoVisibility('sensitive-password-${storeData.storeName}', ${JSON.stringify(storeData)})" class="sensitive-info hidden">Password: ${storeData.password}</p>
        <p onclick="toggleSensitiveInfoVisibility('sensitive-cardNumber-${storeData.storeName}', ${JSON.stringify(storeData)})" class="sensitive-info hidden">Card Number: ${storeData.cardNumber}</p>
        <p>Billing Address: ${storeData.billingAddress}</p>
        <p onclick="toggleSensitiveInfoVisibility('sensitive-backupCodes-${storeData.storeName}', ${JSON.stringify(storeData)})" class="sensitive-info hidden">Backup Codes: ${storeData.backupCodes}</p>
        <button class="sensitive-info-button" onclick="showSensitiveInfo('${storeData.storeName}')">Show Sensitive Info</button>
      </div>
    `;
  
  var storesContainer = document.getElementById('stores-container');
  storesContainer.insertBefore(newStore, document.getElementById('addStore'));

  // Update the "Download All Store Data" link
  updateDownloadLink();
}


// Function to toggle visibility of sensitive information
function toggleSensitiveInfoVisibility(elementId, storeDataJson) {
    var storeData = JSON.parse(storeDataJson);
    var sensitiveInfoElement = document.getElementById(elementId);
    var originalInfoElement = document.getElementById(elementId.replace('sensitive-', ''));
  
    if (sensitiveInfoElement && originalInfoElement) {
      sensitiveInfoElement.classList.toggle('hidden');
      originalInfoElement.classList.toggle('hidden');
    }
  }
  

// Function to show sensitive information
function showSensitiveInfo(storeName) {
    const storeInfo = document.getElementById(`store-${storeName}`);
    if (storeInfo) {
        // Toggle the visibility of sensitive information
        const sensitiveInfoElements = storeInfo.querySelectorAll('.sensitive-info');
        sensitiveInfoElements.forEach(element => {
            element.classList.toggle('hidden');
        });
    }
}

  

  // Ensure that saveAllStoresToJsonFile is defined
  function saveAllStoresToJsonFile() {
    const jsonData = JSON.stringify(allStores, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
  
    let downloadLink = document.getElementById('downloadLink');
  
    if (!downloadLink) {
      // If the button doesn't exist, create a new one
      downloadLink = document.createElement('a');
      downloadLink.id = 'downloadLink';
      document.body.appendChild(downloadLink);
    }
  
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'stores.json';
    downloadLink.textContent = 'Download All Store Data';
  }
  
  

// Function to update the "Download All Store Data" link
function updateDownloadLink() {
  const jsonData = JSON.stringify(allStores, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Remove any existing download link
  const existingLink = document.getElementById('downloadLink');
  if (existingLink) {
    document.body.removeChild(existingLink);
  }

  // Create a new download link
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'stores.json';
  a.textContent = 'Save .Json';
  a.id = 'downloadLink';

  document.body.appendChild(a);
}

// Function to show the delete store form
function showDeleteStoreForm() {
    event.stopPropagation();
  
    var deleteStoreForm = document.getElementById('deleteStoreForm');
    deleteStoreForm.innerHTML = `
      <!-- Form content for deleting a store -->
      <label for="selectStore">Select Store:</label>
      <select id="selectStore">
        <!-- Dynamically populate options with store names -->
        ${allStores.map(store => `<option value="${store.storeName}">${store.storeName}</option>`).join('')}
      </select>
      <button onclick="deleteSelectedStore()">Delete</button>
    `;
    deleteStoreForm.classList.toggle('hidden');
  }
  
  // Function to delete the selected store
  function deleteSelectedStore() {
    // Retrieve the selected store name
    const selectedStoreName = document.getElementById('selectStore').value;
  
    // Check if a store is selected
    if (selectedStoreName) {
      // Call the deleteStore function with the selected store name
      deleteStore(selectedStoreName);
    }
  
    // Hide the delete store form after deletion
    var deleteStoreForm = document.getElementById('deleteStoreForm');
    deleteStoreForm.classList.add('hidden');
  }
  
  // Add an event listener to stop propagation inside the delete store form
  document.getElementById('deleteStoreForm').addEventListener('click', function (event) {
    event.stopPropagation();
  });