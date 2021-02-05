export function plural(type) {
  let plural = type + "s";

  // Handle special cases
  if (plural === "medias") {
    plural = type;
  }
  return plural;
}
