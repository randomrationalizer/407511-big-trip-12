// Названия городов назначения
const CITIES = [`Amsterdam`, `Vienna`, `Geneva`, `Lucerne`, `Chamonix`, `Saint Petersburg`, `Paris`, `London`, `Berlin`, `Prague`, `Milan`, `Madrid`];

const MAX_PHOTOS_COUNT = 10;

// Максимальное количество предложений в описании
const MAX_SENTENCES_COUNT = 5;

// "Рыба" описания города
const CITY_DESCRIPTION_MOCK = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;


// Возвращает случайное целое число в диапазоне от a до b (включая b)
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Создаёт случайное описание пункта назначения, длина описания - от 1 до 5 передложений
const generateDescription = () => {
  let sentences = CITY_DESCRIPTION_MOCK.split(`. `);

  sentences[sentences.length - 1] = sentences[sentences.length - 1].replace(`.`, ``);

  const sentencesCount = getRandomInteger(1, MAX_SENTENCES_COUNT);

  const description = new Array(sentencesCount).fill().map(() => {
    const randomIndex = getRandomInteger(0, sentences.length - 1);
    return sentences.splice(randomIndex, 1) + `.`;
  }).join(` `);

  return description;
};

// Создаёт массив ссылок фотографий пункта назначения - от 1 до 10
const generatePhotos = () => {
  const photosCount = getRandomInteger(1, MAX_PHOTOS_COUNT);

  const photos = new Array(photosCount).fill().map(() => {
    return {
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: ``
    };
  });

  return photos;
};

// Создаёт массив моковых объектов описаний пунктов назначения
export const generateDestinations = () => {
  return CITIES.map((city) => {
    return {
      name: city,
      description: generateDescription(),
      pics: generatePhotos()
    };
  });
};
