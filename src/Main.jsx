import React from 'react';
import Grid from './Grid';
import Intro from './Intro';
import { connect } from 'react-redux';
import { compose } from 'redux';

var width;
var height;
var userSpeed = 300;

class Main extends React.Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line react/prop-types
        if (this.props.m != null) {
            for (var i = 0; i <= 100; i++) {
                // eslint-disable-next-line react/prop-types
                if (i == this.props.m) {
                    width = i;
                }
            }
        } else {
            width = 50;
        }
        // eslint-disable-next-line react/prop-types
        if (this.props.n != null) {
            for (var j = 0; j <= 100; j++) {
                // eslint-disable-next-line react/prop-types
                if (j == this.props.n) {
                    height = j;
                }
            }
        } else {
            height = 30;
        }

        console.log(width + ' ' + height);
        this.state = {
            speed: 300,
            paused: true,
            livingcells: 0,
            grid: Array(height)
                .fill()
                // eslint-disable-next-line react/prop-types
                .map(() => Array(width).fill(false)),
            aliveness: Array(height)
                .fill()
                // eslint-disable-next-line react/prop-types
                .map(() => Array(width).fill(0)),
            outofbound: false,
            // // eslint-disable-next-line react/prop-types
            // total: this.props.count,
        };
        //console.log(width);
    }

    // outofbound = (m, n) => {
    //     this.setState({
    //         grid: [],
    //     });
    // };

    updateCell = (i, j) => {
        let copy = JSON.parse(JSON.stringify(this.state.grid));
        let map = JSON.parse(JSON.stringify(this.state.aliveness));
        let livingcount = this.state.livingcells;
        copy[i][j] = !copy[i][j];
        if (copy[i][j]) {
            livingcount += 1;
        } else {
            livingcount -= 1;
        }
        this.setState({
            grid: copy,
            aliveness: map,
            livingcells: livingcount,
        });
    };

    increment = () => {
        // eslint-disable-next-line react/prop-types
        this.props.dispatch({ type: 'INCREMENT' });
        // console.log('Another ONNNNNNNNNNNNE');
    };

    reset = () => {
        // eslint-disable-next-line react/prop-types
        this.props.dispatch({ type: 'RESET' });
        console.log('0000000000000000000');
    };

    init = () => {
        this.clear();
        let copy = JSON.parse(JSON.stringify(this.state.grid));
        let map = JSON.parse(JSON.stringify(this.state.aliveness));
        let cells = 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                copy[i][j] = false;
                map[i][j] = 0;
                if (Math.random() <= 0.05) {
                    copy[i][j] = true;
                    map[i][j] = 1;
                    // eslint-disable-next-line react/prop-types
                    cells++;
                    console.log('++++++++++++++++++++++++++++++');
                }
            }
        }
        this.increment();
        this.setState({
            grid: copy,
            aliveness: map,
            livingcells: cells,
        });
    };

    clear = () => {
        let copy = JSON.parse(JSON.stringify(this.state.grid));
        let map = JSON.parse(JSON.stringify(this.state.aliveness));
        this.reset();
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                copy[i][j] = false;
                map[i][j] = 0;
            }
        }

        this.setState({
            grid: copy,
            aliveness: map,
            livingcells: 0,
        });
    };

    pause = () => {
        clearInterval(this.intervalId);
        this.setState({
            paused: true,
        });
    };

    play = () => {
        clearInterval(this.intervalId);
        this.setState({
            paused: false,
        });
        if (userSpeed != null) {
            this.intervalId = setInterval(this.next, userSpeed);
        } else {
            this.intervalId = setInterval(this.next, this.state.speed);
        }
    };

    next = () => {
        let hasChange = false;
        let neighborlive = 0;
        // eslint-disable-next-line react/prop-types
        let livingcount = this.state.livingcells;
        let copy = JSON.parse(JSON.stringify(this.state.grid));
        let map = JSON.parse(JSON.stringify(this.state.aliveness));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (i > 0) {
                    if (copy[i - 1][j] == true) {
                        neighborlive++;
                    }
                }
                if (j > 0) {
                    if (copy[i][j - 1] == true) {
                        neighborlive++;
                    }
                }
                if (j > 0 && i > 0) {
                    if (copy[i - 1][j - 1] == true) {
                        neighborlive++;
                    }
                }
                if (i < height - 1) {
                    if (copy[i + 1][j] == true) {
                        neighborlive++;
                    }
                }
                if (j < width - 1) {
                    if (copy[i][j + 1] == true) {
                        neighborlive++;
                    }
                }
                if (i < height - 1 && j < width - 1) {
                    if (copy[i + 1][j + 1] == true) {
                        neighborlive++;
                    }
                }
                if (i > 0 && j < width - 1) {
                    if (copy[i - 1][j + 1] == true) {
                        neighborlive++;
                    }
                }
                if (i < height - 1 && j > 0) {
                    if (copy[i + 1][j - 1] == true) {
                        neighborlive++;
                    }
                }
                if (copy[i][j] == true) {
                    if (neighborlive == 2 || neighborlive == 3) {
                        copy[i][j] = true;
                        map[i][j] = 1;
                    } else {
                        hasChange = true;
                        copy[i][j] = false;
                        map[i][j] = 0.9;
                        livingcount = livingcount - 1;
                        console.log('KILL ONE');
                    }
                    //console.log(neighborlive);
                    neighborlive = 0;
                    continue;
                }
                if (copy[i][j] == false) {
                    map[i][j] = map[i][j] - 0.1 > 0 ? map[i][j] - 0.1 : 0;
                    if (neighborlive == 3) {
                        hasChange = true;
                        copy[i][j] = true;
                        map[i][j] = 1;
                        livingcount = livingcount + 1;
                        console.log('bring back one');
                    }
                    //console.log(neighborlive);
                    neighborlive = 0;
                    continue;
                }
            }
        }
        console.log(livingcount);
        if (hasChange) {
            this.increment();
        }
        this.setState({
            grid: copy,
            aliveness: map,
            livingcells: livingcount,
        });
        if (!hasChange) {
            this.pause();
        }
    };

    turnon = () => {
        clearInterval(this.intervalId);
        this.setState({
            paused: true,
        });
        // eslint-disable-next-line react/prop-types
        this.props.dispatch({ type: 'HEAT' });
        console.log('DISPATH MADE!!!!!!!!!');
        // eslint-disable-next-line react/prop-types
        console.log(this.props.count);
    };

    turnoff = () => {
        clearInterval(this.intervalId);
        this.setState({
            paused: true,
        });
        // eslint-disable-next-line react/prop-types
        this.props.dispatch({ type: 'GAME' });
        console.log('DISPATH MADE???????');
        // eslint-disable-next-line react/prop-types
        console.log(this.props.count);
    };

    outofbound = () => {
        if (width >= 10 && width <= 100 && height >= 10 && height <= 100) {
            //console.log(height + ' ' + width);
            return (
                <Grid
                    grid={this.state.grid}
                    aliveness={this.state.aliveness}
                    rows={height}
                    cols={width}
                    // eslint-disable-next-line react/prop-types
                    isheat={this.props.heatmapon}
                    updateCell={this.updateCell}
                />
            );
        } else {
            return (
                <div>
                    {' '}
                    Your input is out of bound (valid input should between 10 -
                    100)
                </div>
            );
        }
    };

    myChangeHandlerspeed = event => {
        userSpeed = event.target.value;
        //console.log(event.target.value + ' ' + this.state.speed);
        this.setState({
            speed: userSpeed,
        });
    };

    // componentDidMount() {
    //     this.enterSpeed;
    // }

    enterSpeed = () => {
        if (this.state.paused) {
            return (
                <div>
                    <p>Speed of your choice (50 - 2000)</p>
                    <input type="text" onChange={this.myChangeHandlerspeed} />
                </div>
            );
        } else {
            return (
                // document.getElementbyId("anyid").innerHTML = score;
                <div>
                    <p>Current speed</p>
                    <div dangerouslySetInnerHTML={{ __html: userSpeed }} />
                </div>
            );
        }
    };

    render() {
        //console.log(this.state);
        var buttonStyle = {
            margin: '20px',
        };
        // eslint-disable-next-line react/prop-types
        console.log(this.props.count);

        return (
            <div>
                <h2>
                    Generations:{' '}
                    {
                        // eslint-disable-next-line react/prop-types
                        this.props.count
                    }
                </h2>
                <p>
                    Living Cells:
                    {' ' + this.state.livingcells}
                </p>
                <this.outofbound />
                <button style={buttonStyle} type="button" onClick={this.init}>
                    initial
                </button>
                <button style={buttonStyle} type="button" onClick={this.next}>
                    next
                </button>
                <button style={buttonStyle} type="button" onClick={this.play}>
                    start
                </button>
                <button style={buttonStyle} type="button" onClick={this.pause}>
                    pause
                </button>
                <button style={buttonStyle} type="button" onClick={this.clear}>
                    clear
                </button>
                <button style={buttonStyle} type="button" onClick={this.turnon}>
                    Show Heat Map
                </button>
                <button
                    style={buttonStyle}
                    type="button"
                    onClick={this.turnoff}>
                    Show Game Board
                </button>
                <this.enterSpeed></this.enterSpeed>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        heatmapon: state.heatmapon,
        count: state.count,
        generation: state.generation,
    };
}

export default connect(mapStateToProps)(Main);
