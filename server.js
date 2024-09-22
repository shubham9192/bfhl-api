const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Utility function to decode base64 and get file info
const getFileInfo = (base64String) => {
    if (!base64String) return { file_valid: false };

    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return { file_valid: false };

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const fileSizeKB = (buffer.length / 1024).toFixed(2);

    return {
        file_valid: true,
        file_mime_type: mimeType,
        file_size_kb: fileSizeKB,
    };
};

// POST /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Validation checks
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid data input" });
    }

    const full_name = "john_doe"; // Change as needed
    const dob = "17091999"; // Change as needed
    const college_email = "john@xyz.com"; // Change as needed
    const college_roll_number = "ABCD123"; // Change as needed

    const user_id = `${full_name}_${dob}`;
    
    // Filter numbers and alphabets
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    
    // Determine the highest lowercase alphabet
    const lowestLowercaseAlphabet = alphabets.filter(letter => letter === letter.toLowerCase());
    const highestLowercase = lowestLowercaseAlphabet.length > 0 
        ? [lowestLowercaseAlphabet.sort()[lowestLowercaseAlphabet.length - 1]] 
        : [];

    const fileInfo = getFileInfo(file_b64);

    res.json({
        is_success: true,
        user_id,
        email: college_email,
        roll_number: college_roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase,
        ...fileInfo,
    });
});

// GET /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
