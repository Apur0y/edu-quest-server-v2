export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "EduQuest API",
    version: "2.0.0",
    description:
      "Modernized EduQuest backend API — 100% compatible with original MongoDB/Express implementation.",
  },
  servers: [
    { url: "http://localhost:5000", description: "Development" },
    { url: "https://your-production-domain.com", description: "Production" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          phone: { type: "string" },
          picture: { type: "string" },
          role: { type: "string", enum: ["student", "tutor", "admin"] },
          isVerified: { type: "boolean" },
          status: { type: "string", enum: ["active", "banned", "suspended"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Session: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          registrationFee: { type: "number" },
          status: { type: "string", enum: ["pending", "approved", "rejected"] },
          tutorId: { type: "string" },
          session: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          statusCode: { type: "number" },
          errors: { type: "array" },
        },
      },
    },
  },
  paths: {
    "/jwt": {
      post: {
        tags: ["Auth"],
        summary: "Issue JWT token",
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", properties: { email: { type: "string" } } },
              example: { email: "user@example.com" },
            },
          },
        },
        responses: {
          "200": {
            description: "JWT token issued",
            content: {
              "application/json": {
                schema: { type: "object", properties: { token: { type: "string" } } },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: { "200": { description: "List of users" } },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
              example: { email: "user@example.com", firstName: "John", role: "student" },
            },
          },
        },
        responses: { "200": { description: "User created" } },
      },
    },
    "/users/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update user role",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", properties: { role: { type: "string" } } },
              example: { role: "tutor" },
            },
          },
        },
        responses: {
          "200": { description: "Role updated" },
          "404": { description: "User not found" },
        },
      },
    },
    "/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "Get sessions (optionally exclude by status)",
        parameters: [
          {
            in: "query",
            name: "filter",
            schema: { type: "string" },
            description: "Comma-separated statuses to EXCLUDE (e.g. pending,rejected)",
          },
        ],
        responses: { "200": { description: "List of sessions" } },
      },
      post: {
        tags: ["Sessions"],
        summary: "Create a session",
        responses: { "200": { description: "Session created" } },
      },
    },
    "/sessions/{id}": {
      get: {
        tags: ["Sessions"],
        summary: "Get session by ID",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Session found" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Sessions"],
        summary: "Update session status and fee",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  isFree: { type: "boolean" },
                  amount: { type: "number" },
                },
              },
              example: { status: "approved", isFree: false, amount: 500 },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Sessions"],
        summary: "Delete a session",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/booked": {
      get: { tags: ["Booked"], summary: "Get all bookings", responses: { "200": { description: "List" } } },
      post: { tags: ["Booked"], summary: "Create a booking", responses: { "200": { description: "Created" } } },
    },
    "/booked/{id}": {
      get: {
        tags: ["Booked"],
        summary: "Get booking by ID",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Found" }, "404": { description: "Not found" } },
      },
    },
    "/notes": {
      get: { tags: ["Notes"], summary: "Get all notes", responses: { "200": { description: "List" } } },
      post: { tags: ["Notes"], summary: "Create a note", responses: { "200": { description: "Created" } } },
    },
    "/notes/{id}": {
      put: {
        tags: ["Notes"],
        summary: "Update a note",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              example: { title: "My Note", description: "Note content" },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Notes"],
        summary: "Delete a note",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/materials": {
      get: { tags: ["Materials"], summary: "Get all materials", responses: { "200": { description: "List" } } },
      post: {
        tags: ["Materials"],
        summary: "Upload a material (multipart/form-data)",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  sessionId: { type: "string" },
                  tutorEmail: { type: "string" },
                  link: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/materials/{id}": {
      delete: {
        tags: ["Materials"],
        summary: "Delete a material",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/reviews": {
      get: { tags: ["Reviews"], summary: "Get all reviews", responses: { "200": { description: "List" } } },
      post: { tags: ["Reviews"], summary: "Create a review", responses: { "200": { description: "Created" } } },
    },
    "/create-ssl-payment": {
      post: {
        tags: ["Payments"],
        summary: "Initiate SSLCommerz payment",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  registrationFee: { type: "number" },
                  customerName: { type: "string" },
                  customerEmail: { type: "string" },
                  enrollmentId: { type: "string" },
                },
              },
              example: { registrationFee: 500, customerEmail: "student@example.com" },
            },
          },
        },
        responses: {
          "200": {
            description: "Payment initiated",
            content: {
              "application/json": {
                example: {
                  transactionId: "abc123",
                  gatewayUrl: "https://sandbox.sslcommerz.com/...",
                  status: "SUCCESS",
                },
              },
            },
          },
        },
      },
    },
  },
};
