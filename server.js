// const express = require("express");
// const { MongoClient } = require("mongodb");
// const bcrypt = require("bcrypt");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();
// const port = 3000;

// const uri = "mongodb+srv://jim:diana@cluster0.g9m4bll.mongodb.net";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/register.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "register.html"));
// });

// app.get("/dashboard.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "dashboard.html"));
// });

// app.get("/successregister.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "successregister.html"));
// });

// // Notes
// app.post("/addNote", async (req, res) => {
//   const { username, note } = req.body;

//   try {
//     await client.connect();
//     const database = client.db("authSystem");
//     const users = database.collection("users");

//     await users.updateOne({ username }, { $push: { notes: note } });

//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

// app.get("/getNotes", async (req, res) => {
//   const { username } = req.query;

//   try {
//     await client.connect();
//     const database = client.db("authSystem");
//     const users = database.collection("users");

//     const user = await users.findOne({ username });

//     if (user) {
//       res.json({ success: true, notes: user.notes });
//     } else {
//       res.json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });
// // Notes

// // Register form
// app.post("/register", async (req, res) => {
//   const { username, password, role } = req.body;

//   try {
//     await client.connect();
//     const database = client.db("authSystem");
//     const users = database.collection("users");

//     const existingUser = await users.findOne({ username });

//     if (existingUser) {
//       console.log("Username already exists");
//       return res.json({ success: false, message: "Username already exists" });
//     }

//     const newUser = {
//       username,
//       password: password,
//       role,
//       notes: [],
//     };

//     await users.insertOne(newUser);
//     console.log("User registered successfully");
//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });
// // Register form

// // Authenticate form
// app.post("/authenticate", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     await client.connect();
//     const database = client.db("authSystem");
//     const users = database.collection("users");

//     const user = await users.findOne({ username });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.password === password) {
//       res.json({ success: true, username: user.username });
//     } else {
//       res.json({ success: false, message: "Incorrect password" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Internal server error" });
//   } finally {
//     await client.close();
//   }
// });
// //Authenticate form

// //delete note
// app.post("/deleteNote", async (req, res) => {
//   const { username, note } = req.body;

//   try {
//     await client.connect();
//     const database = client.db("authSystem");
//     const users = database.collection("users");

//     await users.updateOne({ username }, { $pull: { notes: note } });

//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Internal server error" });
//   } finally {
//     await client.close();
//   }
// });
// //delete note

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

const uri = "mongodb+srv://jim:diana@cluster0.g9m4bll.mongodb.net";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "css")));

// Serve static HTML files
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/register.html", (req, res) =>
  res.sendFile(path.join(__dirname, "register.html"))
);
app.get("/dashboard.html", (req, res) =>
  res.sendFile(path.join(__dirname, "dashboard.html"))
);
app.get("/successregister.html", (req, res) =>
  res.sendFile(path.join(__dirname, "successregister.html"))
);

// Connect to MongoDB
client
  .connect()
  .then(() => {
    database = client.db("authSystem");
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Notes
app.post("/addNote", async (req, res) => {
  const { username, note } = req.body;

  try {
    const users = database.collection("users");
    await users.updateOne({ username }, { $push: { notes: note } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get("/getNotes", async (req, res) => {
  const { username } = req.query;

  try {
    const users = database.collection("users");
    const user = await users.findOne({ username });

    if (user) {
      res.json({ success: true, notes: user.notes });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/deleteNote", async (req, res) => {
  const { username, note } = req.body;

  try {
    const users = database.collection("users");
    await users.updateOne({ username }, { $pull: { notes: note } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Register form
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const users = database.collection("users");
    const existingUser = await users.findOne({ username });

    if (existingUser) {
      console.log("Username already exists");
      return res.json({ success: false, message: "Username already exists" });
    }

    const newUser = { username, password, role, notes: [] };
    await users.insertOne(newUser);
    console.log("User registered successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Authenticate form
app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = database.collection("users");
    const user = await users.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password === password) {
      res.json({ success: true, username: user.username });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
