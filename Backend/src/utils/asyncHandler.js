const asyncHandler=(fn)=> {
    return async(req,res,next) =>{
        try{
            Promise.resolve(fn(req,res,next))
        } catch(error){
            console.log("there is error in asyncHandler", error)
            next(error);
        }
    }
}
export default asyncHandler;