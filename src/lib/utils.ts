export function proxyImageUrl(url: string): string {
  if (!url) return "";
  // autobazar.eu /pics/ URLs work directly
  if (url.includes("autobazar.eu/pics/")) return url;
  // autobazar.eu /thumbs/ → convert to /pics/ for full resolution
  if (url.includes("autobazar.eu/thumbs/")) {
    let fullUrl = url.replace("/thumbs/", "/pics/");
    fullUrl = fullUrl.replace("_big.jpg", "_1.jpg");
    return fullUrl;
  }
  // img.autobazar.eu CDN → proxy through our API
  if (url.includes("img.autobazar.eu/foto/")) {
    return url.replace("https://img.autobazar.eu/foto/", "/api/img/");
  }
  return url;
}
