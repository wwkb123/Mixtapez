import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import TextEditWorkspace from './TextEditWorkspace.js'


const GET_LOGO = gql`
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderRadius
            borderWidth
            padding
            margin
        }
    }
`;

const UPDATE_LOGO = gql`
    mutation updateLogo(
        $id: String!,
        $text: String!,
        $color: String!,
        $fontSize: Int!,
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderWidth: Int!,
        $padding: Int!,
        $margin: Int!) {
            updateLogo(
                id: $id,
                text: $text,
                color: $color,
                fontSize: $fontSize,
                backgroundColor: $backgroundColor,
                borderColor: $borderColor,
                borderRadius: $borderRadius,
                borderWidth: $borderWidth,
                padding: $padding,
                margin: $margin) {
                    lastUpdate
                }
        }
`;

class EditLogoScreen extends Component {
    constructor(){
        super();
        this.state = {
            text: "",
            color: "",
            fontSize: "",
            backgroundColor: "",
            borderColor: "",
            borderRadius: "",
            borderWidth: "",
            padding: "",
            margin: "",
            flag: false
        }
    }
    render() {
        let text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        return (
            <Query query={GET_LOGO} variables={{ logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    let logo;
                    if(this.state.flag === false){
                        logo = data.logo;
                    }else{
                        logo = {   
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
                    }
                    
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <Mutation mutation={UPDATE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push(`/`)}>
                            {(updateLogo, { loading, error }) => (
                                <div className="container">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h4><Link to="/">Home</Link></h4>
                                            <h3 className="panel-title">
                                                Edit Logo
                                        </h3>
                                        </div>
                                        <div className="row" style={{ justifyContent: "space-between" }}>

                                            <div className="panel-body">
                                                <form onSubmit={e => {
                                                    e.preventDefault();
                                                    updateLogo({
                                                        variables: {
                                                            id: data.logo._id,
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
                                                        }} placeholder="Text" defaultValue={data.logo.text}
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
                                                        }} placeholder="Color" defaultValue={data.logo.color} 
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
                                                        }} placeholder="Font Size" defaultValue={data.logo.fontSize} 
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
                                                        }} placeholder="backgroundColor" defaultValue={data.logo.backgroundColor} 
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
                                                        }} placeholder="borderColor" defaultValue={data.logo.borderColor} 
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
                                                        }} placeholder="borderRadius" defaultValue={data.logo.borderRadius} 
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
                                                        }} placeholder="borderWidth" defaultValue={data.logo.borderWidth} 
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
                                                        }} placeholder="padding" defaultValue={data.logo.padding} 
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
                                                        }} placeholder="margin" defaultValue={data.logo.margin} 
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
                }}
            </Query>
        );
    }
}

export default EditLogoScreen;