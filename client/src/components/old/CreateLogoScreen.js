import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';
import TextEditWorkspace from './TextEditWorkspace.js'


const ADD_LOGO = gql`
    mutation AddLogo(
        $text: String!,
        $color: String!,
        $fontSize: Int!,
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderWidth: Int!,
        $padding: Int!,
        $margin: Int!) {
        addLogo(
            text: $text,
            color: $color,
            fontSize: $fontSize,
            backgroundColor: $backgroundColor,
            borderColor: $borderColor,
            borderRadius: $borderRadius,
            borderWidth: $borderWidth,
            padding: $padding,
            margin: $margin) {
            _id
        }
    }
`;

const DEFAULT_VALUE = {
    text: "LOGO",
    color: "#FFFFFF",
    fontSize: "20",
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderRadius: "10",
    borderWidth: "10",
    padding: "5",
    margin: "5"
}

class CreateLogoScreen extends Component {
    constructor() {
        super();
        this.state = {
            text: DEFAULT_VALUE.text,
            color: DEFAULT_VALUE.color,
            fontSize: DEFAULT_VALUE.fontSize,
            backgroundColor: DEFAULT_VALUE.backgroundColor,
            borderColor: DEFAULT_VALUE.borderColor,
            borderRadius: DEFAULT_VALUE.borderRadius,
            borderWidth: DEFAULT_VALUE.borderWidth,
            padding: DEFAULT_VALUE.padding,
            margin: DEFAULT_VALUE.margin,
            flag: false
        }
    }
    render() {
        let text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        let logo = {
                text: this.state.text,
                color: this.state.color,
                fontSize: this.state.fontSize,
                backgroundColor: this.state.backgroundColor,
                borderColor: this.state.borderColor,
                borderRadius: this.state.borderRadius,
                borderWidth: this.state.borderWidth,
                padding: this.state.padding,
                margin: this.state.margin
            }
        return (
            <Mutation mutation={ADD_LOGO} onCompleted={() => this.props.history.push('/')}>
                {(addLogo, { loading, error }) => (
                    <div className="container">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4><Link to="/">Home</Link></h4>
                                <h3 className="panel-title">
                                    Create Logo
                            </h3>
                            </div>
                            <div className="row" style={{ justifyContent: "space-between" }}>
                                <div className="panel-body">
                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        addLogo({
                                            variables: {
                                                text: text.value,
                                                color: color.value,
                                                fontSize: parseInt(fontSize.value),
                                                backgroundColor: backgroundColor.value,
                                                borderColor: borderColor.value,
                                                borderRadius: parseInt(borderRadius.value),
                                                borderWidth: parseInt(borderWidth.value),
                                                padding: parseInt(padding.value),
                                                margin: parseInt(margin.value)
                                            }
                                        });
                                        text.value = "";
                                        color.value = "";
                                        fontSize.value = "";
                                        backgroundColor.value = "";
                                        borderColor.value = "";
                                        borderRadius.value = "";
                                        borderWidth.value = "";
                                        padding.value = "";
                                        margin.value = "";
                                    }}>
                                        <div className="form-group">
                                            <label htmlFor="text">Text:</label>
                                            <input type="text" className="form-control" name="text" ref={node => {
                                                text = node;
                                            }} placeholder="Text" defaultValue={DEFAULT_VALUE.text}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            } />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="color">Color:</label>
                                            <input type="color" className="form-control" name="color" ref={node => {
                                                color = node;
                                            }} placeholder="Color" defaultValue={DEFAULT_VALUE.color}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="fontSize">Font Size:</label>
                                            <input type="number" className="form-control" name="fontSize" ref={node => {
                                                fontSize = node;
                                            }} placeholder="Font Size" defaultValue={DEFAULT_VALUE.fontSize}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="backgroundColor">Background Color:</label>
                                            <input type="color" className="form-control" name="backgroundColor" ref={node => {
                                                backgroundColor = node;
                                            }} placeholder="backgroundColor" defaultValue={DEFAULT_VALUE.backgroundColor}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="borderColor">Border Color:</label>
                                            <input type="color" className="form-control" name="borderColor" ref={node => {
                                                borderColor = node;
                                            }} placeholder="borderColor" defaultValue={DEFAULT_VALUE.borderColor}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="borderRadius">Border Radius:</label>
                                            <input type="number" className="form-control" name="borderRadius" ref={node => {
                                                borderRadius = node;
                                            }} placeholder="borderRadius" defaultValue={DEFAULT_VALUE.borderRadius}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="borderWidth">Border Width:</label>
                                            <input type="number" className="form-control" name="borderWidth" ref={node => {
                                                borderWidth = node;
                                            }} placeholder="borderWidth" defaultValue={DEFAULT_VALUE.borderWidth}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="padding">Padding:</label>
                                            <input type="number" className="form-control" name="padding" ref={node => {
                                                padding = node;
                                            }} placeholder="padding" defaultValue={DEFAULT_VALUE.padding}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="margin">Margin:</label>
                                            <input type="number" className="form-control" name="margin" ref={node => {
                                                margin = node;
                                            }} placeholder="margin" defaultValue={DEFAULT_VALUE.margin}
                                            onChange={() => {
                                                    this.setState({
                                                        text: text.value,
                                                        color: color.value,
                                                        fontSize: parseInt(fontSize.value),
                                                        backgroundColor: backgroundColor.value,
                                                        borderColor: borderColor.value,
                                                        borderRadius: parseInt(borderRadius.value),
                                                        borderWidth: parseInt(borderWidth.value),
                                                        padding: parseInt(padding.value),
                                                        margin: parseInt(margin.value),
                                                        flag: true
                                                    })
                                                }
                                            }/>
                                        </div>
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </form>
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error :( Please try again</p>}
                                </div>
                                <div className="row">
                                    <TextEditWorkspace
                                        logo={logo} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default CreateLogoScreen;