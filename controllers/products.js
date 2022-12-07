const dataModel = require("../model/model");
const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     let data = await userModel.findOne({ username });
//     if (data) {
//       if (bcrypt.compareSync(password, data.password)) {
//         //compare password with hashed password
//         token = jwt.sign(
//           { userId: data._id, username: username },
//           process.env.SECRET_KEY,
//           { expiresIn: "1h" }
//         );
//         return res
//           .status(200)
//           .json({ message: "Login Ssucees", _token: token });
//       } else {
//         res.status(401).json({ message: "unauthorized user" });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "Something went wrong" });
//   }
// };
async function login(req, res) {
  let { username, password } = req.body;
  const data = await userModel.findOne({ username: username });
  if (!data) {
    res.status(400).json({ err: 1, message: "Uname and pass does not match" });
  } else {
    if (bcrypt.compareSync(password, data.password)) {
      const token = jwt.sign(
        {
          userId: data._id,
          username: data.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ err: 0, message: "login successs", _token: token });
    } else {
      res
        .status(400)
        .json({ err: 1, message: "Username and pass does not match" });
    }
  }
}
function access(req, res) {
  //Bearer token
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) {
      res.status(400).json({ message: "Error : token was not provided" });
    } else {
      const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
      res
        .status(200)
        .json({ userId: decodeToken.userId, username: decodeToken.username });
    }
  } catch (error) {
    res.status(400).json({ message: "Token is invalid" });
  }
}

async function regis(req, res) {
  try {
    let { email, username, password } = req.body;
    let hashPassword = await bcrypt.hash(password, 10); //hashing password with 10 salt round
    let user = await userModel.findOne({ username }); //getting user document in user variable
    if (!user) {
      userData = new userModel({ email, username, password: hashPassword });
      userData.save();
      return res.status(200).json({ message: "USer Registered" });
    } else {
      res.status(400).json({ message: "USer already Registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
async function addProduct(req, res) {
  let { name, city } = req.body;

  try {
    const data = new dataModel({
      name: name,
      city: city,
    });
    const dataSave = await data.save();
    res.status(200).json({ message: "data added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getProduct(req, res) {
  try {
    const data = await dataModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function getProductbyId(req, res) {
  try {
    const id = req.params.id;
    const data = await dataModel.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const data = await dataModel.findByIdAndDelete(id);
    res.status(200).json("data deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const data = await dataModel.findByIdAndUpdate(id, updatedData, options);
    res.status(200).json("data updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  addProduct,
  getProduct,
  getProductbyId,
  deleteProduct,
  updateProduct,
  login,
  regis,
  access,
};
