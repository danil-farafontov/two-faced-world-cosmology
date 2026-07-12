import { createI18n } from 'vue-i18n';
import ru from './ru.json';
import en from './en.json';

const russianPluralization = (choice, choicesLength) => {
  console.log(choice);
  console.log(choicesLength);
  if (choice === 0) {
    return 0;
  }

  const teen = choice % 100 > 10 && choice % 100 < 20;
  const endsWithOne = choice % 10 === 1;

  if (choicesLength < 4) {
    return choicesLength === 2 ? (endsWithOne && !teen ? 0 : 1) : 0;
  }
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }
  return 3;
};

const messages = {
  ru,
  en
};

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  messages,
  pluralizationRules: {
    ru: russianPluralization
  }
});

export default i18n;