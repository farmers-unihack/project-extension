export const formatTime = (milliseconds: number) => {
  if (milliseconds < 0) {
    return "00:00";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateColorsTime = (duration: number) => {
  const quarter = duration / 4;
  const half = duration / 2;
  const twoThirds = (duration * 2) / 3;

  return [quarter, half, twoThirds, 0];
};

