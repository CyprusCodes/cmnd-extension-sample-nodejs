## Getting Started:

This repository contains a sample CMND extension. You can start building your own tools by editing the `tools.js` file.

## Context

Besides its arguments, CMND sends every tool call some context about the conversation. It is the third argument of a tool's `runCmd`, after the props and memory: `runCmd(props, memory, context)`.

| Key | Value |
| --- | --- |
| `organizationId` | The organization the conversation belongs to |
| `chatbotId` | The chatbot the user is talking to |
| `chatbotConversationId`, `chatbotConversationRef` | The chatbot conversation |
| `conversationId` | The conversation, outside of chatbots |
| `senderPhoneNumber` | WhatsApp only: the user's phone number, or `null` when it is unknown |

WhatsApp hides the phone number of users with a username. Turn on "require phone number" on the chatbot so it asks those users to share it, and `senderPhoneNumber` is always set. See `getPhoneNumber` in `tools.js`.
