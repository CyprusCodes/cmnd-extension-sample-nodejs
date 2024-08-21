require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");

const getProductSchema = yupToJsonSchema(
  yup.object({
    product: yup.string().label("product").required("should be a string"),
  })
);
const putUserNameSchema = yupToJsonSchema(
  yup.object({
    name: yup.string().label("name").required("should be a string"),
  })
);

const echoUserSchema = yupToJsonSchema(
  yup.object({
    name: yup.string().label("name").required("should be a string"),
  })
);

// an example of a simple tool that returns the weather details of a city
const findProduct = async (product) => {
  const products = ["watch", "laptop", "car"];
  const foundProduct = products.includes(product);
  return foundProduct ? "Product found" : "Product not found";
};

// an example of a tool that uses the CMND's memory object feature to store some data
const putUserName = async (name, memory) => {
  memory["name"] = name;
  return {
    responseString: `Name ${name} saved to memory successfully`,
    memory: memory,
  };
};

// an example of a tool that uses the CMND's memory object feature to retrive some data
const echoUserName = async (name, memory) => {
  const userName = memory["name"];
  if (userName) {
    return {
      responseString: `Hello ${name} your name is saved in the memory as ${userName}`,
      memory: memory,
    };
  } else {
    return {
      responseString: "Name not found",
      memory: memory,
    };
  }
};

const tools = [
  {
    // an example where we are not using the prerequisites
    name: "product_finder",
    description: "checks if a product is available in the store",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: getProductSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: findProduct,
  },
  {
    // an example where we are using the prerequisites where the product_finder tool should be run before this tool
    name: "putUserName",
    description: "saves the username to the memory",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: ["product_finder"],
    parameters: putUserNameSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: putUserName,
  },
  {
    // an example where we are using the prerequisites where the putUserName and findProduct tool should be run before this tool
    name: "echoUserName",
    description: "echos the username saved in the memory",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: ["product_finder", "putUserName"],
    parameters: echoUserSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: echoUserName,
  },
];
module.exports = tools;
