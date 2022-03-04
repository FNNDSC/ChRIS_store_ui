import React, { useState, useEffect } from 'react'

const Downloadjson = ({ selectedResource }) => {
  const [fileDownloadUrl, setfileDownloadUrl] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  
   const Jsonfile =  async() => {
     const res = (await selectedResource.getPluginPipings()).data;
     const pipelinedata = { ...selectedResource.data, plugin_tree: [...res] };
     let filename=""
     filename=pipelinedata.name
     filename=filename.replaceAll('.', '');
     setFileName(filename); 
     const pipelineJson = JSON.stringify(pipelinedata, null, 2);
     const blob = new Blob([pipelineJson],{
       type:"application/json"
     });             
     const fileDownloadUrl = URL.createObjectURL(blob); 

     setfileDownloadUrl(fileDownloadUrl);
     // Step 5
      //  () => {
      //    this.dofileDownload.click();                   // Step 6
      //    URL.revokeObjectURL(fileDownloadUrl);          // Step 7
      //    setState({ fileDownloadUrl: "" })
      //  })
     
    

      
   
      
  }
   
  useEffect(() => {
    Jsonfile();
      //  })
    // Runs once, after mounting

  }, [fileName, fileDownloadUrl]);

    
  return (
      <a href={fileDownloadUrl}  target="_blank" rel="noreferrer" download={fileName}>Download</a>
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

