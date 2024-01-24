export function toBytesInt32(num) {
  arr = new Uint8Array([
    (num & 0xff000000) >> 24,
    (num & 0x00ff0000) >> 16,
    (num & 0x0000ff00) >> 8,
    num & 0x000000ff,
  ]);
  return arr.buffer;
}

export function secondsToHms(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  let timeString = "";
  if (hours > 0) {
    timeString += hours + ":";
  }
  if (minutes < 10) {
    timeString += "0" + minutes + ":";
  } else {
    timeString += minutes + ":";
  }
  if (seconds < 10) {
    timeString += "0" + seconds;
  } else {
    timeString += seconds;
  }
  return timeString;
}
