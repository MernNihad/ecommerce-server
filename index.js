import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { AdminModel } from "./models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ProductModel } from "./models/Product.js";

const app = express();
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

const mongooseConnection =async () => {
  try {
    const db_conn = await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("connected...");
  } catch (error) {
    console.log(error.message)
  }
};

app.post("/api/v1/admin/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    if (!name) {
      return res.status(400).send({ message: `Name field can not be empty` });
    }

    const isMailExist = await AdminModel.findOne({ email: req.body.email });

    if (isMailExist) {
      return res
        .status(409)
        .send({ message: "User already exist with this Email Id." });
    }

    const hash = bcrypt.hashSync(req.body.password, 10);

    const newAdmin = new AdminModel({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });

    const savedAdmin = await newAdmin.save();

    return res.status(201).json({ message: "User created", data: savedAdmin });
  } catch (error) {
    return res
      .status(400)
      .send({ message: error.message || "internal server error" });
  }
});

app.post("/api/v1/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    console.log(req.body);
    const dat = await AdminModel.find();
    console.log(dat);

    const isMailExist = await AdminModel.findOne({ email: req.body.email });

    console.log(isMailExist);
    if (isMailExist) {
      // const isMatchPassword = await bcrypt.compare(req.body.password, isMailExist.password);
      let isMatchPassword = bcrypt.compareSync(
        req.body.password,
        isMailExist.password
      );

      console.log(isMatchPassword);
      if (!isMatchPassword) {
        return res.status(401).send({ message: "Invalid Password!" });
      } else {
        // create token
        const token = jwt.sign({ _id: isMailExist._id }, "example", {
          expiresIn: "3h",
        });

        return res
          .status(200)
          .send({ message: "User logged", data: { token, user: isMailExist } });
      }
    } else {
      return res.status(409).send({ message: "User not exist." });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ message: error.message || "internal server error" });
  }
});

app.get("/api/v1/admin/profile", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  var token = req.headers.authorization;

  var decoded = jwt.verify(token, "example");

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const isUser = await AdminModel.findById(decoded._id);

  if (!isUser) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.status(200).send({ message: "profile", data: { user: isUser } });
});

app.post("/api/v1/admin/product/add-product", async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    var token = req.headers.authorization;

    var decoded = jwt.verify(token, "example");

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const { name, price, description, ImageLink } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    if (!price) {
      return res.status(400).send({ message: "Pisce is required" });
    }
    if (!description) {
      return res.status(400).send({ message: "description is required" });
    }

    if (!ImageLink) {
      return res.status(400).send({ message: "ImageLink is required" });
    }

    const dat = new ProductModel({
        description:req.body.description,
        imageLink:'',
        name:req.body.name,
        price:req.body.price
    })
    console.log(dat);

    const isMailExist = await AdminModel.findOne({ email: req.body.email });

    console.log(isMailExist);
    if (isMailExist) {
      // const isMatchPassword = await bcrypt.compare(req.body.password, isMailExist.password);
      let isMatchPassword = bcrypt.compareSync(
        req.body.password,
        isMailExist.password
      );

      console.log(isMatchPassword);
      if (!isMatchPassword) {
        return res.status(401).send({ message: "Invalid Password!" });
      } else {
        // create token
        const token = jwt.sign({ _id: isMailExist._id }, "example", {
          expiresIn: "3h",
        });

        return res
          .status(200)
          .send({ message: "User logged", data: { token, user: isMailExist } });
      }
    } else {
      return res.status(409).send({ message: "User not exist." });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ message: error.message || "internal server error" });
  }
});

app.listen(8080, () => {
  mongooseConnection();
  console.log(`port running 8080`);
});
