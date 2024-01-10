// Import required packages
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create Express app
const app = express();
const PORT = 3000;

// Variable to store authentication token
let authToken = ''; 

// Middleware setup
app.use(cors());
app.use(express.json()); 

// Proxy route to get authentication token
app.post('/proxy', async (req, res) => {
  const url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';

  try {
    // Make a proxy request to get authentication token
    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      },
    });

    // Store the received authentication token
    authToken = response.data.access_token;
    console.log(authToken);

    // Respond with the received data
    res.json(response.data);
  } catch (error) {
    console.error('Proxy request failed:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get the customer list
app.get('/get_customer_list', async (req, res) => {
  try {
    // Make a request to get the customer list using stored authentication token
    const response = await axios.get('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Use the stored token
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      }
    });

    // Respond with the received data
    res.json(response.data);
  } catch (error) {
    console.error('Direct request failed:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a customer by UUID
app.post('/delete_customer/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  try {
    // Make a request to delete a customer using a hardcoded token
    const response = await axios.post(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`, null, {
      headers: {
        'Authorization': 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=',
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      },
    });

    // Respond with the received data
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting customer:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create data
app.post('/create_data', async (req, res) => {
  try {
    // Make a request to create data using the stored authentication token
    const response = await axios.post('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', req.body, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1; JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
        'Content-Type': 'application/json',
      },
    });

    // Respond with the received data
    res.json(response.data);
  } catch (error) {
    console.error('Error creating data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update customer data by UUID
app.post('/update_customer/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  console.log(uuid);

  const url = `https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`;

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1; JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
    'Content-Type': 'application/json',
  };

  try {
    // Make a request to update customer data using the stored authentication token
    const response = await axios.post(url, req.body, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error updating customer data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Enable CORS for all routes
app.options('*', cors());

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
