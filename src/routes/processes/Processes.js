import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Processes.css';

class Processes extends Component {
  render() {
    const { processes } = this.props;
    return (
      <div className={s.table}>
        {processes.map(p => (
          <div className={s.row}>
            <div className={s.cell}>{p.id}</div>
            <div className={s.cell}>{p.scheme}</div>
            <div className={s.cell}>{p.status}</div>
            <Link className={s.cell} to={`/process/${p.id}`}>
              Просмотреть
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(s)(Processes);
