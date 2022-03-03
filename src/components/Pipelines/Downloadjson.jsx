import React, { useState, useEffect } from 'react'

const Downloadjson = ({ selectedResource }) => {
  const [fileDownloadUrl, setfileDownloadUrl] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  
   const Jsonfile =  async() => {
     const res = (await selectedResource.getPluginPipings()).data;
     const pipelinedata = { ...selectedResource.data, plugin_tree: [...res] };
     const pipelineJson = JSON.stringify(pipelinedata, null, 2);
     const defaultFileType = "json";
     const blob = new Blob([pipelineJson],{
       type:"application/json"
     });             
     const fileDownloadUrl = URL.createObjectURL(blob); 
     console.log(fileDownloadUrl);
     setfileDownloadUrl(fileDownloadUrl); // Step 5
      //  () => {
      //    this.dofileDownload.click();                   // Step 6
      //    URL.revokeObjectURL(fileDownloadUrl);          // Step 7
      //    setState({ fileDownloadUrl: "" })
      //  })
     console.log(pipelineJson);
    

      
   
      
  }
   
  
    // const tredata=res.data;
   
    // let tredata = [];
    // console.log(res);
    // tredata = res.
    
    

  // const pipelinedata = { ...selectedResource.data, plugin_tree: [...tredata] }
  //    console.log(pipelinedata);
  //    const pluginjson = JSON.stringify(pipelinedata, null, 2);
  //    console.log(pluginjson);
  useEffect(() => {
    Jsonfile();
    // Runs once, after mounting

  }, []);

    
  return (
    <a href={fileDownloadUrl} target="_blank" rel="noreferrer" download>Download</a>
  )
}

export default Downloadjson;
















// const [fileName, setFileName] = React.useState("");
// const [fileURls, setfileURls] = React.useState(map1);
// const [pipelineDownloadUrl, setpipelineDownloadUrl] = React.useState(null); const downloadJsonFile = () => {
//     console.log(fileURls);
// }

// const downloadJsonFile = () => {
//     console.log(fileURls);
// }

