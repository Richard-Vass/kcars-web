export function proxyImageUrl(url: string): string {
  if (!url) return "";
  // autobazar.eu thumbs URLs work directly (no hotlink protection)
  if (url.includes("autobazar.eu/thumbs/")) return url;
  // img.autobazar.eu needs proxy
  if (url.includes("img.autobazar.eu/foto/")) {
    return url.replace("https://img.autobazar.eu/foto/", "/api/img/");
  }
  return url;
}
