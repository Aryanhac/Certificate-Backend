const mongoose = require('mongoose');

const AdminDataModel = new mongoose.Schema({
    companyName:{
        type:String,
        default:""
    },
    totalUser:{
        type:Number,
    },
    totalCertificate:{
        type:Number
    }
});

module.exports = mongoose.model('AdminModel', AdminDataModel);