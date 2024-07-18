require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");

const getProductSchema = yup.object({
  product: yup.string().label("product").required("should be a string"),
});
const getProductsJSONSchema = yupToJsonSchema(getProductSchema);
const PRODUCT_FINDER = {
  name: "product_finder",
  description:
    "finds and returns dummy products details from json dummy datas based on the product name passed to it",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getProductsJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ product }, memory) => { // memory comes from the server
    try {
      const { data } = await axios.get(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(product)}`
      );
      memory[product] = JSON.stringify(data); // the product will be saved in the memory
      return {
        responseString: "product found", // this string will be returned to the chat bot
        memory: memory // memory is returned back to the server after being updated 
      }
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

const weatherCitySchema = yup.object({
  city: yup.string().label("city").required("should be a string"),
});
const weatherCityJSONSchema = yupToJsonSchema(weatherCitySchema);
const WEATHER_FROM_LOCATION = {
  name: "city_weather_data",
  description: "gets the weather details from a given city name",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: weatherCityJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ city }) => {
    const ApiKey = process.env.WEATHER_API_KEY;
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`
      );
      return JSON.stringify({
        weather: data.weather[0].description,
        main: data.main,
        coords: data.coord,
      });
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

const getFilePathSchema = yup.object({
  filePath: yup.string().label("filePath").required("should be a file path"),
});
const getFilePathJSONSchema = yupToJsonSchema(getFilePathSchema);
const FILE_READER = {
  name: "file_reader",
  description:
    "returns the contents of a file given its filepath in the repository",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getFilePathJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ filePath }) => {
    try {
      const buffer = fs.readFileSync(filePath);
      const fileContents = buffer.toString("utf8");
      return fileContents;
    } catch (error) {
      return "An error ocured while looking for the file content";
    }
  },
};

const tools = [FILE_READER, PRODUCT_FINDER, WEATHER_FROM_LOCATION];
module.exports = tools;
