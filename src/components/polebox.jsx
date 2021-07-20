import React, { Component } from 'react';
import Disk from './disk';
class PoleBox extends Component {
    state = {  }
    render() { 
        const disks = this.props.gameData.diskList.map((x, i) =>{
            const isDragable =  i ===0? true: false;
            return(
                <Disk
                    key={i}
                    id = {x.id}
                    value = {x.value}
                    disk_width = {x.disk_width}
                    disk_name= {x.disk_name}
                    draggable = {isDragable}
                    dragstart = {this.props.dragstart}
                    touchStart = { this.props.touchStart}
                    touchMoving = { this.props.touchMoving}
                    touchEnd = { this.props.touchEnd}
                   
                   
                >

                </Disk>
            );
        });
        return (
            <div 
                id = {this.props.id} 
                className = "pole-box">
                <div  
                    id ={this.props.gameData.id} 
                    onDragOver = {this.props.allowdrop}
                    onDrop = {this.props.ondrops}
                    className = "pole"></div>
                <div className="pole-base"></div>
                <div 
                 className = "pole-box-item">
                    {disks}
                </div>

            </div>
          );
    }
}
 
export default PoleBox;