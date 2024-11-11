import { encode } from "querystring";

export class WolframAPI {
  private appId: string;
  private baseUrl = "http://api.wolframalpha.com/v2";

  constructor(appId: string) {
    this.appId = appId;
  }

  async getCurveData(query: string) {
    const params = encode({
      appid: this.appId,
      input: query,
      format: "image,plaintext",
      output: "json",
    });
    const response = await fetch("$(this.baseUrl}/query?${params}");
    if (!response.ok) {
      throw new Error("Wolfram Alpha API error: ${response.statusText}");
    }
    return response.json();
  }
}
