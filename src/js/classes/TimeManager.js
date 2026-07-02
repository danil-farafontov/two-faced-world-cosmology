export class TimeManager {
  constructor(config = {}) {
    this.simTime = 0;              // Current simulation time in HOURS (float number)
    this._isPlaying = true;        // private field for pause
    this.speedMultiplier = 1;      // How many simulation HOURS pass per 1 real SECOND
    this.lastFrameTime = performance.now();

    this.globalEvents = [];        // Array to store historical lore events

    // Константы вашего лора
    this.HOURS_PER_MIMAS_DAY = 24;

    this.calendar = {
      daysInMonth: 32,             // Binary month
      monthsInYear: 8,             // Binary year (256 Mimas'es days in a year)
      monthNames: config.monthNames || [
        'Янус', 'Эпиметей', 'Мимас', 'Энцелад', 'Тефия', 'Диона', 'Рея', 'Титан'
      ],
      startYear: config.startYear || 1
    };

    // Pre-calculated weights for quick date conversion
    this.HOURS_PER_MONTH = this.HOURS_PER_MIMAS_DAY * this.calendar.daysInMonth; // 768 hours
    this.HOURS_PER_YEAR = this.HOURS_PER_MONTH * this.calendar.monthsInYear;     // 6144 hours
  }

  get playing() {
    return this._isPlaying;
  }

  set playing(value) {
    this._isPlaying = value;
    // VERY IMPORTANT: reset lastFrameTime to current time
    // to prevent micro lag
    /*if (value === true) {
      this.lastFrameTime = performance.now();
    }*/
  }

  // Main loop (called in requestAnimationFrame)
  update() {
    const now = performance.now();
    const dtSeconds = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now; // updated ALWAYS, prevent jumps in time

    if (!this._isPlaying) return;

    const previousTime = this.simTime;

    // Adding simulation hours passed by this frame
    this.simTime += dtSeconds * this.speedMultiplier;

    // check global historical lore events while time moving forward
    if (this.simTime > previousTime) {
      this._checkEvents(previousTime, this.simTime);
    }
  }

  // 1. Function to set time manually (for timeline slider or for testing)
  setSimTime(hours) {
    this.simTime = hours;
    this._syncEventTriggers();
  }

  // 2. Convert simulation hours -> nive object with fantasy date
  simTimeToDate(hoursFloat) {
    const totalHours = Math.floor(hoursFloat);
    const totalDays = Math.floor(totalHours / this.HOURS_PER_MIMAS_DAY);

    const hour = totalHours % this.HOURS_PER_MIMAS_DAY;
    const daysInYear = this.calendar.daysInMonth * this.calendar.monthsInYear;

    const year = Math.floor(totalDays / daysInYear) + this.calendar.startYear;
    const dayOfYear = totalDays % daysInYear;

    const monthIndex = Math.floor(dayOfYear / this.calendar.daysInMonth);
    const day = (dayOfYear % this.calendar.daysInMonth) + 1;

    return {
      year,
      month: monthIndex,
      monthName: this.calendar.monthNames[monthIndex] || 'Неизвестно',
      day,
      hour
    };
  }

  // 3. Reverse convert: date object -> sim hours (for UI of the calendar)
  // Accept object: { year: 5, month: 2, day: 10, hour: 14 }
  dateToSimTime(dateObj) {
    const relativeYear = dateObj.year - this.calendar.startYear;
    const month = dateObj.month || 0; // Month's index from 0 to 7
    const day = (dateObj.day || 1) - 1; // Days convert to indexes from 0
    const hour = dateObj.hour || 0;

    return (
      relativeYear * this.HOURS_PER_YEAR +
      month * this.HOURS_PER_MONTH +
      day * this.HOURS_PER_MIMAS_DAY +
      hour
    );
  }

  // 4. Add global historical lore event (for example by hours or by date object)
  addGlobalEvent(timeInput, title, callback) {
    // Smart function: accepts hours as number or date object
    const targetHours = typeof timeInput === 'number' ? timeInput : this.dateToSimTime(timeInput);

    this.globalEvents.push({
      title,
      targetTime: targetHours,
      callback,
      triggered: false
    });
  }

  // Optimzied check of event's triggers
  _checkEvents(fromTime, toTime) {
    for (let i = 0; i < this.globalEvents.length; i++) {
      const event = this.globalEvents[i];

      // If simulation going forward and we crossed event's time mark
      if (!event.triggered && event.targetTime <= toTime) {
        event.triggered = true;
        event.callback(event);
      }
    }
  }

  // Reset event's triggers on time scrolling via valendar
  _syncEventTriggers() {
    this.globalEvents.forEach(event => {
      event.triggered = event.targetTime < this.simTime;
    });
  }

  // Useful function to get current simulation time to display to time UI
  getFormattedTime() {
    const c = this.simTimeToDate(this.simTime);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(c.day)} ${c.monthName} ${c.year} г., ${pad(c.hour)}:00`;
  }

}
