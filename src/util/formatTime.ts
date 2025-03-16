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

export const formatClockInTime = (clockedInAt: { $date: string } | string) => {
  const dateString = typeof clockedInAt === "string" ? clockedInAt : clockedInAt.$date;
  
  const clockInDate = new Date(dateString);
  const now = Date.now();
  const timeDifference = now - clockInDate.getTime();

  return formatTime(timeDifference);
};

export const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}
