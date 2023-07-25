const ErrorHandling =require("../utils/Errorhandling");
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal server Error";
    // when product id is too short 
    if(err.name === "CastError"){
        const message='Resource not found';
        err=new ErrorHandling(400,message);
    }

    // when Register with duplicate email
    if(err.code===11000){
        const message="duplicate email error";
        err=new ErrorHandling(400,message);
    }
    // when wrong JWT token
    if(err.name==="JWTWebTokenError"){
        const message="Token is invalid";
        err=new ErrorHandling(400,message);
    }
    //when JWT Token expired
    if(err.name==="TokenExpiredError"){
        const message="Token has Expired";
        err=new ErrorHandling(400,message);
    }
    //when image size is big
    if(err.message==="Could not decode base64"){
        const message="Image size should be less than 500kb";
        err=new ErrorHandling(400,message);
    };

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
};