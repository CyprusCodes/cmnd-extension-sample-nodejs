require("dotenv").config();
const yup = require("yup");
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

const getPhoneNumberSchema = yupToJsonSchema(yup.object({}));

// an example of a simple tool that returns the weather details of a city
const findProduct = (product) => {
  const products_array = ["watch", "laptop", "car"];
  const foundProduct = products_array.includes(product);
  return foundProduct ? "Product found" : "Product not found";
};

// an example of a tool that uses the CMND's memory object feature to store some data
const putUserName = ({ name }, memory) => {
  memory["name"] = name;
  return {
    responseString: `Name ${name} saved to memory successfully`,
    memory: memory,
  };
};

// an example of a tool that uses the CMND's memory object feature to retrive some data
const echoUserName = ({ name }, memory) => {
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

// an example of a tool that uses the context CMND passes to every tool call
// senderPhoneNumber is only set on WhatsApp; turn on "require phone number" on the
// chatbot so it is always known
const getPhoneNumber = (props, memory, context) => {
  const phoneNumber = context.senderPhoneNumber;
  if (!phoneNumber) {
    return {
      responseString: "The user's phone number is not available",
      memory: memory,
    };
  }
  return {
    responseString: `The user's phone number is ${phoneNumber}`,
    memory: memory,
  };
};

const tools = [
  {
    // an example where we are not using the prerequisites
    // an example of a tool with a postCallPrompt
    // an example of a tool with rerun false and rerunWithDifferentParameters false (CMND is not running the tool again)
    name: "product_finder",
    description: "checks if a product is available in the store",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: getProductSchema,
    rerun: "allowedWithDifferentParameters",
    runCmd: findProduct,
    postCallPrompt: "if the is not found, ask the user to try another product",
  },
  {
    // an example where we are using the prerequisites where the product_finder tool should be run before this tool
    // an example of a tool without a postCallPrompt
    name: "putUserName",
    description: "saves the username to the memory",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: putUserNameSchema,
    rerun: "allowed",
    runCmd: putUserName,
  },
  {
    // an example where we are using the prerequisites where the putUserName and findProduct tool should be run before this tool
    // an example of a tool with a postCallPrompt
    name: "echoUserName",
    description: "echos the username saved in the memory",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: ["putUserName"],
    parameters: echoUserSchema,
    rerun: "disabled",
    runCmd: echoUserName,
    postCallPrompt:
      "if the name is found, echo the name, if not found, ask the user to save the name first",
  },
  {
    // an example of a tool that reads the context instead of its arguments
    name: "getPhoneNumber",
    description: "gets the phone number of the user the assistant is talking to",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: getPhoneNumberSchema,
    rerun: "allowed",
    runCmd: getPhoneNumber,
  },
];
module.exports = tools;
