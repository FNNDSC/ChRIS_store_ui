 PipelineData = {
        name: "fastsurfer_dev",
        authors: "gideonpinto123@gmail.com",
        description: "test",
        category: "mri",
        locked: false,
        plugin_tree: JSON.stringify([
            {
                plugin_name: "pl-simpledsapp",
                plugin_version: "2.0.2",
                previous_index: null,
            },
            {
                plugin_name: "pl-pfdicom_tagextract",
                plugin_version: "3.1.2",
                previous_index: 0,
                plugin_parameter_defaults: [
                    {
                        name: "outputFileType",
                        default: "txt,scv,json,html",
                    },
                    {
                        name: "outputFileStem",
                        default: "Post-Sub",
                    },
                    {
                        name: "imageFile",
                        default: "'m:%_nospc|-_ProtocolName.jpg'",
                    },
                    {
                        name: "imageScale",
                        default: "3:none",
                    },
                ],
            },
            {
                plugin_name: "pl-pfdicom_tagsub",
                plugin_version: "3.2.3",
                previous_index: 0,
                plugin_parameter_defaults: [
                    {
                        name: "extension",
                        default: ".dcm",
                    },
                    {
                        name: "splitToken",
                        default: "++",
                    },
                    {
                        name: "splitKeyValue",
                        default: ",",
                    },
                    {
                        name: "tagInfo",
                        default:
                            "'PatientName,%_name|patientID_PatientName ++ PatientID,%_md5|7_PatientID ++ AccessionNumber,%_md5|8_AccessionNumber ++ PatientBirthDate,%_strmsk|******01_PatientBirthDate ++ re:.*hysician,%_md5|4_#tag ++ re:.*stitution,#tag ++ re:.*ddress,#tag'",
                    },
                ],
            },
            {
                plugin_name: "pl-pfdicom_tagextract",
                plugin_version: "3.1.2",
                previous_index: 2,
                plugin_parameter_default: [
                    {
                        name: "outputFileType",
                        default: "txt,scv,json,html",
                    },
                    {
                        name: "outputFileStem",
                        default: "Post-Sub",
                    },
                    {
                        name: "imageFile",
                        default: "'m:%_nospc|-_ProtocolName.jpg'",
                    },
                    {
                        name: "imageScale",
                        default: "3:none",
                    },
                    {
                        name: "extension",
                        default: ".dcm",
                    },
                ],
            },
            {
                plugin_name: "pl-fshack",
                plugin_version: "1.2.0",
                previous_index: 2,
                plugin_parameter_default: [
                    {
                        name: "exec",
                        default: "recon-all",
                    },
                    {
                        name: "args",
                        default: "'ARGS:-autorecon1'",
                    },
                    {
                        name: "outputFile",
                        default: "recon-of-SAG-anon-dcm",
                    },
                    {
                        name: "inputFile",
                        default: ".dcm",
                    },
                ],
            },
            {
                plugin_name: "pl-fastsurfer_inference",
                plugin_version: "1.0.15",
                previous_index: 4,
                plugin_parameter_default: [
                    {
                        name: "subjectDir",
                        default: "recon-of-SAG-anon-dcm",
                    },
                    {
                        name: "subject",
                        default: "mri",
                    },
                    {
                        name: "copyInputFiles",
                        default: "mgz",
                    },
                    {
                        name: "iname",
                        default: "brainmask.mgz",
                    },
                ],
            },
            {
                plugin_name: "pl-multipass",
                plugin_version: "1.2.12",
                previous_index: 5,
                plugin_parameter_default: [
                    {
                        name: "splitExpr",
                        default: "++",
                    },
                    {
                        name: "commonArgs",
                        default:
                            "'--printElapsedTime --verbosity 5 --saveImages --skipAllLabels --outputFileStem sample --outputFileType png'",
                    },
                    {
                        name: "specificArgs",
                        default:
                            "'--inputFile mri/brainmask.mgz --wholeVolume brainVolume ++ --inputFile mri/aparc.DKTatlas+aseg.deep.mgz --wholeVolume segVolume --lookupTable __fs__'",
                    },
                    {
                        name: "exec",
                        default: "pfdo_mgz2image",
                    },
                ],
            },
            {
                plugin_name: "pl-pfdorun",
                plugin_version: "2.2.6",
                previous_index: 6,
                plugin_parameter_default: [
                    {
                        name: "dirFilter",
                        default: "label-brainVolume",
                    },
                    {
                        name: "fileFilter",
                        default: "png",
                    },
                    {
                        name: "exec",
                        default:
                            "'composite -dissolve 90 -gravity Center %inputWorkingDir/%inputWorkingFile %inputWorkingDir/../../aparc.DKTatlas+aseg.deep.mgz/label-segVolume/%inputWorkingFile -alpha Set %outputWorkingDir/%inputWorkingFile'",
                    },
                    {
                        name: "verbose",
                        default: "5",
                    },
                ],
            },
            {
                plugin_name: "pl-mgz2lut_report",
                plugin_version: "1.3.1",
                previous_index: 5,
                plugin_parameter_default: [
                    {
                        name: "file_name",
                        default: "mri/aparc.DKTatlas+aseg.deep.mgz",
                    },
                    {
                        name: "report_types",
                        default: "txt,csv,json,html,pdf",
                    },
                ],
            },
        ]),
    };

    return data;
};
