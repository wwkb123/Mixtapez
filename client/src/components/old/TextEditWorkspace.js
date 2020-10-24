import React, { Component } from 'react'

// THIS IS HOW WE DISPLAY THE LOGO, IN THIS COMPONENT
class TextEditWorkspace extends Component {
    render() {
        const styles = {
            container: {
                justifyContent: "center",
                color: this.props.logo.color,
                fontSize: this.props.logo.fontSize + "pt",
                backgroundColor: this.props.logo.backgroundColor,
                borderColor: this.props.logo.borderColor,
                borderRadius: this.props.logo.borderRadius + "px",
                borderStyle: "solid",
                borderWidth: this.props.logo.borderWidth + "px",
                padding: this.props.logo.padding + "%",
                margin: this.props.logo.margin + "%"
            }
        }
        return (
            <div className="col s4"
                style={ styles.container }>
                {this.props.logo.text}
            </div>
        )
    }
}

export default TextEditWorkspace