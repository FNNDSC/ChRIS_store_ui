import React, { useState  } from 'react';
import Client from '@fnndsc/chrisstoreapi';

const CreatePipeline = () => {
  const initialPipelineState = {

    name: "",
    locked: false,
    authors: "",
    category: "",
    description: "",
    plugin_tree: null

  };
  const [pipeline, setPipeline] = useState(initialPipelineState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setPipeline({ ...pipeline, [name]: value });
  };


  const savePipeline = () => {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const token = window.sessionStorage.getItem('AUTH_TOKEN');
    const client = new Client(storeURL, { token });
    const data = {
      name: pipeline.name,
      description: pipeline.description,
      locked: pipeline.locked,
      authors: pipeline.authors,
      category: pipeline.category,
      plugin_tree: JSON.stringify([{'plugin_name': 'pl-simpledsapp', 'plugin_version': '2.0.2', 'previous_index': null}, {'plugin_name':'pl-simpledsapp', 'plugin_version': '2.0.2', 'previous_index': 0}
      
  
      
     
    ])

    };
    console.log(data);
    client.createPipeline(data)
      .then(response => {
        setPipeline({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          authors: response.data.authors,
          locked: response.data.locked,
          category: response.data.category,
          plugin_tree: response.data.plugin_tree

        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
        alert(e.message)

      });
  };

  const newpipeline = () => {
    setPipeline(initialPipelineState);
    setSubmitted(false);
  };

  return (
    <>
      <label>
        Name:
        <input
          name="name"
          value={pipeline.name}
          onChange={handleChange}
        />
      </label>
        <label>
          Description:
          <input
            name="description"
            value={pipeline.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Authors:
          <input
            name="authors"
            value={pipeline.authors}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <input
            name="category"
            value={pipeline.category}
            onChange={handleChange}
          />
      </label>
          <label>

            Plugin tree:
            <input
              name="plugin_tree"
              value={pipeline.plugin_tree}
              onChange={handleChange}
            />
            <button onClick={savePipeline} className="btn btn-success">
              Submit
            </button>
      </label>
          </>
          );
  
};

export default CreatePipeline;




