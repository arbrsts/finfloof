// src/customFetch.ts
import { budget } from "./inMemoryBackend";

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
        result = budget.getBudget();
        break;
      case "assign":
        if (method === "POST" && body) {
          budget.assign(body.monthId, body.categoryId, body.amount);
          result = { success: true };
        }
        break;
      case "transactions":
        console.log("tes2", method, body);
        if (method === "GET") {
          result = budget.getBudget();
        } else if (method === "POST" && body) {
          const newTransaction = budget.addTransaction(
            body.accountId,
            body.monthId,
            body.categoryId,
            body.amount
          );
          result = newTransaction;
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
