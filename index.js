import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;

// Set up body-parser for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the public folder
app.use(express.static("public"));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Store uploaded images in the public/uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique file names
  }
});

const upload = multer({ storage: storage });

// Initialize an array to hold posts
const posts = [];

// GET route for the home page
app.get("/", (req, res) => {
  res.render("index");
});

// POST route to handle form submission (image + username + description)
app.post("/posts", upload.single('image'), (req, res) => {
  const username = req.body.username; // Get the username from the form
  const description = req.body.description; // Get the description from the form
  const image = req.file; // Get the uploaded file information

  if (!image) {
    return res.status(400).send('No file uploaded.');
  }

  // Push new post to the posts array
  posts.push({
    username: username,
    description: description, // Add the description to the post
    image: image.filename // Only pass the filename to the template
  });

  // Redirect to the posts page to display all posts
  res.redirect("/posts");
});

// GET route for displaying the posts page
app.get("/posts", (req, res) => {
  res.render("posts", { posts: posts }); // Pass all posts to the template
});

// GET route for the about page
app.get("/about", (req, res) => {
  res.render("about");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
