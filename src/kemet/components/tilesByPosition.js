import React from 'react';
import Chartist from '../../Bar';
import { connect } from 'react-redux';
import incrementalAverage from 'incremental-average';

const graph = ({games, players, tiles, color, config: {perPlayer}}) => {

  const colored_tiles = tiles.filter(d => d.color === color).map(d => d.name);

  const I = players.map(() => colored_tiles.map(() => incrementalAverage()));

  const R = (acc, {setup}) => {
    setup.forEach(({tiles: _tiles, position, player}) => {
      _tiles.forEach(t => {
        let p = perPlayer ? players.indexOf(player) : 0;
        let i = colored_tiles.indexOf(t);

        if(i > -1) {
          acc[p][i].add(position + 1);
        }
      });
    });

    return acc;
  };

  return {
    'labels': colored_tiles,
    'series': games.reduce(R, I).map(d => d.map(v => v.getAverage())),
    'total': games.length,
    'sample': games.length
  };
};

const mapStateToProps = state => ({
  ...state.kemetReducer,
  options: {
    stackBars: false
  },
  draw: () => 1,
  className: "ct-octave players"
});

class Element extends React.Component {

  render() {
    const args = {...this.props, data: graph(this.props)}
    return <Chartist {...args} />;
  }
}

export default connect(mapStateToProps)(Element);
