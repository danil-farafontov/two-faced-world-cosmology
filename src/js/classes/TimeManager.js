export class TimeManager {
  constructor(config = {}) {
    this.simTime = 0;              // Текущее время симуляции в ЧАСАХ (дробное число)
    this._isPlaying = true;        // Приватное свойство для паузы
    this.speedMultiplier = 1;      // Сколько симуляционных ЧАСОВ проходит за 1 реальную СЕКУНДУ
    this.lastFrameTime = performance.now();

    this.globalEvents = [];        // Массив для хранения исторических событий лора

    // Константы вашего лора
    this.HOURS_PER_MIMAS_DAY = 24;

    this.calendar = {
      daysInMonth: 32,             // Двоичный месяц
      monthsInYear: 8,             // Двоичный год (всего 256 дней Мимаса в году)
      monthNames: config.monthNames || ['Янус', 'Эпиметей', 'Мимас', 'Энцелад', 'Тефия', 'Диона', 'Рея', 'Титан'],
      startYear: config.startYear || 1
    };

    // Предрасчет весов для быстрой конвертации дат
    this.HOURS_PER_MONTH = this.HOURS_PER_MIMAS_DAY * this.calendar.daysInMonth; // 768 часов
    this.HOURS_PER_YEAR = this.HOURS_PER_MONTH * this.calendar.monthsInYear;     // 6144 часа
  }

  // Геттер и Сеттер для красивого управления паузой (как просил ваш ИИ)
  get playing() {
    return this._isPlaying;
  }

  set playing(value) {
    this._isPlaying = value;
    // ОЧЕНЬ ВАЖНО: при снятии с паузы сбрасываем таймер кадра на текущий момент,
    // чтобы не было микро-рывка, если код паузы перепишется в будущем
    if (value === true) {
      this.lastFrameTime = performance.now();
    }
  }

  // Главный цикл (вызывается в requestAnimationFrame)
  update() {
    const now = performance.now();
    const dtSeconds = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now; // Таймер кадра обновляется ВСЕГДА, предотвращая прыжки времени

    if (!this._isPlaying) return;

    const previousTime = this.simTime;

    // Прибавляем симуляционные часы, прошедшие за этот кадр
    this.simTime += dtSeconds * this.speedMultiplier;

    // Проверяем глобальные события по ходу движения времени вперед
    if (this.simTime > previousTime) {
      this._checkEvents(previousTime, this.simTime);
    }
  }

  // 1. Метод ручной установки времени (для ползунка таймлайна или тестов)
  setSimTime(hours) {
    this.simTime = hours;
    this._syncEventTriggers();
  }

  // 2. Конвертация: симуляционные часы -> красивый объект фэнтези-даты
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

  // 3. Конвертация (ОБРАТНАЯ): объект даты -> симуляционные часы (для UI календаря)
  // Принимает объект вида: { year: 5, month: 2, day: 10, hour: 14 }
  dateToSimTime(dateObj) {
    const relativeYear = dateObj.year - this.calendar.startYear;
    const month = dateObj.month || 0; // Индекс месяца от 0 до 7
    const day = (dateObj.day || 1) - 1; // Дни переводим в индекс от 0
    const hour = dateObj.hour || 0;

    return (
      relativeYear * this.HOURS_PER_YEAR +
      month * this.HOURS_PER_MONTH +
      day * this.HOURS_PER_MIMAS_DAY +
      hour
    );
  }

  // 4. Добавление глобального события лора (например, по часам или по объекту даты)
  addGlobalEvent(timeInput, title, callback) {
    // Метод умный: принимает или готовые часы (число), или объект даты
    const targetHours = typeof timeInput === 'number' ? timeInput : this.dateToSimTime(timeInput);

    this.globalEvents.push({
      title,
      targetTime: targetHours,
      callback,
      triggered: false
    });
  }

  // Оптимизированная проверка триггеров событий (без лагов)
  _checkEvents(fromTime, toTime) {
    for (let i = 0; i < this.globalEvents.length; i++) {
      const event = this.globalEvents[i];

      // Если симуляция идет вперед и мы пересекли временную отметку события
      if (!event.triggered && event.targetTime <= toTime) {
        event.triggered = true;
        event.callback(event);
      }
    }
  }

  // Сброс триггеров при перемотке времени назад/вперед через календарь
  _syncEventTriggers() {
    this.globalEvents.forEach(event => {
      event.triggered = event.targetTime < this.simTime;
    });
  }

  // Удобный метод для вывода текущей даты симуляции на UI-часы
  getFormattedTime() {
    const c = this.simTimeToDate(this.simTime);
    const pad = (num) => String(num).padStart(2, '0');
    // Исправлено: теперь выводится "г." вместо "сек."
    return `${pad(c.day)} ${c.monthName} ${c.year} г., ${pad(c.hour)}:00`;
  }

}
