const mongoose = require('mongoose');
const formSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        trim:true,
    },
    name:{
        type:String,
        required: true,
        trim:true
    },
    
    department:{
        type: String,
        required:true,
        trim:true
    },
    
    role:{
        type:String,
        required:true,
        trim:true,
    },

    photo:{
        type:String,
        default:null,
    }
},
 {timestamps: true,}
);



const Form_Data= mongoose.model('Form_data', formSchema);

module.exports =  Form_Data    