import React, { Component } from 'react';
class MysteryStatus extends Component {
    state = {  }
    render() { 
        const content = this.props.isSolved ?
                <div className={"solved"}>
                    {
                    "Great!,  You have solved the mystery of 'Tower of Honai' with-in a recorded time " 
                    +
                    this.props.duration + " (mm:ss)." 
                    }
                    <button 
                    id = {"reveal_button"}
                    onClick = { this.props.revealingMysetey}
                    >{"Reveal Mystery"}</button>
                </div> :
                <div className= {"unsolved"} >{"'Tower of Honai' is still mysterious puzzle to many people."}</div>

        return ( 
            <div className ="mystery-box">
                {content}
            </div>
         );
    }
}
 
export default MysteryStatus;