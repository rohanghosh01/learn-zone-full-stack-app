export async function getJson() {
  // The URL of the JSON data
  let url = "https://assets.heykids.app/content/language/en.json";

  try {
    const response = await fetch(url, {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    const jsonString = JSON.stringify(jsonData, null, 2);
    return jsonString;
  } catch (error: any) {
    console.error(`Failed to fetch JSON data: ${error.message}`);
  }
}

getJson();
