import React,{useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import  getPluginTree  from './PipelineTree';
// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
 

const PluginTree = ({selectedResource }) => {
    const [treeData, setTreeData] = useState({

		name: "",
		children:[],

	  });
   const [error, setError] = React.useState(null);
	  
   
    const treedata = async() => {
          console.log(selectedResource);
            try {
                const res = await selectedResource.getPluginPipings();
                console.log(res);
                const tree = getPluginTree(res.data);
                const tredata=res.data
    
                const pipelinedata = { ...selectedResource.data, plugin_tree: [...tredata]}

               
                console.log(pipelinedata);
                
              const pluginjson = JSON.stringify(pipelinedata,null, 2);
              console.log(pluginjson);
                setTreeData({
                  name:tree[0].name,
                  children:tree[0].children,
                });
                
              return treeData; 
                
               
            } catch (error) {
                setError(error);
            }
        }
   
   
   useEffect(() => {
    treedata();
    // Runs once, after mounting
     
   }, []);
    
   
       

   
 
    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div  style={{ width: '50em', height: '20em' }}>
            <Tree data={treeData} orientation="vertical" />
        </div>
    );
};

export default PluginTree;

