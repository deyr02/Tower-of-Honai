import React, { Component } from 'react';
import Board from './board';
import MessageBox from './messageBox';
import MysteryStatus from './mysteryStatus';
import "./stylesheet.css";




function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


class Game extends Component {
    constructor(props){
        super(props);
        this.state ={
            gameData:
             //List of moves   
            [
                // Each move
                {
                    move:
                    [   
                    
                        {
                            id: "pole-1",
                            diskList: 
                                [
                                    {id:"disk-1", value :1, disk_name: "disk-1", disk_width:40},
                                    {id:"disk-2", value :2, disk_name: "disk-2", disk_width:60},
                                    {id:"disk-3", value :3, disk_name: "disk-3", disk_width:80},
                                    {id:"disk-4", value :4, disk_name: "disk-4", disk_width:100},

                                ],
                            
                            
                        },
                        { id: "pole-2", diskList:  [ ]},
                        { id: "pole-3", diskList:  [ ]},

                    ],
                    moveDetails:null,
                }
            ],

            message: 
            {
                message_type: null,
                text_message: null,
            },

            isMysterySolved: false,
            duration:null,

            

        }
    }
    state = {  }


    getSovledGameData(){
        return JSON.parse( window.localStorage.getItem("towerofHonai"));
    }
    saveGameData(){
        window.localStorage.setItem("towerofHonai", JSON.stringify(this.state));
    }

    setMessage(_message_type, _text_message){
        let _gamedata = this.state.gameData.slice();
        let _message = {message_type:_message_type, text_message:_text_message};
        this.setState(
            {
                gameData: _gamedata,
                message: _message,
            }
        );
    }
    getLastMove(){return this.state.gameData[this.state.gameData.length -1].move;}

    isWinner(_lastMove){
        let _winingArray = ["disk-1","disk-2","disk-3","disk-4"];
        let _winner = true;
        if(_lastMove[2].diskList.length ===4){
            for(let i =0; i< _lastMove[2].diskList.length; i++){
                if(_lastMove[2].diskList[i].id !== _winingArray[i]){
                    return false;
                }
            }
            return _winner;
        }
        return false;
    }

    revealingMysetey(){
        document.getElementById("reveal_button").disabled = true;
        document.getElementById("reveal_button").classList.add("disable");

        window.localStorage.setItem("towerofHonaiTemp", JSON.stringify(this.state));
        let _solvedData = this.getSovledGameData();
        let _moves = _solvedData.gameData.slice();
         //come to the first move
   
         _solvedData.gameData.splice(0); 
         
         for(let i =0; i<_moves.length; i++){
             setTimeout(() => {
             _solvedData.gameData.push(_moves[i]);
                 this.setState(
                     _solvedData
                 );

                 this.setMessage("success", "Move NO: "+ i +" - "+ _moves[i].moveDetails);
                 
             }, i* 1000);

             if(i === 0){
                 setTimeout(() => {
                    document.getElementById("reveal_button").disabled = false;
                    document.getElementById("reveal_button").classList.remove("disable");
                    let previosState = JSON.parse(window.localStorage.getItem("towerofHonaiTemp"));
                    previosState.message.message_type = "warning"
                    previosState.message.text_message = "Preview finished! Back to the previous state"
                    this.setState(
                        previosState
                    )
                 }, (_moves.length +2) *1000);
             }
         }





    }



    
    //  hold the value of dragged element id.
    elementID = null;
    //hold the value of draegged element value.
    elementValue= null;
    //this  element hold the value pole box element id, from where dragging is started.
    targetedFrom = null;

    //saved the last touch:
    lastTouchX = null;
    lastTouchY = null;

    drag(ev){

        let _elementID= ev.target.id;
        let _targetedFrom = ev.target.parentElement.parentElement.id;
        
        let _isFristDisk = this.getLastMove()[_targetedFrom].diskList[0].id === _elementID? true: false;

        if(_isFristDisk){
            this.elementID= _elementID;
            this.elementValue = ev.target.getAttribute("value");
            this.targetedFrom = _targetedFrom;
            this.setMessage(null, null)
        }
        else{
            this.setMessage("warning", "You are only allowed to move the first disk from the selected pole.")
        }

    }
    allowDrop(ev){

        if( this.elementID && this.targetedFrom){
             ev.preventDefault();
        }
    }
    drop (ev){
        ev.preventDefault();
        if(this.isWinner(this.getLastMove())){
            this.setMessage("success", "The mystery is already soloved. Refresh the browser to play again.")
            return;
        }
      if(this.elementID && this.targetedFrom){
        let _targetedTo = ev.target.parentElement.id;
        this.moveDisk(this.elementID, this.targetedFrom, _targetedTo);
       
      }
  
     // ev.target.parentElement.children[2].appendChild(document.getElementById(this.elementID));
    }

    //events for touch screen
    handleTouchStart(ev) {
        let _elementID= ev.target.id;
        let _targetedFrom = ev.target.parentElement.parentElement.id;
        
        let _isFristDisk = this.getLastMove()[_targetedFrom].diskList[0].id === _elementID? true: false;

        if(_isFristDisk){
            this.elementID= _elementID;
            this.elementValue = ev.target.getAttribute("value");
            this.targetedFrom = _targetedFrom;
            //adding dragging effects
            let tempElementDetails = document.getElementById(_elementID).getBoundingClientRect(); //as the width defined in percentage. we need to hold the width from the DOM.
            let tempElement = document.getElementById(_elementID).cloneNode(true); //clone the dragged item

            tempElement.id = "touchTempElement"; //ad new id to avoid conflict.
            tempElement.style.position = "absolute";
            tempElement.style.left = tempElementDetails.x +"px";
            tempElement.style.top = tempElementDetails.y + "px";
            tempElement.style.width = tempElementDetails.width + "px";

            document.getElementsByClassName("game")[0].append(tempElement);

            this.setMessage(null, null);
        }
        else{
            this.setMessage("warning", "You are only allowed to move the first disk from the selected pole.")
        }     
    }

     handleTouchMove(e) {
         //saving touch poistion
        let touchLocation = e.targetTouches[0];
        this.lastTouchX = touchLocation.pageX ;
        this.lastTouchY = touchLocation.pageY ;
        //adding position to the temp element
        let tempElement = document.getElementById("touchTempElement");
        if(tempElement){
            tempElement.style.left = this.lastTouchX +"px";
            tempElement.style.top = this.lastTouchY + "px";
        }
        
        
 
      
    }

    handleTouchEnd(e){
        let tempElement = document.getElementById("touchTempElement");
        if(tempElement){
        tempElement.remove();
        }

        let _targetedTo= null;

        let _poleBoxes = document.getElementsByClassName("pole-box");
        for(let i =0 ; i< _poleBoxes.length; i++){
            
            let _rect = _poleBoxes[i].getBoundingClientRect();
            if(this.lastTouchX >= _rect.left && this.lastTouchX <= _rect.right &&
                this.lastTouchY >= _rect.top && this.lastTouchY <= _rect.bottom){
                  _targetedTo = _poleBoxes[i].getAttribute("id");
                  
                }
        }

        if(this.isWinner(this.getLastMove())){
            this.setMessage("success", "The mystery is already soloved. Refresh the browser to play again.")
            return;
        }
        if(this.elementID && this.targetedFrom && _targetedTo){
            this.moveDisk(this.elementID, this.targetedFrom, _targetedTo);
        }


    }








    moveDisk(_elementID, _targetedFrom, _targetedTo){

        let _gamedata = this.state.gameData.slice();
        let _lastMove = _gamedata[_gamedata.length -1].move.slice();
        let _newMove ={ move: [], moveDetails:null};
        
        for(let i =0; i< _lastMove.length; i++){
            let _poleID = "pole-"+(i+1);
            let _diskList = [];
            for(let j =0; j<_lastMove[i].diskList.length; j++){
                _diskList.push(JSON.parse( JSON.stringify( _lastMove[i].diskList[j])));
            }
            _newMove.move.push ({id:_poleID, diskList:_diskList});
        }
        
 
    
        //validating bigger disk can not sit on the top of small disks.
        let _targetedDiskList = _lastMove[_targetedTo].diskList;
        if(_targetedDiskList.length > 0){
            //make sure that the disk is being dragged is smaller than the disk at index 0 of the targetedPole.
            if(_targetedDiskList[0].value < this.elementValue){
                this.setMessage("warning", "You can not move bigger disk on the top of smaller disk.")
                return;
            }
        }

        //making sure id is not null
        if(_elementID && _targetedFrom && _targetedTo && _lastMove[_targetedFrom].diskList[0] && _lastMove[_targetedFrom].diskList[0].id === _elementID){
            let _movedItem =_newMove.move[_targetedFrom].diskList.shift();
            _newMove.move[_targetedTo].diskList.unshift(_movedItem);
       

            //depending the last move is the wining move or not. if wining move then code will execute.
            if(this.isWinner(_newMove.move)){
                let _finishTime = new Date();
                let _duration = Math.abs(new Date(_finishTime) - new Date(this.state.duration));

                setTimeout(() => {
                    this.setState({
                        isMysterySolved:true,
                        duration: millisToMinutesAndSeconds(_duration),
                    })
                    
                    this.setMessage("success", "You have solved the mystery.");
                    this.saveGameData();
                    
                },500);
            }
            
            //record the time of starting move
            let _startingTime = new Date();
            //Move details
            let _from = parseInt( _targetedFrom) +1;
            let _to = parseInt( _targetedTo) +1;
            _newMove.moveDetails = _elementID + " moves from Pole-"+_from + " to Pole-"+ _to;
            
            let _gameDataLength = _gamedata.length;
            _gamedata.push(_newMove);

            if(_gameDataLength === 1){
                this.setState({
                    gameData:_gamedata,
                    duration: _startingTime,
                });
            }
            else{
                this.setState({
                    gameData: _gamedata,
                });
            }

            

            
       
        }
      
    }
    render() { 
        return (
            <div className="game">
                <MysteryStatus
                    isSolved = {this.getSovledGameData() ? this.getSovledGameData().isMysterySolved:this.state.isMysterySolved}
                    revealingMysetey ={()=> this.revealingMysetey()}
                    duration = {this.getSovledGameData()? this.getSovledGameData().duration: this.state.duration}
                >

                </MysteryStatus>
                <MessageBox 
                message_type = {this.state.message.message_type} 
                text_message = {this.state.message.text_message}
                ></MessageBox>
                <Board
                    gameData = {this.getLastMove()}
                    dragstart = {(event)=>this.drag(event)}
                    allowdrop = {(event)=> this.allowDrop(event)}
                    ondrop = {(event) => this.drop(event)}

                    touchStart = {(event) => this.handleTouchStart(event)}
                    touchMoving = {(event)=> this.handleTouchMove(event)}
                    touchEnd = {(event)=> this.handleTouchEnd(event)}
                />
            </div>
          );
    }
}
 
export default Game;