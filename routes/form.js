const express = require('express');
const router = express.Router();
const Form_Data = require('../model/formdata');
const Axios = require('axios');


async function linkToBase64Image(url) {
    try {
        const response = await Axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const contentType = response.headers['content-type'];
        return `data:${contentType};base64,${base64}`;
    } catch (err) {
        return null;
    }
    
}

function convertDriveLinkToViewable(url) {
    try {
        const fileIdMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch) return null;
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } catch (err) {
        return null;
    }
}

router.post('/submit_form', async (req, res) => {
    try {
        const {id, name, department, role , photo} = req.body;
        viewablePhoto = convertDriveLinkToViewable(photo);
        if(!id || !name || !department || !role || !viewablePhoto){
            return  res.status(400).json({ message: 'All fields are required' });
        }
        const existingEntry = await Form_Data.findOne({ id: id });
        if (existingEntry) {
            return res.status(409).json({ message: 'An entry with this ID already exists' });
        }

        const base64Image = await linkToBase64Image(viewablePhoto);
        if (!base64Image) {
            return res.status(400).json({ message: 'Could not fetch image from Drive link' });
        }

        const newFormData = new Form_Data({
            id: id,
            name : name,
            department: department,     
            role : role,   
            photo: base64Image,
        });
        await newFormData.save();
        res.status(200).json({ message: 'Form data submitted successfully', data: newFormData });
    } catch (error) {
        console.error('Error submitting form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }       
});



router.get('/get_form_data', async (req, res) => {
    try {
        const formData = await Form_Data.find({});  
        res.status(200).json({ data: formData });
    } catch (error) {
        console.error('Error retrieving form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});


router.get('/get_form_data/:id', async (req, res) => {
    try {
        const formData = await Form_Data.findOne({ id: req.params.id });    
        if (!formData) {
            return res.status(404).json({ message: 'Form data not found' });
        }
        res.status(200).json({ data: formData });
    }
    catch (error) {
        console.error('Error retrieving form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;