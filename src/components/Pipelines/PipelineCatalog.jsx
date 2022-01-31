import React, {useState,useEffect } from "react";
import Client from  '@fnndsc/chrisstoreapi';
import DisplayPage from './DisplayPage';
import  UploadJson from "./UploadJson";

const PipelineCatalog = () => {
  const [pipelines, setPipelines] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [pageState, setPageState] = useState({
    page: 1,
    perPage: 5,
    search: "",
    itemCount: 0,
  });

  const { page, perPage, search } = pageState;
  const [selectedPipeline, setSelectedPipeline] = useState();
  const storeURL = process.env.REACT_APP_STORE_URL;
  const token = window.sessionStorage.getItem('AUTH_TOKEN');
  const client = new Client(storeURL, { token });

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
      const pipelinesList = await client.getPipelines(params);
      const plugins = pipelinesList.getItems();
      if (plugins) {
        setPipelines(plugins);
        setPageState((pageState) => {
          return {
            ...pageState,
            itemCount: pipelinesList.totalCount,
          };
        });
      }
    }

    fetchPipelines(perPage, page, search);
  }, [perPage, page, search]);
  const handleFetch = () => {
    setFetch(true);
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
        setSelectedResource={(pipeline) => {
          setSelectedPipeline(pipeline);
        


         
          
         
          
          
          



        }}
        title="Pipelines"
        fetch={handleFetch}
        handlePipelineSearch={handleSearch}
        search={pageState.search}
      />
      <UploadJson pipelines={pipelines}/>
    </>
    
  );
};

export default PipelineCatalog;
