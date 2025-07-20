const asyncHandler =(fn)=>{
   return async(req,res,next)=>{
     try{
        await fn(req,res,next)
     }catch(error){
        res.status(500 || error.statusCode).json({
            success:false,
            message:error.message
        })
     }
   }
   
}

export {asyncHandler}