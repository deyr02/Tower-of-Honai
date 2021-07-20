import React, { Component } from 'react';
class MessageBox extends Component {
    state = {  }
    render() { 
        let viewStyle = this.props.message_type && this.props.text_message ? {visibility: "visible"}: {  visibility: "hidden"};
        let selectedClass = this.props.message_type === "success"? "success":"warning";
        return (  
            <div className={selectedClass} style={viewStyle}>
                {this.props.text_message}
            </div>
        );
    }
}
 
export default MessageBox;