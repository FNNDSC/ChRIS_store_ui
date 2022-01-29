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
                console.log(res)
                const tree = getPluginTree(res.data);
                const treetype = typeof(tree); 
                console.log(treetype);
                console.log(tree);
                 setTreeData({
			  name:tree[0].name,
			  children:tree[0].children,
			});
                 console.log(treeData);
                
               
            } catch (err) {
                console.log(err);
            }
        }
    treedata();
       
  const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

   
 const data = typeof(orgChart);
 console.log(orgChart);
    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
            <Tree data={treeData} orientation="vertical"/>
        </div>
    );
};

export default PluginTree;

