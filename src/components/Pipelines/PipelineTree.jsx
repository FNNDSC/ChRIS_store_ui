import React from 'react';
const getPluginTree = (items) => {
  
  const tree = [];
  const mappedArr = {};
  
  items.forEach((item) => {
    const id = item.id; 
    if (!mappedArr.hasOwnProperty(id)) {
 
      mappedArr[id] = {
        id,
        name:item.plugin_name,
        plugin_id: item.plugin_id,
        pipeline_id: item.pipeline_id,
        previous_id: item.previous_id && item.previous_id,
        children: [],
      };
    }
  });

  for (const id in mappedArr) {
    let mappedElem;
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.previous_id) {
        const parentId = mappedElem.previous_id;
        if (parentId && mappedArr[parentId] && mappedArr[parentId].children) {
          mappedArr[parentId].children.push(mappedElem);
        }
      } else tree.push(mappedElem);
    }
  }
  return tree;
};
export default getPluginTree;





