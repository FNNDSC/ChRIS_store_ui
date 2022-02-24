import React,{useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import  getPluginTree  from './PipelineTree';
// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
 

const PluginTree = ({selectedResource, pluginPipings }) => {
    const [treeData, setTreeData] = useState({

		name: "",
		children:[],

	  });
	  
   
    const treedata = async() => { 
            try {
                const res = await selectedResource.getPluginPipings();
                const tree = getPluginTree(res.data);
                 setTreeData({
			  name:tree[0].name,
			  children:tree[0].children,
			});
                
                
               
            } catch (err) {
                console.log(err);
               return err;
            }
        }
   useEffect(() => {
    // Runs once, after mounting
    treedata();
  }, []);
    
   
       

   
 
    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div  style={{ width: '50em', height: '20em' }}>
            <Tree data={treeData} orientation="vertical" />
        </div>
    );
};

export default PluginTree;

