export function proxyImageUrl(url: string): string {
  if (!url) return "";
  // Proxy autobazar.eu images through our rewrite to avoid CORS/hotlink blocking
  if (url.includes("img.autobazar.eu/foto/")) {
    return url.replace("https://img.autobazar.eu/foto/", "/img-proxy/");
  }
  return url;
}
