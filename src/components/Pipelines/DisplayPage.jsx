/* eslint-disable no-nested-ternary */
import React,{ useEffect, useRef } from "react";
import {
  Pagination,
  Card,
  CardTitle,
  CardHeader,
  CardHeaderMain,
  CardBody,
  Grid,
  GridItem,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Title,
  Divider,
  Button,
  Alert,
  TextInput,
} from "@patternfly/react-core";
import { ImTree } from "react-icons/im";
import { GrCloudComputer } from "react-icons/gr";
import { AiOutlineUpload } from "react-icons/ai";
import { FaCode } from "react-icons/fa";
import Client from '@fnndsc/chrisstoreapi';
import PluginTree from "./PluginTree";







const DisplayPage = ({
  resources,
  selectedResource,
  pageState,
  onPerPageSelect,
  onSetPage,
  setSelectedResource,
  title,
  showPipelineButton,
  fetch,
  handlePipelineSearch,
  search,
  handleDelete
}) => {
  const { perPage, page, itemCount } = pageState;
  const map1 = resources.map((resource, index) => resources[index].data);
  const fileOpen = useRef(null);
  const [fileName, setFileName] = React.useState("");
  const [fileURls, setfileURls] = React.useState(map1);
  const [pipelineDownloadUrl, setpipelineDownloadUrl] = React.useState(null);
  const [error, setError] = React.useState(null);
  // const [warningMessage, setWarningMessage] = React.useState("");
  // const [isSucessful, setSucessful] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [pluginPipings, setPluginPipings] = React.useState([]);

  console.log(fileURls);
  


  

  const iconStyle = {
    fill:
      title === "Plugins"
        ? "#0066CC"
        : title === "Pipelines"
          ? "#1F0066"
          : title === "Compute Environments "
            ? "red"
            : "",
    height: "1.5em",
    width: "1.25em",
    marginRight: "0.5em",
    marginTop: "0.25em",
  };
  const showOpenFile = () => {
    if (fileOpen.current) {
      fileOpen.current.click();
    }
  };
  const downloadJsonFile = () => {
    console.log(fileURls);
    }


  const readFile = (file) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        if (reader.result) {
          const result = JSON.parse(reader.result);
          result.plugin_tree = JSON.stringify(result.plugin_tree);
          setFileName(result.name);
          try {
            const storeURL = process.env.REACT_APP_STORE_URL;
            const token = window.sessionStorage.getItem('AUTH_TOKEN');
            const client = new Client(storeURL, { token });

            const newPipeline = await client.createPipeline(result);
            // setSucessful(true);
            // setPipelineInstance(newPipeline);
            // setPipelines([...pipelist, newPipeline]);
            fetch && fetch();
           
            // setfileURls()
           



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
  
  
  
  
  const drawerContent = (
    <Grid hasGutter={true}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title
          style={{
            marginLeft: "1em",
            marginTop: "0.5em",
          }}
          headingLevel="h2"
        >
          {title}
        </Title>
        <div
          style={{
            display: "flex",
          }}
        >

          <>
           
            <div
              style={{
                margin: "0.35em 0",
              }}
            >
              {error &&
                <Alert variant="danger" isInline title={error.message} />


              }
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
          <TextInput
            style={{
              margin: "0.5em 0.5em 0 0",

            }}
            value={search}
            type="text"
            placeholder="Search"
            iconVariant="search"
            aria-label="search"
            onChange={(value) => {

              handlePipelineSearch && handlePipelineSearch(value);
            }

            }
          />
        </div>
      </div>

      {resources &&
        resources.length > 0 &&
        resources.map((resource) => {
          return (
            <GridItem lg={2} md={6} sm={2} key={resource.data.id}>
              <Card
                isSelectable
                isSelected={
                  selectedResource &&
                  selectedResource.data.id === resource.data.id
                }


                onClick={() => {
                  setSelectedResource(resource);
                  setIsExpanded(true);
                  console.log(fileURls)
                }}
              
                onKeyDown={async (event) => {
                  if ([13, 32].includes(event.keyCode)) {
                    setSelectedResource(resource);

                    // Check if the resource is a pipeline by either the title prop or is showPipelineButton is true.
                    // if it is a pipeline resource, set pluginPipings here.

                    if (title === 'Pipelines') {
                      const Pipings = await resource.getPluginPipings();
                      console.log(Pipings)
                      setPluginPipings(pluginPipings)
                    }

                    setIsExpanded(true);
                    
                  }
                }}
                className="pluginList"
                key={resource.data.id}
              >
                <CardHeader>
                  <CardHeaderMain>
                    {title === "Pipelines" ? (
                      <ImTree style={iconStyle} />
                    ) : title === "Compute Environments" ? (
                      <GrCloudComputer style={iconStyle} />
                    ) : (
                      <FaCode style={iconStyle} />
                    )}
                  </CardHeaderMain>
                </CardHeader>
                <CardTitle>
                  <p className="pluginList__name">{resource.data.name}</p>
                  <p className="pluginList__authors">{resource.data.authors}</p>
                </CardTitle>

                <CardBody>
                  <p className="pluginList__description">
                    {resource.data.description}
                  </p>
                  <p className="pluginList__plugin_tree">

                  </p>
                </CardBody>
              </Card>
            </GridItem>
          );
        })}
    </Grid>
  );
const handleUpdate = (id) => {
    fetch && fetch(id);
  };
          
  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <DrawerActions>
          <DrawerCloseButton
            onClick={() => {
              setIsExpanded(false);
            }}
          />
        </DrawerActions>
        {selectedResource && (
          <>
            <Title headingLevel="h2">{selectedResource.data.name}</Title>
            <p className="pluginList__authors">
              {selectedResource.data.authors}
            </p>
            
            )}
            <Divider
              style={{
                paddingTop: "2em",
              }}
            />   
            <p>{selectedResource.data.description}</p>
             <PluginTree selectedResource={selectedResource}  /> }
            {/* <a href={fileURls[selectedResource.data.id]} target="_blank" rel="noreferrer" download>Download</a> */}
            <Button
              style={{
                width: "45%",
              }}
              onClick={async () => {
                handleDelete(selectedResource);
                setIsExpanded(false);
              }

              }
            >
              Delete a Pipeline
            </Button>

          </>

        )}
      </DrawerHead>
    </DrawerPanelContent>
  );

  return (
    <>
      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={page}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
      />
      <Drawer isExpanded={isExpanded}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>{drawerContent}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DisplayPage;







