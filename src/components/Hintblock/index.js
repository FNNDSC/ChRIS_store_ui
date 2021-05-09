import React from 'react';
import { Hint, HintBody, HintFooter, HintTitle } from '@patternfly/react-core';
import './hint.css';
const HintBlock = ({hintActions, hintBody, hintFooter, hintTitle, ...props})=>{
    return (
        <Hint actions={hintActions} className="hint-block">
            {hintTitle && (<HintTitle>{hintTitle}</HintTitle>)}
            <HintBody>{hintBody}</HintBody>
            {hintFooter && (<HintFooter>{hintFooter}</HintFooter>)}
        </Hint>
    )
} 
export default HintBlock;