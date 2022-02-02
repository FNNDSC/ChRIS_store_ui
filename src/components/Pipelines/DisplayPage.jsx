/* eslint-disable no-nested-ternary */
import React from "react";
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
import { FaCode } from "react-icons/fa";
import PluginTree from "./PluginTree";
import UploadJson from "./UploadJson";

 
 
 


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
}) => {
  const { perPage, page, itemCount } = pageState;
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [pluginPipings, setPluginPipings] = React.useState([]);
  
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

          <UploadJson  />
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
                }}
                onKeyDown={async(event) => {
                  if ([13, 32].includes(event.keyCode)) {
                    setSelectedResource(resource);
                    // Check if the resource is a pipeline by either the title prop or is showPipelineButton is true.
                    // if it is a pipeline resource, set pluginPipings here.

                    if(title==='Pipelines'){
                    const pluginPipings= await resource.getPluginPipings();
                    console.log(pluginPipings)
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
            <Divider
              style={{
                paddingTop: "2em",
              }}
            />
            <p>{selectedResource.data.description}</p>
            <PluginTree  selectedResource={selectedResource} pluginPipings={pluginPipings} /> 
             
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







