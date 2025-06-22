const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // for environment variables

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({"text": 'Welcome to the SMS Sending Service'});
});

app.post('/send-sms', async (req, res) => {
  const { number, otp } = req.body;

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        sender_id: process.env.SENDER_ID,
        message: process.env.TEMPLATE_ID,
        variables_values: otp,
        route: 'dlt',
        numbers: number
      },
      {
        headers: {
          Authorization: process.env.FAST2SMS_API_KEY
        }
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error?.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
