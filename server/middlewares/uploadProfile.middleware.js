const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { User } = require("../model");

const validations = {
  ACCEPTED_IMG_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/avif",
    "image/svg+xml",
    "image/webp",
  ],
  ACCEPTED_IMG_FILE_SIZE: 2 * 1024 * 1024, // 2 mb
  UNIQUE_FILE_SUFFIX: () => Date.now() + "_" + Math.round(Math.random() * 1e9),
};

const multerConfig = {
  fileFilter: (req, file, cb) => {
    if (!validations.ACCEPTED_IMG_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(ERRORS.MULTER_ERROR.INVALID_FILE_TYPE), false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: validations.ACCEPTED_IMG_FILE_SIZE,
  },
  storage: multer.memoryStorage(),
};

// async function uploadProfile(req, res , next) {
//   try {
//     if (req.file) {
//       const upload = multer(multerConfig).single(req.fieldname);

//       upload(req, res, async (err) => {
//         console.log(req.file);
//         if (err) {
//           return next(err);
//         }
//         const fileName = await path.parse(req.file.originalName).name;
//         const fileExtension = await path.extname(req.file.originalName);

//         // Getting Image Buffer
//         const banner = await resizeImageBuffer(req.file.buffer, 1024, 1024);
//         const profile = await resizeImageBuffer(req.file.buffer, 256, 256);

//         const profileLocalPath = await saveImageDisk(
//           profile,
//           fileName,
//           fileExtension
//         );
//         const bannerLocalPath = await saveImageDisk(
//           banner,
//           fileName,
//           fileExtension
//         );

//         const { id: userID } = req.user;

//         // User Already Exists So Update the Profile
//         if (userID) {
//           User.findOneAndUpdate({
//             _id: userID,
//             $set: {
//               profilePic: profileLocalPath,
//               bannerPic: bannerLocalPath,
//             },
//           });
//         } else {
//           // user not existed so it comes in registration time
//           await User({
//             profilePic: profileLocalPath,
//             bannerPic: bannerLocalPath,
//           }).save();
//         }
//       });
//     } else {
//       console.log("No File Uploaded");
//       // if no file is uploaded then call next middleware
//       // in this case we will not perform any action on the request.
//       // you can add your own error handling here.
//         next();
//     }
//   } catch (e) {
//     console.log("Errror In Uploading Profile");
//     next(e);
//   }
// }


async function uploadProfile(req, res, next) {
  try {
    const upload = multer(multerConfig).single('avatar'); // Specify the field name here

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return next(err); // Handle upload error
      }

      if (req.file) {
        const fileName = path.parse(req.file.originalname).name; // Fixed typo from originalName to originalname
        const fileExtension = path.extname(req.file.originalname);

        // Process image buffers and save them
        const banner = await resizeImageBuffer(req.file.buffer, 1024, 1024);
        const profile = await resizeImageBuffer(req.file.buffer, 256, 256);

        const profileLocalPath = await saveImageDisk(profile, fileName, fileExtension);
        const bannerLocalPath = await saveImageDisk(banner, fileName, fileExtension);

        // Attach the paths to the request object for later use
        req.filePaths = { profilePic: profileLocalPath, bannerPic: bannerLocalPath };
      } else {
        console.log("No File Uploaded");
      }
      next(); // Call the next middleware or route handler
    });
  } catch (e) {
    console.log("Error In Uploading Profile");
    next(e);
  }
}

const saveImageDisk = async (imageBuffer, filename, fileExtension) => {
  const outputDir = path.resolve(`/static`);
  const filePath = path.resolve(`${outputDir}/${filename}${fileExtension}`);
  await sharp(imageBuffer).toFile(filePath);
  return filePath;
};
const resizeImageBuffer = async (buffer, width, height) => {
  return await sharp(buffer)
    .resize({
      width,
      height,
      fit: sharp.fit.inside,
      background: { r: 255, g: 255, b: 255, alpha: 1 }, // white background
    })
    .jpeg({ quality: 90 })
    .toBuffer();
};

module.exports = uploadProfile;



