import amilabLogo from '../../../../assets/img/plugins/amilab_90.png';
import besaLogo from '../../../../assets/img/plugins/besa_90.png';
import biosigLogo from '../../../../assets/img/plugins/biosig_90.png';
import brainbrowserLogo from '../../../../assets/img/plugins/brainbrowser_90.png';
import brainsuiteLogo from '../../../../assets/img/plugins/brainsuite_90.png';
import cleaveLogo from '../../../../assets/img/plugins/cleave_90.png';
import connectomeviewerLogo from '../../../../assets/img/plugins/connectomeviewer_90.png';
import fslLogo from '../../../../assets/img/plugins/fsl_90.png';
import ielectrodesLogo from '../../../../assets/img/plugins/ielectrodes_90.png';
import leaddbsLogo from '../../../../assets/img/plugins/leaddbs_90.png';
import mangoLogo from '../../../../assets/img/plugins/mango_90.png';
import mricrosLogo from '../../../../assets/img/plugins/mricros_90.png';
import freesurferLogo from '../../../../assets/img/plugins/freesurfer_90.png';

const sampleCategories = [
  {
    name: 'Visualization',
    items: [
      {
        img: freesurferLogo,
        name: 'pl-z2labelmap',
        desc: 'z-score to FreeSurfer label map',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: freesurferLogo,
        name: 'pl-dsdircopy',
        desc: 'A ChRIS ds app to copy obj storage directories',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: freesurferLogo,
        name: 'pl-fetal-brain-mask',
        desc: 'Automatic masking of fetal brain images',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: freesurferLogo,
        name: 'pl-flip',
        desc: 'A ChRIS plugin app',
        tags: ['TAG1', 'TAG2'],
      },
    ],
  },
  {
    name: 'Modeling',
    items: [
      {
        img: brainsuiteLogo,
        name: 'BrainSuite',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: fslLogo,
        name: 'FMRIB Software Library',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: ielectrodesLogo,
        name: 'iElectrodes',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: leaddbsLogo,
        name: 'LEAD-DBS',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
    ],
  },
  {
    name: 'Statistical Operation',
    items: [
      {
        img: besaLogo,
        name: 'BESA',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: biosigLogo,
        name: 'BioSig',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: cleaveLogo,
        name: 'Cleave',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
      {
        img: mangoLogo,
        name: 'Mango',
        desc: 'Lorem ipsum dolor',
        tags: ['TAG1', 'TAG2'],
      },
    ],
  },
];

export default sampleCategories;
