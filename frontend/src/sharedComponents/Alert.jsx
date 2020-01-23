import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { Error } from 'styled-icons/boxicons-solid/Error';
import { Bell } from 'styled-icons/boxicons-solid/Bell';
import { Check } from 'styled-icons/boxicons-regular/Check';
import { Cross } from 'styled-icons/icomoon/Cross';

const Wrapper = styled.div`
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 50px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 10000;
    width: fit-content;
    background-color: #ffffff;
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);

    @media only screen and (max-width: 800px) {
        top: 0px;
    }
`

const Content = styled.div`
    display: flex;
    position: relative;
`

const Exit = styled.div`
    position: absolute;
    right: 5px;
    top 5px;
`

const Icon = styled.div`
    color: #ffffff;
    height: 100px;
    width: 100px;
    background-color: ${props => props.color};
`

const AlertContent = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    padding: 10px;
`

const Type = styled.div`
    display: flex;
    justify-content: center;

`

const Message = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
`

const ProgressBar = styled.progress`
    width: 100%;
    height: 5px;
    -webkit-appearance: none;
    appearance: none;
    
    &::-webkit-progress-bar {
        background-color: #eeeeee;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    &::-webkit-progress-value {
        background-color: ${props => props.color};
    }
`

const Alert = ({alert, removeToast}) => {
    // Progress bar value
    const [progress, setProgress] = useState(0)
    
    // Progress counter set to 15s
    // Updates every 10ms for 15000ms
    useEffect(() => {
        const id = setInterval(() => {
            // Set the progress state for the progreessbar
            // add 10ms if time is less than 15s else remove alert and clear interval
            setProgress(_progress => {
                if(_progress >= 15000) {
                    clearInterval(id)
                    removeToast()
                    return _progress
                }
                return _progress+10
            })
        }, 10);

        // Stop the intervall on unmount
        return () => clearInterval(id)
    }, [])

    // Icon, color and title of the alert box
    let IconComponent;
    let color = "#0a60ff";
    let title = "Info";

    if(alert.type) {
        if(alert.type == "alert-error") {
            IconComponent = <Error />
            color = "#d21e36"
            title = "Error"        
        } else if(alert.type == "alert-success") {
            IconComponent = <Check />
            color = "#249b34"
            title = "Success"
        } else {
            // Generally this should happen if 'alert.type == "alert-info"'
            IconComponent = <Bell />
        }
    }

    return (
        <Wrapper>
            <Content>
                <Exit onClick={(e) => {removeToast()}}>
                    <Cross size="1em" />
                </Exit>
                <Icon color={color}>
                    {IconComponent}
                </Icon>
                <AlertContent>
                    <Type>
                        <b>{alert.type && <div>{title}</div>}</b>
                    </Type>
                    <Message>
                        {alert.message && <div>{typeof alert.message === 'object' ? "" : alert.message}</div>}
                    </Message>
                </AlertContent>
            </Content>
            <ProgressBar max="15000" min="0" value={progress} color={color}></ProgressBar>
        </Wrapper>
    )
}

Alert.proptypes = {
    alert: PropTypes.PropTypes.shape({
        type: PropTypes.string.isRequired,
        message: PropTypes.number.isRequired
    }).isRequired,
    removeToast: PropTypes.func.isRequired
}

export {
    Alert
};