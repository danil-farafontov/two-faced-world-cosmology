/**
 * Creates a banded texture for a gas giant (Saturn).
 */
export function createGasGiantTexture(textureGeneratorParams) {
  const baseColor = textureGeneratorParams.baseColor ?? 0xFFFFFF;
  const ctx = textureGeneratorParams.ctx;

  // Base tones from the main color
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;

  // Band gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  const shade = (v, f) => Math.min(255, Math.floor(v * f));
  const shadeDark = (v, f) => Math.max(0, Math.floor(v * f));

  gradient.addColorStop(0, `rgb(${shade(r, 0.7)},${shade(g, 0.7)},${shade(b, 0.7)})`);
  gradient.addColorStop(0.15, `rgb(${shade(r, 0.85)},${shade(g, 0.85)},${shade(b, 0.85)})`);
  gradient.addColorStop(0.3, `rgb(${shadeDark(r, 0.6)},${shadeDark(g, 0.6)},${shadeDark(b, 0.6)})`);
  gradient.addColorStop(0.45, `rgb(${shade(r, 1.05)},${shade(g, 1.05)},${shade(b, 1.05)})`);
  gradient.addColorStop(0.5, `rgb(${shade(r, 0.85)},${shade(g, 0.85)},${shade(b, 0.85)})`);
  gradient.addColorStop(0.65, `rgb(${shade(r, 0.75)},${shade(g, 0.75)},${shade(b, 0.75)})`);
  gradient.addColorStop(0.8, `rgb(${shadeDark(r, 0.65)},${shadeDark(g, 0.65)},${shadeDark(b, 0.65)})`);
  gradient.addColorStop(1, `rgb(${shadeDark(r, 0.55)},${shadeDark(g, 0.55)},${shadeDark(b, 0.55)})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  // Noise across bands
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 256; x += 4) {
      const noise = Math.random() * 20 - 10;
      ctx.fillStyle = `rgba(${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${Math.abs(noise) / 255})`;
      ctx.fillRect(x, y, 4, 1);
    }
  }
}

export function createStarTexture(textureGeneratorParams) {
  const baseColor = textureGeneratorParams.baseColor ?? 0xFFFFFF;
  const ctx = textureGeneratorParams.ctx;

  // Разбираем HEX-число на RGB компоненты
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;

  // Заливаем фон базовым цветом звезды
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 256, 128);

  // Создаем горизонтальный градиент, который имитирует затухание яркости к краям диска (эффект объема)
  const gradient = ctx.createLinearGradient(0, 0, 256, 0);

  // В центре (на экваторе сферы) звезда горит ярче всего (почти белая)
  gradient.addColorStop(0, `rgba(255, 255, 255, 0.3)`);
  gradient.addColorStop(0.25, `rgba(${r},${g},${b}, 0)`);
  gradient.addColorStop(0.5, `rgba(255, 255, 255, 0.7)`); // Центр развертки
  gradient.addColorStop(0.75, `rgba(${r},${g},${b}, 0)`);
  gradient.addColorStop(1, `rgba(255, 255, 255, 0.3)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  // Добавляем мелкую плазменную зернистость (солнечные гранулы)
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 128;
    const size = Math.random() * 2 + 1;
    // Случайные яркие и темные точки плазмы
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(x, y, size, size);
  }
}
