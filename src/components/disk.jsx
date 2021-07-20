import React, { Component } from 'react';
class Disk extends Component {
    state = {  }

    
    render() { 
        const diskstyle = {
            width: this.props.disk_width + "%",
        };
        return ( 
            <div className="disk"
            id = {this.props.id}
            value = {this.props.value}
            style= {diskstyle}
            draggable = {this.props.draggable}
            onDragStart = {this.props.dragstart}

            onTouchStart = {this.props.touchStart }
            onTouchMove = {this.props.touchMoving}
            onTouchEnd = {this.props.touchEnd}

            >
                {this.props.disk_name}
            </div>
         );
    }
}
 
export default Disk;