import React, {useState,useEffect } from "react";
import Client from  '@fnndsc/chrisstoreapi';
import DisplayPage from './DisplayPage';
import  UploadJson from "./UploadJson";
import ChrisStore from '../../store/ChrisStore';


const PipelineCatalog = (props) => {
  const [pipelines, setPipelines] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [filteredId, setFilteredId] = React.useState();
  const [pageState, setPageState] = useState({
    page: 1,
    perPage: 5,
    search: "",
    itemCount: 0,
  });

  const { page, perPage, search } = pageState;
  const [selectedPipeline, setSelectedPipeline] = useState();
  const storeURL = process.env.REACT_APP_STORE_URL;
  const auth = { token: props.store.get("authToken") };
  const token = window.sessionStorage.getItem('AUTH_TOKEN')||'';
  console.log(auth)

  const onSetPage = (_event, page) => {
    setPageState({
      ...pageState,
      page,
    });
  };
  const onPerPageSelect = (_event, perPage) => {
    setPageState({
      ...pageState,
      perPage,
    });
  };

  const handleFilterChange = (value) => {
    setPageState({
      ...pageState,
      search: value,
    });
  };
  useEffect(() => {
    async function fetchPipelines(
      perPage,
      page,
      search
    ) {
      const offset = perPage * (page - 1);
      const params = {
        limit: perPage,
        offset: offset,
        name: search,
      };
      const client = new Client(storeURL,auth);
      const pipelinesList = await client.getPipelines(params);
      let pipelines;
      pipelines=pipelinesList.getItems();
      if (filteredId && pipelines) {
       pipelines = pipelines.filter(
          (pipeline) => pipeline.data.id !== filteredId
        );
      }
      if (pipelines) {
        setPipelines(pipelines);
        setPageState((pageState) => {
          return {
            ...pageState,
            itemCount: pipelinesList.totalCount,
          };
        });
      }
    }

    fetchPipelines(perPage, page, search);
  }, [perPage, page, search,fetch, filteredId]);
  const handleFetch = (id) => {
    id && setFilteredId(id);
    setFetch(!fetch);
  };
  const handleDelete = async(selectedResource) => {
    let response;
    // const client = new Client(storeURL,auth);
    // const pipeline = await client.getPipeline(selectedResource.data.id);
    // console.log(pipeline)
    // const deletedPipeline = pipeline.delete( );
    //  console.log(deletedPipeline)
    //  return deletedPipeline
    const client = new Client(storeURL, auth);
    const offset = perPage * (page - 1);
    const params = {
        limit: perPage,
        offset: offset,
        name: search,
      };
   
    const pipelinesList = await client.getPipelines(params);
    // eslint-disable-next-line prefer-const
    response = await client.getPipeline(selectedResource.data.id);
    
    response = await response.delete();
    let pipelines;
      pipelines=pipelinesList.getItems();
    setPipelines(pipelines.filter((pipeline) => pipeline.data.id!==selectedResource.data.id))
    setFetch(!fetch);
    
    
    
      
    
   
   
    

  };

  const handleSearch = (search) => {
    console.log("Search", search);
    setPageState({
      ...pageState,
      search,
    });
  };
  
  return (
    <>
      <DisplayPage
        pageState={pageState}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        resources={pipelines}
        handleFilterChange={handleFilterChange}
        selectedResource={selectedPipeline}
        // deletePipeline={deletePipeline}
        setSelectedResource={(pipeline) => {
          setSelectedPipeline(pipeline);
       
        


         }}
         
        title="Pipelines"
        fetch={handleFetch}
        handlePipelineSearch={handleSearch}
        search={pageState.search}
        handleDelete={handleDelete}
      />
    </>
    
  );
};

export default ChrisStore.withStore(PipelineCatalog);
