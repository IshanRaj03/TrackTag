import axios from "axios";
import * as cheerio from "cheerio";

export async function findProxy() {
  const url =
    "https://github.com/Zaeem20/FREE_PROXIES_LIST/blob/master/http.txt";

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const proxies = [];
  const proxy = $(".react-blob-textarea");
  proxy.each((index, element) => {
    const ip = $(element).text().split(":")[0];
    const port = $(element).text().split(":")[1];
    proxies.push({ ip, port });
  });
}
