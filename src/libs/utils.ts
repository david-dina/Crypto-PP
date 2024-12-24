export function absoluteUrl(path: string) {
  return `${process.env.SITE_URL || "http://localhost:3000"}${path}`;
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Ensure two digits for seconds
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}
