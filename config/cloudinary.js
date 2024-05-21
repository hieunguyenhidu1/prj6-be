const  cloudinary  = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dfe4vsjep', 
  api_key: '457161391541724', 
  api_secret: '4PXAKU6Y01NHxPkjbM15NAkAei8' 
});

module.exports = cloudinary