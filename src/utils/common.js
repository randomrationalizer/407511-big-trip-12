// Возвращает строку с заглавной первой буквой
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Обновляет элемент массива
export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};
