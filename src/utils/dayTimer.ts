export interface DayTimeStats {
  now: Date;
  secondsPassed: number;
  totalSecondsInDay: number;
  secondsRemaining: number;
  percentagePassed: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemainingInMin: number;
  formattedTime: string;
  formattedDate: string;
  dateKey: string; // YYYY-MM-DD
}

export function getDayTimeStats(date: Date = new Date()): DayTimeStats {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const secondsPassed = hours * 3600 + minutes * 60 + seconds;
  const totalSecondsInDay = 86400; // 24 * 60 * 60
  const secondsRemaining = totalSecondsInDay - secondsPassed;

  const percentagePassed = (secondsPassed / totalSecondsInDay) * 100;

  const hoursRemaining = Math.floor(secondsRemaining / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);
  const secondsRemainingInMin = secondsRemaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Spanish date formatting
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = date.toLocaleDateString('es-ES', options);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const dateKey = `${year}-${month}-${day}`;

  return {
    now: date,
    secondsPassed,
    totalSecondsInDay,
    secondsRemaining,
    percentagePassed,
    hoursRemaining,
    minutesRemaining,
    secondsRemainingInMin,
    formattedTime,
    formattedDate,
    dateKey,
  };
}

export function formatSecondsToHHMMSS(seconds: number): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
