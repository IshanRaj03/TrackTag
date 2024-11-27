import axios from "axios";
import * as cheerio from "cheerio";

export async function findProxy() {
  const freeProxyURL = process.env.NEXT_PUBLIC_freeProxy || "";

  interface Proxy {
    ip: string;
    port: number;
  }

  try {
    const response = await axios.get(freeProxyURL, { responseType: "text" });

    // This code is for using the api

    // const proxies: Proxy[] = response.data
    //   .split("\n")
    //   .map((proxyString: string) => {
    //     const [ip, port] = proxyString.trim().split(":");
    //     return { ip, port: parseInt(port, 10) };
    //   })
    //   .filter((proxy: Proxy) => proxy.ip && !isNaN(proxy.port));

    // #read - only - cursor - text - area;
    // .react-blob-textarea.react-blob-print-hide

    const url =
      "https://github.com/Zaeem20/FREE_PROXIES_LIST/blob/master/http.txt";

    const res = await axios.get(url);
    // console.log("Response:", res.data);
    const $ = cheerio.load(res.data);
    const proxies: Proxy[] = [];
    const proxy = $(".react-blob-textarea.react-blob-print-hide");
    console.log("Proxy:", proxy.text());
    proxy.each((index, element) => {
      console.log("Element:", $(element).text());
      const ip = $(element).text().split(":")[0];
      const port = $(element).text().split(":")[1];
      proxies.push({ ip, port: parseInt(port) });
    });

    console.log("Proxies:", proxies);
    const proxyChecks: Promise<Proxy | null>[] = proxies.map(
      async (proxy: Proxy): Promise<Proxy | null> => {
        console.log("Testing Proxy:", proxy);
        try {
          const response = await axios.get<{ ip: string }>(
            "https://api.ipify.org",
            {
              proxy: {
                host: proxy.ip,
                port: proxy.port,
              },
              timeout: 10000, // Increased timeout
            }
          );
          return response.data ? proxy : null;
        } catch (error: any) {
          console.error(
            `Failed to connect via proxy ${proxy.ip}:${proxy.port}`,
            error.message
          );
          return null;
        }
      }
    );

    // Filter out null values to get only the valid proxies
    const validProxies = (await Promise.all(proxyChecks)).filter(
      (proxy): proxy is Proxy => proxy !== null
    );
    validProxies.forEach((proxy) => console.log("Valid Proxy:", proxy));
    console.log("Valid Proxies:", validProxies);

    return validProxies;
  } catch (error: any) {
    throw new Error(`Failed to retrieve proxy data: ${error.message}`);
  }
}
