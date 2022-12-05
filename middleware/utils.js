const { post } = require("../routes/post");

exports.getUrlPath = (req)=>{
    let path = "";
    Object.keys(req.query).forEach((key)=>{
      if(key === "page"){
        path = path+`&&page=${req.query[key]}`;
      }
    }); 
    return path;
  }
