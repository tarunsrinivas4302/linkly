// const express = require("express");
// const connectDB = require("./lib/mongoConnect.js");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const app = express();
// const {
//   errorMiddleware,
//   notFound,
//   authMiddleware,
// } = require("./middlewares/index.js");

// const { urirouter, authRouter } = require("./routes/index.js");
// const userRouter = require("./routes/user.routes.js");
// const qrRouter = require("./routes/qr.routes.js");

// dotenv.config();


// app.use(
//   cors({
//     origin: process.env.BASE_URI || "*",
//     credentials: true,
//     methods: "GET, POST, PUT, DELETE, OPTIONS",
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "X-Requested-With",
//       "Accept",
//     ],
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*"); // Specify the exact origin
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Accept, Authorization"
//   );

//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     res.sendStatus(204);
//   } else {
//     next();
//   }
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// // app.use(cors());

// app.listen(5000, () => {
//   console.log("Server is listening on port :: 5000");
//   connectDB();
// });




// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/qr/", qrRouter);
// app.use("/api/v1/user", authMiddleware, userRouter);
// app.use("/api/v1/", authMiddleware, urirouter);


// app.use(express.static(path.join(__dirname, 'client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
// });


// app.use(notFound);

// app.use(errorMiddleware);

// module.exports = app;



const express = require("express");
const connectDB = require("./lib/mongoConnect.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { errorMiddleware, notFound , authMiddleware } = require("./middlewares/index.js");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.BASE_URI || "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*"); // Specify the exact origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});


// API routes
const { urirouter, authRouter } = require("./routes/index.js");
const userRouter = require("./routes/user.routes.js");
const qrRouter = require("./routes/qr.routes.js");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/qr", qrRouter);
app.use("/api/v1/user", authMiddleware,  userRouter);
app.use("/api/v1/", authMiddleware , urirouter);

// Serve static files from the client build
app.use(express.static(path.join(__dirname, ".." , 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, ".." ,'client', 'dist', 'index.html'));
});

// 404 and error middleware
app.use(notFound);
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
