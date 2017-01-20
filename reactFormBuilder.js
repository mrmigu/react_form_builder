// require("babel-runtime").transform("code", {
//   plugins: ["transform-runtime"]
// });
var _ = require('lodash');
var fs = require("fs");
var contents = fs.readFileSync(process.argv[2]);
var formData = JSON.parse(contents);

var file = `
'use strict';
import './css/${formData.componentName}.css';
import React from 'react'`;

_.forEach(formData.includes, function(include){
  file += `
    ${include}`;
});

file += `
class ${formData.componentName} extends React.Component {
  constructor(props) {
    super(props);
    this.state = {`;
_.forEach(formData.fields, function(value) {
  file += `
      ${value.name}: '',`;
});
file += `
    };`

_.forEach(formData.fields, function(value) {
  file += `
    this.${value.name}ChangeHandler = this.${value.name}ChangeHandler.bind(this);`;
});

file += `
    this.handleSubmit = this.handleSubmit.bind(this);
  }`;

_.forEach(formData.fields, function(value) {
  file += `
  ${value.name}ChangeHandler(event) {
    this.setState({${value.name}: event.target.value});
  }`;
});

file += `
    handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div><h1>${formData.pageTitle}</h1></div>
        <div>
        <form onSubmit={this.handleSubmit}>
          <div>`;
_.forEach(formData.fields, function(value) {
  file += `

            <label for="${value.name}">${value.label}:</label>
            <div>`;
  if(value.type == "select"){
    file += `
              <select name="${value.name}" value="{this.state.${value.name}}" onChange={this.${value.name}ChangeHandler} >`;
    _.forEach(value.options, function(option) {
      file += `
                <option value="${option.value}">${option.label}</option>`;
    });
    file += `
              </select>`;
  }else{
    file += `
              <input type="${value.type}" value={this.state.${value.name}} onChange={this.${value.name}ChangeHandler} />`;
  }
  file += `
            </div>`;
});

file += `
            <div><button type="button">${formData.submitText}</button></div>
          </div>
        </form>`;
file += `
    </div>`;
// _.forEach(formData.fields, function(value) {
// file += `
// <h3>${value.name} : {this.state.${value.name}}</h3>`;
// });

file += `
    </div>
    );
  }
}

module.exports = ${formData.componentName};
`;

console.log(file);
