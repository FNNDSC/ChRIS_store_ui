import React, { useEffect, useRef } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { Button, Alert, AlertActionCloseButton, AlertActionLink  } from "@patternfly/react-core";
import Client from '@fnndsc/chrisstoreapi';
import ChrisStore from '../../store/ChrisStore';



const UploadJson = () => {
  const fileOpen = useRef(null);
  const [fileName, setFileName] = React.useState("");
  const [pipelist, setPipelines] = React.useState([]);
  const [pipelineInstance, setPipelineInstance] = React.useState("")
  const [fileDownloadUrl, setfileDownloadUrl] = React.useState(null)
  const [error, setError] = React.useState(null);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [isSucessful, setSucessful] = React.useState(false);

  const storeURL = process.env.REACT_APP_STORE_URL;
  const token = window.sessionStorage.getItem('AUTH_TOKEN');
  const client = new Client(storeURL, { token });

  const fetchPipelines = async () => {
    const pipeLines = (await client.getPipelines()).getItems();

    console.log()
    setPipelines(pipeLines);
    return pipeLines;
  }

  const initialPipelines = fetchPipelines();
  // eslint-disable-next-line no-console




  const showOpenFile = () => {
    if (fileOpen.current) {
      fileOpen.current.click();
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        if (reader.result) {
          const result = JSON.parse(reader.result);
          result.plugin_tree = JSON.stringify(result.plugin_tree);
          setFileName(result.name);
          try {
            const newPipeline = await client.createPipeline(result);
            setSucessful(true);
            setPipelineInstance(newPipeline);
            setPipelines([...pipelist, newPipeline]);
            const fileUrl = URL.createObjectURL(file);
            setfileDownloadUrl(fileUrl);
            setSucessful(true);


          } catch (error) {
            console.log("invalid treelist", error);
            setError(error);







          }






        }
      } catch (error) {
        console.log("NOT a valid json file", error);
        setError(error)
        setFileName("");

      }
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    setError("");
    readFile(file);
  };
  useEffect(() => {
    console.log('created new pipeline')
  }, [pipelineInstance, fileName]); // Only re-run the effect if count changes

  // useEffect(() => {
  //     setTimeout(async () => {
  //       const pipelines = fetchPipelines();

  //       setPipelines(pipelines);
  //       console.log(data);
  //     }, 2000);
  //   }, []);

  return (
    <>
      {isSucessful ? (
        <div style={{ color: "blue", fontWeight: 900 }}>
          <h2>Pipeline sucessfully uploaded!</h2>
          <Alert variant="success" title="Pipeline sucessfully uploaded" actionClose={<AlertActionCloseButton onClose={() => alert('Clicked the close button')} />} />
          <a href={fileDownloadUrl} target="_blank" rel="noreferrer" download={fileName}>Download</a>
        </div>
      ) : (
        <>
          {error !== null &&
            <Alert variant="danger" isInline title={error.message} />


          }
          <div
            style={{
              margin: "0.35em 0",
            }}
          >
            <span style={{ marginRight: "0.5rem", fontWeight: 700 }}>
              {fileName}
            </span>
            <Button onClick={showOpenFile} icon={<AiOutlineUpload />}>
              Upload a JSON spec{" "}
            </Button>
          </div><input
            ref={fileOpen}
            style={{ display: "none" }}
            type="file"
            onChange={handleUpload} />


        </>
      )}

    </>
  );
};

export default ChrisStore.withStore(UploadJson);
