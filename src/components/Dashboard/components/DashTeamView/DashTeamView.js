import React, { Component } from "react";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import PropTypes from "prop-types";
import * as sort from "sortabular";
import * as resolve from "table-resolver";
import {
  actionHeaderCellFormatter,
  customHeaderFormattersDefinition,
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  Table,
  TABLE_SORT_DIRECTION,
  MenuItem,
  Col,
  Icon
} from "patternfly-react";
import { CardTitle, CardBody, Card, CardFooter } from "@patternfly/react-core";
import BrainyTeammatesPointer from "../../../../assets/img/brainy_teammates-pointer.png";
import "./DashTeamView.css";

const DashTeamEmptyState = () => (
  <div className="card-body-content-parent">
    <div>
      <span className="pficon pficon-info" id="no-plugin-info-icon" />
    </div>
    <div className="dash-text-div">
      <span className="github-plugin-noplugin-title github-team-noplugin-title">
        Teammates Panel
      </span>
      <p className="github-plugin-noplugin-text">
        In this area, you will be able to add and manage teammates to help you
        with each plugin.
      </p>
    </div>
    <div className="card-body-content-child-right">
      <img src={BrainyTeammatesPointer} alt="Click Add Plugin" />
    </div>
  </div>
);

class DashTeamView extends Component {
  constructor(props) {
    super(props);
    // Point the transform to your sortingColumns. React state can work for this purpose
    // but you can use a state manager as well.
    const getSortingColumns = () => this.state.sortingColumns || {};

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumn({
            sortingColumns: this.state.sortingColumns,
            sortingOrder: defaultSortingOrder,
            selectedColumn
          })
        });
      },
      // Use property or index dependening on the sortingColumns structure specified
      strategy: sort.strategies.byProperty
    });

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty
    });

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = customHeaderFormattersDefinition;

    this.state = {
      // Sort the first column in an ascending way by default.
      sortingColumns: {
        name: {
          direction: TABLE_SORT_DIRECTION.ASC,
          position: 0
        }
      },
      columns: [
        {
          property: "name",
          header: {
            label: "Name",
            props: {
              index: 0,
              rowSpan: 1,
              colSpan: 1,
              sort: true
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 0
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: "title",
          header: {
            label: "Position Title",
            props: {
              index: 1,
              rowSpan: 1,
              colSpan: 1,
              sort: true
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 1
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: "date_joined",
          header: {
            label: "Date Joined",
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 1,
              sort: true
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 2
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: "actions",
          header: {
            label: "Actions",
            props: {
              index: 3,
              rowSpan: 1,
              colSpan: 2
            },
            formatters: [actionHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 3
            },
            formatters: [
              (value, { rowData }) => [
                <Table.Actions key="0">
                  <Table.Button
                    onClick={() => console.log(`clicked ${rowData.name}`)}
                  >
                    Edit
                  </Table.Button>
                </Table.Actions>,
                <Table.Actions key="1">
                  <Table.DropdownKebab id="myKebab" pullRight>
                    <MenuItem>Action</MenuItem>
                    <MenuItem>Another Action</MenuItem>
                    <MenuItem>Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem>Separated link</MenuItem>
                  </Table.DropdownKebab>
                </Table.Actions>
              ]
            ]
          }
        }
      ],
      rows: [{}]
    };
  }

  render() {
    const { plugins } = this.props;
    const { rows, sortingColumns, columns } = this.state;
    const showEmptyState = isEmpty(plugins);

    const sortedRows = sort.sorter({
      columns,
      sortingColumns,
      sort: orderBy,
      strategy: sort.strategies.byProperty
    })(rows);

    return (
      <Col sm={12}>
        <Card>
          <CardTitle>Teammates</CardTitle>
          <CardBody>
            {showEmptyState ? (
              <DashTeamEmptyState />
            ) : (
              <React.Fragment>
                <Table.PfProvider
                  hover
                  dataTable
                  columns={columns}
                  components={{
                    header: {
                      cell: cellProps =>
                        this.customHeaderFormatters({
                          cellProps,
                          columns,
                          sortingColumns
                        })
                    }
                  }}
                >
                  <Table.Header headerRows={resolve.headerRows({ columns })} />
                  <Table.Body
                    rows={sortedRows}
                    rowKey="id"
                    onRow={() => ({
                      role: "row"
                    })}
                  />
                </Table.PfProvider>
              </React.Fragment>
            )}
          </CardBody>
          {!showEmptyState && (
            <CardFooter
              className="card-footer"
              href="#"
              icon={<Icon type="pf" name="add-circle-o" />}
            >
              Add Teammate
            </CardFooter>
          )}
        </Card>
      </Col>
    );
  }
}
DashTeamView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object)
};

DashTeamView.defaultProps = {
  plugins: []
};

export default DashTeamView;
