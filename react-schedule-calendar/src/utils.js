export function findAvailableTimeSlots(meetings, selectedDate) {
  const workingHours = { start: 8 * 60, end: 18 * 60 };

  let busyTimeSlots = [];

  meetings.forEach((meeting) => {
    const meetingDate = new Date(meeting.date);
    const selectedDateObj = new Date(selectedDate);

    if (meetingDate.toDateString() === selectedDateObj.toDateString()) {
      const startTime = convertTimeToMinutes(meeting.startTime);
      const endTime = convertTimeToMinutes(meeting.endTime);

      busyTimeSlots.push({ start: startTime, end: endTime });
    }
  });

  let availableTimeSlots = [];

  for (
    let currentTime = workingHours.start;
    currentTime < workingHours.end;
    currentTime += 30
  ) {
    const nextTime = currentTime + 30;

    const isBusy = busyTimeSlots.some((busySlot) => {
      return (
        (currentTime >= busySlot.start && currentTime < busySlot.end) ||
        (nextTime > busySlot.start && nextTime <= busySlot.end)
      );
    });

    if (!isBusy) {
      availableTimeSlots.push({
        start: convertMinutesToTime(currentTime),
        end: convertMinutesToTime(nextTime),
      });
    }

    if (availableTimeSlots.length >= 5 || currentTime + 30 > workingHours.end) {
      break;
    }
  }
  return availableTimeSlots;
}

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}
