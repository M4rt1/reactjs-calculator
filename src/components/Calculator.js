import '../styles/Calculator.css'
import React from 'react';
import { create, all } from 'mathjs'

const config = {}
const math = create(all, config)

const NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '*', '-', '+', '.'];
const OPERATORS = ['/', '*', '+'];
let operatorIndex;

export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: '0'
        };
        this.handleClick = this.handleClick.bind(this);
        this.clearDisplay = this.clearDisplay.bind(this);
        this.showDisplay = this.showDisplay.bind(this);
        this.handleOutput = this.handleOutput.bind(this);
        this.checkDoubleDot = this.checkDoubleDot.bind(this);
        this.checkOperators = this.checkOperators.bind(this);
        this.checkOperatorIndex = this.checkOperatorIndex.bind(this);
        this.checkTwoDecimals = this.checkTwoDecimals.bind(this);
        this.checkFirstChar = this.checkFirstChar.bind(this);

    }

    clearDisplay(e) {
        if (e.target.value === 'CLEAR' || this.state.display === '0') {
            this.setState({
                display: '0',
            });
        }
    };

    showDisplay(e) {
        if (this.state.display.charAt(0) === '0' && e.target.value !== 'CLEAR') {
            this.setState({
                display: e.target.value
            });
        } else if (NUMS.includes(e.target.value)) {
            let addState = this.state.display + e.target.value;
            this.setState({
                display: addState
            });
        }
    };

    handleOutput(e) {
        if (e.target.value === '=' &&
            !OPERATORS.includes(this.state.display.charAt(this.state.display.length - 1)) &&
            this.state.display.charAt(this.state.display.length - 1) !== '-') {
            this.setState({
                display: math.evaluate(this.state.display).toString()
            });
            operatorIndex = 0;
        }
        else if (e.target.value === '=') {
            let prevDisplay = this.state.display.slice(0, -1);
            this.setState({
                display: prevDisplay
            });
        }
    };

    checkDoubleDot(e) {
        let displayLength = this.state.display.length;
        let currentDisplay = this.state.display;
        if (e.target.value === '.' && this.state.display.charAt(displayLength - 1) === '.') {
            this.setState({
                display: currentDisplay
            });
        }
    }

    checkTwoDecimals(e) {
        // CHECK DISPLAY LENGTH [ MINIMUM MUST BE 2 TO CONTAINT MINIMAL WRONG EXPRESSION EX. 5.5.]
        // CHECK IF e IS .
        if (this.state.display.length >= 2 && e.target.value === '.') {
            let indexDisplay = this.state.display.slice(operatorIndex, this.state.display.length);
            if (indexDisplay.includes('.')) {
                let currentDisplay = this.state.display;
                this.setState({
                    display: currentDisplay
                });
            }
        }
    }

    checkOperators(e) {
        let displayLength = this.state.display.length;
        let currentDisplay = this.state.display;
        let isEOperator = OPERATORS.includes(e.target.value);
        //CHECK IF ENTERED CHAR IS OPERATOR AND LAST CHAR IN DISPLAY IS EQUAL TO ENTERED CHAR
        if (OPERATORS.includes(e.target.value) && this.state.display.charAt(displayLength - 1) === e.target.value) {
            this.setState({
                display: currentDisplay
            });
        }//"5 * - + 5" = should produce an output of "10"
        else if (
            (// CHECK IF ENTERED CHAR IS OPERATOR
                isEOperator &&
                // CHECK IF LAST CHAR IN DISPLAY IS OPERATOR
                OPERATORS.includes(this.state.display.charAt(displayLength - 1))) ||
            // OR CHECK IF ENTERED CHAR IS OPERATOR AND LAST CHAR OF DISPLAY IS MINUS
            (isEOperator && this.state.display.charAt(displayLength - 1) === '-')

        ) {
            // CREATE DISPLAY WITHOUT LAST CHAR
            let displayWithoutLastChar = this.state.display.slice(0, -1);
            // ADD CURRENT CHAR TO DISPLAY WITHOUT LAST CHAR
            this.setState({
                display: displayWithoutLastChar + e.target.value
            });
        };
        // IF DISPLAY HAS MIN 3 CHARS
        if (displayLength >= 2) {
            // IF ENTERED CHAR IS OPERATOR AND LAST CHAR IS MINUS
            if (isEOperator && this.state.display.charAt(displayLength - 1) === '-' &&
                // AND IF SECOND LAST CHAR IS OPERATOR
                OPERATORS.includes(this.state.display.charAt(displayLength - 2))) {
                //CREATE NEW DISPLAY WITHOUT TWO LAST CHARS
                let sliceDisplay = this.state.display.slice(0, -2);
                this.setState({
                    display: sliceDisplay + e.target.value
                })
            }
        }
    }

    checkOperatorIndex() {
        if (OPERATORS.includes(this.state.display.charAt(this.state.display.length - 1)) || '-'.includes(this.state.display.charAt(this.state.display.length - 1))) {
            operatorIndex = this.state.display.length - 1;
            console.log(operatorIndex);
        }
    }

    checkFirstChar(e) {
        if (OPERATORS.includes(e.target.value) && this.state.display.charAt(0) === '0') {
            let prevDisplay = this.state.display;
            this.setState({
                display: prevDisplay
            });
        }
    }

    handleClick(e) {
        this.checkOperatorIndex();

        this.clearDisplay(e);
        this.showDisplay(e);    // WROC DO HANDLEOUTPUT KURWIU KEKW
        this.handleOutput(e);
        this.checkDoubleDot(e);
        this.checkOperators(e);
        this.checkTwoDecimals(e);
        this.checkFirstChar(e);
    }

    render() {

        return (
            <div className='calculator' >
                <div id='display'>
                    <p className='display-text'>{this.state.display}</p>
                </div>
                <div id='pad'>
                    <div id='first-row' className='row'>
                        <button id='clear' className='standard-button clr-button' onClick={this.handleClick} value='CLEAR'>CL</button>
                        <button id='divide' className='standard-button op-button' onClick={this.handleClick} value='/'>/</button>
                        <button id='multiply' className='standard-button op-button' onClick={this.handleClick} value='*'>*</button>
                        <button id='subtract' className='standard-button op-button' onClick={this.handleClick} value='-'>-</button>
                    </div>
                    <div className='row'>
                        <button id='seven' className='standard-button number-pad' onClick={this.handleClick} value='7'>7</button>
                        <button id='eight' className='standard-button number-pad' onClick={this.handleClick} value='8'>8</button>
                        <button id='nine' className='standard-button number-pad' onClick={this.handleClick} value='9'>9</button>
                        <button id='add' className='high-button op-button' onClick={this.handleClick} value='+'>+</button>
                        <button id='four' className='standard-button number-pad' onClick={this.handleClick} value='4'>4</button>
                        <button id='five' className='standard-button number-pad' onClick={this.handleClick} value='5'>5</button>
                        <button id='six' className='standard-button number-pad' onClick={this.handleClick} value='6'>6</button>
                    </div>
                    <div className='row'>
                        <button id='one' className='standard-button number-pad' onClick={this.handleClick} value='1'>1</button>
                        <button id='two' className='standard-button number-pad' onClick={this.handleClick} value='2'> 2</button>
                        <button id='three' className='standard-button number-pad' onClick={this.handleClick} value='3'>3</button>
                        <button id='equals' className='high-button' onClick={this.handleClick} value='='>=</button>
                        <button id='zero' className='number-pad' onClick={this.handleClick} value='0'>0</button>
                        <button id='decimal' className='standard-button' onClick={this.handleClick} value='.'>.</button>
                    </div>
                </div>
            </div>
        )
    }
}