import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection,
  headerCol,
  info,
} from '@patternfly/react-table';
import {
  CardTitle,
  CardBody,
  Card,
  CardFooter,
  Grid,
  GridItem,
  CardActions,
  Button,
} from '@patternfly/react-core';

import { PlusCircleIcon } from '@patternfly/react-icons';
import BrainyTeammatesPointer from '../../../../assets/img/brainy_teammates-pointer.png';
import './DashTeamView.css';

const DashTeamEmptyState = () => (
  <div className="card-body-content-parent">
    <p>
      In this area, you will be able to add and manage teammates to help you
      with each plugin.
    </p>
    <img style={{ marginLeft: '2em' }} src={BrainyTeammatesPointer} alt="Click Add Plugin" />
  </div>
);

class DashTeamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      columns: [
        {
          title: 'Name',
          property: 'name',
          transforms: [sortable, headerCol()],
        },
        {
          title: 'Position Title',
          property: 'title',
          transforms: [sortable],
        },
        {
          title: 'Date Joined',
          property: 'date_joined',
          transforms: [
            info({
              tooltip: 'More information about teammates',
            }),
            sortable,
          ],
        },
      ],
      sortBy: {},
    };

    this.state.rows = props.plugins.map((plugin) => {
      const row = [];
      const { columns } = this.state;
      row.push(...columns.map(({ property }) => plugin[property])); 
      return row;
    });

    this.onSort = this.onSort.bind(this);
  }

  onSort(_event, index, direction) {
    this.setState((prevState) => {
      // eslint-disable-next-line no-nested-ternary
      const sortedRows = prevState.rows.sort((a, b) => (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0));
      return {
        sortBy: {
          index,
          direction,
        },
        rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse(),
      }
    });
  }

  render() {
    const { plugins } = this.props;
    const { rows, columns, sortBy } = this.state;
    const showEmptyState = isEmpty(plugins);

    return (
      <Grid>
        <GridItem sm={12}>
          <Card>
            <CardTitle>Teammates</CardTitle>
            <CardBody>
              {showEmptyState ? (
                <DashTeamEmptyState />
              ) : (
                <>
                  <Table
                    aria-label="Sortable Table"
                    sortBy={sortBy}
                    onSort={this.onSort}
                    cells={columns}
                    rows={rows}
                    actions={([
                      {
                        title: <a href="https://www.patternfly.org">Link action</a>,
                      },
                      {
                        title: 'Some action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Some action, on row: ', rowId);
                        },
                      },
                      {
                        title: 'Third action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Third action, on row: ', rowId);
                        },
                      },
                    ])}
                    areActionsDisabled={false}
                    dropdownPosition="left"
                    dropdownDirection="bottom"
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                </>
              )}
            </CardBody>
            {!showEmptyState && (
            <CardFooter
              className="card-footer"
            >
              <CardActions>
                <Button variant="secondary">
                  <PlusCircleIcon type="pf" style={{ margin: '0 1em 0 0' }} />
                  <span>Add Teammate</span>
                </Button>
              </CardActions>

            </CardFooter>
            )}
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

DashTeamView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
};

DashTeamView.defaultProps = {
  plugins: [],
};

export default DashTeamView;
