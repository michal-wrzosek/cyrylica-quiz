export type RusLetter = {
  letter: string;
  pol: string;
};
export type RusLetters = { [key: string]: RusLetter };

export const rusLetters: RusLetters = {
  А: {
    letter: 'А',
    pol: 'a',
  },
  а: {
    letter: 'а',
    pol: 'a',
  },
  Б: {
    letter: 'Б',
    pol: 'b',
  },
  б: {
    letter: 'б',
    pol: 'b',
  },
  В: {
    letter: 'В',
    pol: 'w',
  },
  в: {
    letter: 'в',
    pol: 'w',
  },
  Г: {
    letter: 'Г',
    pol: 'g',
  },
  г: {
    letter: 'г',
    pol: 'g',
  },
  Д: {
    letter: 'Д',
    pol: 'd',
  },
  д: {
    letter: 'д',
    pol: 'd',
  },
  Е: {
    letter: 'Е',
    pol: 'je',
  },
  е: {
    letter: 'е',
    pol: 'je',
  },
  Ё: {
    letter: 'Ё',
    pol: 'jo',
  },
  ё: {
    letter: 'ё',
    pol: 'jo',
  },
  Ж: {
    letter: 'Ж',
    pol: 'ż',
  },
  ж: {
    letter: 'ж',
    pol: 'ż',
  },
  З: {
    letter: 'З',
    pol: 'z',
  },
  з: {
    letter: 'з',
    pol: 'z',
  },
  И: {
    letter: 'И',
    pol: 'i',
  },
  и: {
    letter: 'и',
    pol: 'i',
  },
  Й: {
    letter: 'Й',
    pol: 'j',
  },
  й: {
    letter: 'й',
    pol: 'j',
  },
  К: {
    letter: 'К',
    pol: 'k',
  },
  к: {
    letter: 'к',
    pol: 'k',
  },
  Л: {
    letter: 'Л',
    pol: 'ł',
  },
  л: {
    letter: 'л',
    pol: 'ł',
  },
  М: {
    letter: 'М',
    pol: 'm',
  },
  м: {
    letter: 'м',
    pol: 'm',
  },
  Н: {
    letter: 'Н',
    pol: 'n',
  },
  н: {
    letter: 'н',
    pol: 'n',
  },
  О: {
    letter: 'О',
    pol: 'o',
  },
  о: {
    letter: 'о',
    pol: 'o',
  },
  П: {
    letter: 'П',
    pol: 'p',
  },
  п: {
    letter: 'п',
    pol: 'p',
  },
  Р: {
    letter: 'Р',
    pol: 'r',
  },
  р: {
    letter: 'р',
    pol: 'r',
  },
  С: {
    letter: 'С',
    pol: 's',
  },
  с: {
    letter: 'с',
    pol: 's',
  },
  Т: {
    letter: 'Т',
    pol: 't',
  },
  т: {
    letter: 'т',
    pol: 't',
  },
  У: {
    letter: 'У',
    pol: 'u',
  },
  у: {
    letter: 'у',
    pol: 'u',
  },
  Ф: {
    letter: 'Ф',
    pol: 'f',
  },
  ф: {
    letter: 'ф',
    pol: 'f',
  },
  Х: {
    letter: 'Х',
    pol: 'ch',
  },
  х: {
    letter: 'х',
    pol: 'ch',
  },
  Ц: {
    letter: 'Ц',
    pol: 'c',
  },
  ц: {
    letter: 'ц',
    pol: 'c',
  },
  Ч: {
    letter: 'Ч',
    pol: 'cz',
  },
  ч: {
    letter: 'ч',
    pol: 'cz',
  },
  Ш: {
    letter: 'Ш',
    pol: 'sz',
  },
  ш: {
    letter: 'ш',
    pol: 'sz',
  },
  Щ: {
    letter: 'Щ',
    pol: 'szcz',
  },
  щ: {
    letter: 'щ',
    pol: 'szcz',
  },
  ъ: {
    letter: 'ъ',
    pol: 'znak twardy',
  },
  ы: {
    letter: 'ы',
    pol: 'y',
  },
  ь: {
    letter: 'ь',
    pol: 'znak miękki',
  },
  Э: {
    letter: 'Э',
    pol: 'e',
  },
  э: {
    letter: 'э',
    pol: 'e',
  },
  Ю: {
    letter: 'Ю',
    pol: 'ju',
  },
  ю: {
    letter: 'ю',
    pol: 'ju',
  },
  Я: {
    letter: 'Я',
    pol: 'ja',
  },
  я: {
    letter: 'я',
    pol: 'ja',
  },
};

export const rusLettersArray = Object.keys(rusLetters).map(key => rusLetters[key]);

export const rusToPol = (inputString: string): string[] => {
  const input = inputString.split('');
  const output: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const rusLetter = input[i];
    const rusLetterObject = rusLetters[input[i]];

    if (rusLetterObject) {
      output.push(rusLetterObject.pol);
    } else {
      output.push(' ');
    }
  }

  return output;
};
