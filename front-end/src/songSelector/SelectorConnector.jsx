import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './Selector.css';
import View from './SelectorView';
class SelectorConnector extends Component {
  constructor(props) {
    super(props);
    this.state = { color: props.initialColor, value: '' };
  }
  componentWillMount() {
    this.handleChange = this.handleChange.bind(this);
    this.submitChange = this.submitChange.bind(this);
  }
  handleChange(event) {
    if (this.props.handleChange) {
      this.props.handleChange(event.target.value);
      this.setState({ value: event.target.value });
    } else {
      this.setState({ value: event.target.value });
    }
  }
  submitChange(event) {
    if (this.props.handleSubmit) {
      this.props.handleSubmit(this.state.value);
    }
  }
  render() {
    var height = this.props.height ? this.props.height : null;
    var icon = this.props.icon || <i style={{color:'white',fontSize:'24px'}} className="icon ion-ios-search"></i>
    var to = this.props.to || null;
    return (
      <View
        imgIcon={icon}
        to={to}
        limit={this.props.limit || "500"}
        height={height}
        changeAction={this.handleChange}
        submitAction={this.submitChange}
      />
    );
  }
}
export default observer(SelectorConnector);
