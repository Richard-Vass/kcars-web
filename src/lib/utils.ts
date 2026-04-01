export function proxyImageUrl(url: string): string {
  if (!url) return "";
  // Proxy autobazar.eu images through our API to bypass hotlink protection
  if (url.includes("img.autobazar.eu/foto/")) {
    return url.replace("https://img.autobazar.eu/foto/", "/api/img/");
  }
  return url;
}
