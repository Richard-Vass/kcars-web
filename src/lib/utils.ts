export function proxyImageUrl(url: string): string {
  if (!url) return "";
  // autobazar.eu - convert thumbs to full-size pics
  if (url.includes("autobazar.eu/thumbs/")) {
    // thumbs/9773/32575547_big.jpg → pics/9773/32575547_1.jpg
    // thumbs/9773/32575547_2.jpg → pics/9773/32575547_2.jpg
    let fullUrl = url.replace("/thumbs/", "/pics/");
    // _big.jpg is the first photo → _1.jpg
    fullUrl = fullUrl.replace("_big.jpg", "_1.jpg");
    return fullUrl;
  }
  // autobazar.eu direct pics URLs - use as is
  if (url.includes("autobazar.eu/pics/")) return url;
  // img.autobazar.eu needs proxy
  if (url.includes("img.autobazar.eu/foto/")) {
    return url.replace("https://img.autobazar.eu/foto/", "/api/img/");
  }
  return url;
}

// Thumbnail URL for card listings (smaller, faster loading)
export function thumbImageUrl(url: string): string {
  if (!url) return "";
  // Keep thumbs for card listings - they load faster
  if (url.includes("autobazar.eu/thumbs/")) return url;
  // Convert pics back to thumbs for listings
  if (url.includes("autobazar.eu/pics/")) {
    return url.replace("/pics/", "/thumbs/");
  }
  return url;
}
