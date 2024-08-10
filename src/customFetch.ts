// src/customFetch.ts
import { inMemoryBackend } from "./inMemoryBackend";

const USE_IN_MEMORY_BACKEND = true; // Set this to false to use a real API

export const customFetch: typeof fetch = async (
  input: Request,
  init?: RequestInit
) => {
  if (USE_IN_MEMORY_BACKEND) {
    let url: string;
    let method: string;
    let body: any;

    if (input instanceof Request) {
      url = input.url.split("/").slice(-1)[0];
      method = input.method;

      // Clone the request to read the body without consuming the original
      const clonedRequest = input.clone();
      const contentType = clonedRequest.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        try {
          body = await clonedRequest.json();
        } catch (error) {
          console.error("Error parsing request body:", error);
        }
      }
    } else {
      url = input.split("/").slice(-1)[0];
      method = "GET"; // Default to GET for string URLs
    }

    let result;
    switch (url) {
      case "budget":
        result = await inMemoryBackend.getBudget();
        break;
      case "assign":
        if (method === "POST" && body) {
          inMemoryBackend.assign(body.categoryId, body.amount);
          result = { success: true };
        }
        break;
      case "transactions":
        if (method === "GET") {
          result = await inMemoryBackend.getTransactions();
        } else if (method === "POST" && body) {
          inMemoryBackend.createTransaction(
            body.categoryId,
            body.accountId,
            body.amount
          );
          result = { success: true };
        }
        break;
      default:
        throw new Error(`Unhandled route: ${url}`);
    }

    const responseBody = JSON.stringify(result);

    const response = new Response(responseBody, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } else {
    // Use the real fetch function for API calls
    return fetch(input, init);
  }
};
