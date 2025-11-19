const tools = require("./tools.js");

exports.handler = async (event) => {
  try {
    const { path, httpMethod } = event;

    if (path === "/cmnd-tools" && httpMethod === "GET") {
      // Handle GET /cmnd-tools
      const toolsMapped = tools.map((t) => ({
        name: t.name,
        description: t.description,
        jsonSchema: t.parameters,
        isDangerous: t.dangerous,
        functionType: t.functionType,
        isLongRunningTool: t.isLongRunningTool,
        rerun: t.rerun,
        prerequisites: t.prerequisites,
        postCallPrompt: t.postCallPrompt,
      }));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: toolsMapped }),
      };
    }

    if (path === "/run-cmnd-tool" && httpMethod === "POST") {
      // Handle POST /run-cmnd-tool
      const { toolName, props, memory } = JSON.parse(event.body);
      // remove organization / conversation metadata
      const conversationId = props.conversationId;
      delete props.conversationId;

      const chatbotConversationId = props.chatbotConversationId;
      delete props.chatbotConversationId;

      const organizationId = props.organizationId;
      delete props.organizationId;

      const toolToRun = tools.find((t) => t.name === toolName);
      if (!toolToRun) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Tool not found" }),
        };
      }

      const results = await toolToRun.runCmd(props, memory);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      };
    }

    // Default response for unsupported paths/methods
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Endpoint not found" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
