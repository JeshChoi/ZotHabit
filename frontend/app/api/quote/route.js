export async function GET() {
    const apiUrl = "https://quoteslate.vercel.app/api/quotes/random";
    
    try {
      const response = await fetch(`${apiUrl}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ message: "Failed to fetch quote." }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const data = await response.json();
      const quote = {
        text: data.quote || "No quote available.",
        author: data.author || "Unknown",
      };
      console.log(quote)
  
      return new Response(JSON.stringify(quote), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      return new Response(JSON.stringify({ message: "Internal server error." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  