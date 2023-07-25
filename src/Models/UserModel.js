const mongoose = require('mongoose');
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const UserDataSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your UserName"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Correct Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        select:false,
        minlength:[6,"Atleast 6 character Password"]
    },

    createdAt:{
        type:Date,
        default:Date.now,
    },

    avatar:{
        public_Id:{
            type:String
        },
        public_Url:{
            type:String
        }
    },
   
});

UserDataSchema.pre('save',async function(next){
    //only generate hash when password is modified
       if(!this.isModified("password")){
           next();
       }
       this.password=await bcryptjs.hash(this.password, bcryptjs.genSaltSync(12));
    });

UserDataSchema.methods.isCorrectPassword= async function(password){
    return await bcryptjs.compare(password,this.password);
};

UserDataSchema.methods.getJWTToken = async function(){
     return await jwt.sign({id:this._id},process.env.JWT_SECRET_ID,{
        expiresIn:process.env.JWT_EXPIRE
     });
} 
module.exports= mongoose.model('User',UserDataSchema);