/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import './css/Board.css'
import Cell from './Cell';
import Modal from './Modal';
import Dashboard from './Dashboard';
import { revealed } from '../util/reveal';
import createBoard from '../util/createBoard';
import React, { useEffect, useState } from 'react';
// import { set } from 'cypress/types/lodash';


const Board = ({ boardSize, mineNum, backToHome }) => {
    const [board, setBoard] = useState([]);                     // An 2-dimentional array. It is used to store the board.
    const [nonMineCount, setNonMineCount] = useState(0);        // An integer variable to store the number of cells whose value are not '💣'.
    const [mineLocations, setMineLocations] = useState([]);     // An array to store all the coordinate of '💣'.
    const [gameOver, setGameOver] = useState(false);            // A boolean variable. If true, means you lose the game (Game over).
    const [remainFlagNum, setRemainFlagNum] = useState(0);      // An integer variable to store the number of remain flags.
    const [win, setWin] = useState(false);                      // A boolean variable. If true, means that you win the game.

    useEffect(() => {
        // Calling the function
        freshBoard();
    }, []);

    // Creating a board
    const freshBoard = () => {
        const newBoard = createBoard(boardSize, mineNum);
        // Basic TODO: Use `newBoard` created above to set the `Board`.
        setMineLocations(newBoard.mineLocations);
        setBoard(newBoard.board);
        // Hint: Read the definition of those Hook useState functions and make good use of them.
        setRemainFlagNum(10);
    }

    const restartGame = () => {
        freshBoard();
        setGameOver(false);
        setWin(false);
    }

    // On Right Click / Flag Cell
    const updateFlag = (e, x, y) => {
        // To not have a dropdown on right click
        e.preventDefault();
        // Deep copy of a state
        let newBoard = JSON.parse(JSON.stringify(board));
        let newFlagNum = remainFlagNum;

        // Basic TODO: Right Click to add a flag on board[x][y]
        // Remember to check if board[x][y] is able to add a flag (remainFlagNum, board[x][y].revealed)
        // Update board and remainFlagNum in the end
        if (remainFlagNum > 0 && !board[x][y].revealed) {
            if (!board[x][y].flagged) {
                const updatedBoard = board.map((obj, i) => {
                    if (i == x) {
                        const updatedobj = obj.map((el, index) => {
                            if (index == y) {
                                return { ...el, flagged: true }
                            }
                            return el
                        })
                        return updatedobj
                    }
                    return obj
                })
                setBoard(updatedBoard);
                newFlagNum -= 1;
                setRemainFlagNum(newFlagNum);
            } else {
                const updatedBoard = board.map((obj, i) => {
                    if (i == x) {
                        const updatedobj = obj.map((el, index) => {
                            if (index == y) {
                                return { ...el, flagged: false }
                            }
                            return el
                        })
                        return updatedobj
                    }
                    return obj
                })
                setBoard(updatedBoard);
                newFlagNum += 1;
                setRemainFlagNum(newFlagNum);
            }
        }
    };

    const revealCell = (x, y) => {
        if (board[x][y].revealed || gameOver || board[x][y].flagged) return;
        let newBoard = JSON.parse(JSON.stringify(board));
        // Basic TODO: Complete the conditions of revealCell (Refer to reveal.js)
        // Hint: If `Hit the mine`, check ...?
        //       Else if `Reveal the number cell`, check ...?
        // Reminder: Also remember to handle the condition that after you reveal this cell then you win the game.
        if (board[x][y].value == '💣') {
            // map througe board to filter out all bomb object without flagged
            let allBombObjArr = [];
            board.map((el, index) => {
                el.map((e, i) => {
                    if (e.value == '💣' && !e.flagged) {
                        allBombObjArr.push(e);
                    }
                })
            })

            allBombObjArr.map((el,index)=>{
                let x = el.x;
                let y = el.y; 
                updateBoard(board,x,y);
            })
            setGameOver(true);
        }
        // 進階功能才需要 
        // else if (board[x][y].value ==0){
         
        // }
        else{
            updateBoard(board, x, y);
        }

        function updateBoard(board, x, y){
            let updatedBoardObj = revealed(board, x, y);
            let updatedCellObj = updatedBoardObj.board[x][y];

            const updatedBoard = board.map((el, index) => {
                if (index == x) {
                    el.map((e, i) => {
                        if (i == y) {
                            return updatedCellObj;
                        }
                        return e
                    })
                }
                return el
            })
            setBoard(updatedBoard);
        }



    };

    return (
        <div className='boardPage' >
            <div className='boardWrapper' >
                {/* <h1>This is the board Page!</h1>  This line of code is just for testing. Please delete it if you finish this function. */}

                {/* Advanced TODO: Implement Modal based on the state of `gameOver` */}

                {/* Basic TODO: Implement Board 
                Useful Hint: The board is composed of BOARDSIZE*BOARDSIZE of Cell (2-dimention). So, nested 'map' is needed to implement the board.
                Reminder: Remember to use the component <Cell> and <Dashboard>. See Cell.js and Dashboard.js for detailed information. */}
                <div className='boardContainer'>
                    <Dashboard remainFlagNum={remainFlagNum} gameOver={gameOver} />
                    {board.map((el, i) => {
                        return <div key={i} id={'row' + i} style={{ display: 'flex' }}>
                            {el.map((e, index) => {
                                return <Cell key={index} rowIdx={i} colIdx={index} detail={e} updateFlag={updateFlag} revealCell={revealCell} />
                            })}
                        </div>
                    })}
                </div>
            </div>
        </div>
    );

}

export default Board;