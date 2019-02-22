// @flow
import * as React from "react";
import _ from 'lodash';
import JsonViewer from '../../components/JsonViewer/index';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import LoadingIndicator from 'components/LoadingIndicator';
import Table from "../Messages/Messages";

const padding ={
  padding: '10px 20px'
}

const paddingBottom ={
  padding: '0 0 20px 0'
}


const defaultProps = {
  logsTab: {},
  logs: []
};

const propTypes = {
  logsTab: PropTypes.object,
  getLogs: PropTypes.func,
};


class Logs extends React.Component {

  static defaultProps = defaultProps;

  static propTypes = propTypes;

  componentDidMount() {
    this.props.getLogs({});
  }

  showJson() {
    const { logs } = this.props;

    debugger;

    let info = logs.map((data, index)=> {
      return(
        <div style={paddingBottom}>
          <JsonViewer
            json={data}
            key={data.id}
          />
        </div>
      )
    });

    return (
      <div>
        {info}
      </div>
    )
  }

  render() {
    const { isLoaded } = this.props;

    return (
        <Grid>
          {isLoaded ? (
            <Paper>
              <div style={padding}>
                {this.showJson()}
              </div>
            </Paper>
          ) : (
            <LoadingIndicator />
          )}
        </Grid>
    );
  }
}

export default Logs;
