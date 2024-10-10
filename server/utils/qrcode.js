const QR = require("qrcode");

function CreateQRImage(data, width = "200", height = "200") {
  if (!data) return null;
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("No data Provided"));
      return;
    }

    QR.toDataURL(
      data,
      { errorCorrectionLevel: "M", width, height },
      (err, url) => {
        if (err) {
          reject(new Error("Error Creating QRImage: " + err.message));
        } else {
          resolve(url);
        }
      }
    );
  });
}

module.exports = CreateQRImage;
