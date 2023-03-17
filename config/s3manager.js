const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { logger } = require("../middleware/logEvents");

require('dotenv').config()

//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});
console.log('Aws key',process.env.AWS_ACCESS_KEY)

var s3 = new AWS.S3();

// configure multer and multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "honey-qr-codes",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file)
      const filename = file.originalname;
      cb(null, `certs/${filename}`);
    },
    Body: function (req, file, cb) {
      const base64Data = Buffer.from(
        req.body.profile.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      cb(null, base64Data);
    },
    ContentEncoding: "base64",
    ContentType: "png/jpeg/jpg/pdf",
  }),
});

// define middleware function
const uploadImage = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      // handle error
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const getObject = (key) => {
  try {
    var params = {
      Bucket: "honey-qr-codes",
      Key: `profiles/${key}`,
    };

    return s3
      .getObject(params)
      .createReadStream()
      .on("error", (err) => {
        if (err.code === "AccessDenied") {
          return `File not found in S3`;
        } else {
          return `Could not retrieve file from S3`;
        }
      });
  } catch (err) {
    logger(new Error(`Could not retrieve file from S3`));
  }
};

const uploadtos3 = async (body, name) => {
  //configuring parameters
  var params = {
    Bucket: "honey-qr-codes",
    Body: body,
    Key: `profiles/${name}`,
  };
  try {
    s3.upload(params, function async(err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
        return err;
      }
      //success
      if (data) {
        console.log("Uploaded in:", data.Location);
        return data;
      }
    });
  } catch (error) {
  }
};
 

const getcert = (key) => {
  try {
    var params = {
      Bucket: "honey-qr-codes",
      Key: `certs/${key}`,
    };

    return s3
      .getObject(params)
      .createReadStream()
      .on("error", (err) => {
        if (err.code === "AccessDenied") {
          return `File not found in S3`;
        } else {
          return `Could not retrieve file from S3`;
        }
      });
  } catch (err) {
    logger(new Error(`Could not retrieve file from S3`));
  }
}; 
module.exports = { 
  getcert,
  uploadImage,
  getObject,
  uploadtos3,
};
// var filePath = "./logs/reqLog.txt";

// //configuring parameters
// var params = {
//   Bucket: 'yalla-profile-images',
//   Body : fs.createReadStream(filePath),
//   Key : "profiles/"+path.basename(filePath)
// };

// s3.upload(params, function (err, data) {
//   //handle error
//   if (err) {
//     console.log("Error", err);
//   }
//   //success
//   if (data) {
//     console.log("Uploaded in:", data.Location);
//   }
// });

// const getObject = async (bucket, objectKey) =>{
//     try {
//         var params = {
//             Bucket: 'yalla-profile-images',
//             Key : "profiles/reqLog.txt"
//           };

//       const data = awkt s3.getObject(params).promise();

//       return data.Body.toString('utf-8');
//     } catch (e) {
//       throw new Error(`Could not retrieve file from S3: ${e.message}`)
//     }
//   }

//   // To retrieve you need to use `await getObject()` or `getObject().then()`
//   const myObject = getObject('yalla-profile-images', 'path/to/the/object.txt').then(i=>{
//     console.log(i)
//   });

// return;
