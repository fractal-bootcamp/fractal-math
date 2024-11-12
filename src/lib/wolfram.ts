import { encode } from "querystring";

/**
 * Class to interact with the Wolfram Alpha API
 * Used to fetch mathematical curve data and visualizations
 */
export class WolframAPI {
  // API key required for authentication
  private appId: string;
  // Base URL for all Wolfram Alpha API v2 endpoints
  private baseUrl = "http://api.wolframalpha.com/v2";

  /**
   * Initialize the API wrapper with an app ID
   * @param appId - Wolfram Alpha API key
   */
  constructor(appId: string) {
    this.appId = appId;
  }

  /**
   * Fetches curve data from Wolfram Alpha API
   * @param query - The mathematical curve ID to look up. This should match the wolframId field from the database (e.g. "Circle", "Ellipse").
   *  The API will return data about the mathematical properties and visualization of this curve.
   * @returns JSON response containing curve data, images and text descriptions
   */
  async getCurveData(query: string) {
    // Prepare query parameters
    const params = encode({
      appid: this.appId,
      input: query,
      format: "image,plaintext", // Request both image and text formats
      output: "json", // Get response in JSON format
    });

    // Make HTTP request to Wolfram API
    const response = await fetch(`${this.baseUrl}/query?${params}`);

    // Handle errors
    if (!response.ok) {
      throw new Error("Wolfram Alpha API error: ${response.statusText}");
    }

    // Parse and return JSON response
    return response.json();
  }
}
