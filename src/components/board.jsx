import React, { Component } from 'react';
import PoleBox from "./polebox";
import "./stylesheet.css";

class Board extends Component {
    state = {  }
    renderPoleBox(num){
        return(
            <PoleBox
                id = {num}
                gameData = {this.props.gameData[num]}
                dragstart = {this.props.dragstart}
                allowdrop = {this.props.allowdrop}
                ondrops = {this.props.ondrop}

                touchStart = { this.props.touchStart}
                touchMoving = { this.props.touchMoving}
                touchEnd = { this.props.touchEnd}
            >
            </PoleBox>
        );
    }

    render() { 
        return (
            <div className="board">
               {this.renderPoleBox(0)}
               {this.renderPoleBox(1)}
               {this.renderPoleBox(2)}
            </div>
          );
    }
}
 
export default Board;