import React, { Component } from "react";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
    tr {
      background-color: #fafafa;
    }
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
    tr:nth-child(even) {
      background-color: #fafafa;
    }
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th,
  td {
    border: 1px solid #dbdbdb;
    border-width: 1px;
    padding: 0.5em 0.75em;
    vertical-align: top;
  }
  thead th {
    border-width: 0 0 2px;
    border-width: 1px;
    padding: 0.5em 0.75em;
    vertical-align: top;
    text-align: left;
  }
`;

export default Table;
