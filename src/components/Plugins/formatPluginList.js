const formatItemData = itemData => itemData.reduce((sum, pair) => {
  const result = {};
  result[pair.name] = pair.value;
  return Object.assign(sum, result);
}, {});

const formatPluginList = pluginList => pluginList.map((item) => {
  const result = Object.assign({}, item);
  result.data = formatItemData(result.data);
  return result;
});

export default formatPluginList;
