const endpoint = 'https://jobbyist-za.vercel.app/api/index-url';
const payload = {
  url: 'https://jobbyist-za.vercel.app/',
};

async function testIndexingApi() {
  try {
    if (typeof fetch !== 'function') {
      throw new Error('Native fetch is not available in this Node runtime. Please use Node 20+.');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`HTTP Status: ${response.status}`);

    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = { error: 'Response was not valid JSON.' };
    }

    console.log('Response Body:');
    console.log(JSON.stringify(responseBody, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause = error instanceof Error && error.cause ? `\nCause: ${String(error.cause)}` : '';
    console.error(`Request failed: ${message}${cause}`);
    process.exitCode = 1;
  }
}

void testIndexingApi();
