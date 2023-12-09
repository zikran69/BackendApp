const express = require("express");
const { verifyJWT } = require("../../middlewares/verifyJWT");
const { multer, prisma } = require("../../db/index");
const {
  addCategory,
  allCategory,
  categoryId,
  categorySearch,
  categoryDelete,
  categoryUpdate,
} = require("./category.repository");

const images = multer.diskStorage({
  destination: (req, file, cb) => {
    // Assuming "assets/category-images" directory already exists in your project
    cb(null, "assets/category-images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const uploading = multer({ storage: images });

const router = express.Router();
router.get("/", allCategory);
router.post("/add", verifyJWT, uploading.any("image", "image2"), addCategory);
router.get("/:id", categoryId);
router.get("/search/:name", categorySearch);
router.delete("/delete/:id", verifyJWT, categoryDelete);
router.put(
  "/update/:id",
  verifyJWT,
  uploading.any("image", "image2"),
  categoryUpdate,
);

module.exports = router;
