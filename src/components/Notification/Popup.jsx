import React, {useState} from "react";
import PropTypes from 'prop-types';
import "./popup.css";
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, TimesIcon } from "@patternfly/react-icons";

const Popup = ({position, variant, title, closeable, timeout}) => {
    const [alertVisible, setAlertVisible] = useState(true)


const ClosePopUp = () =>  setAlertVisible(false)


const closeAlert = () => setAlertVisible(false)

if (closeable) setTimeout(ClosePopUp, timeout ?? 7000)

return (
    <div className={alertVisible ? 'modal_wrapper' : ''}>
    <div className={`modal_container ${position}`}>
        {alertVisible && ( 
        <div className='modal'>
            <div className={`modal_bar ${variant}`}>
                <div className="modal_bar_content">
                <button className='modal_close_button' type='button' onClick={() => closeAlert()}>
                <TimesIcon className="modal_close_icon" />
                </button>
                </div>
            </div>
            <div className={`modal_content ${variant}_content`}>
            {variant === 'danger' && (<ExclamationCircleIcon className={`modal_status_icon ${variant}_content`}/>)}
            {variant === 'warning' && (<ExclamationTriangleIcon className={`modal_status_icon ${variant}_content`}/>)}
            {variant === 'success' && (<CheckCircleIcon className={`modal_status_icon ${variant}_content`}/>)}
            <p className="modal_message">{title}</p>
            </div>
        </div>
        )}
    </div>
    </div>
    )}

    Popup.propTypes = {
        position: PropTypes.string.isRequired,
        variant: PropTypes.string,
        title: PropTypes.string,
        timeout: PropTypes.bool,
    };


export default Popup;