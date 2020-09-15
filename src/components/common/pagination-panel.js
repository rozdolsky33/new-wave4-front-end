import React from "react";
import { Pagination } from "react-bootstrap";

export default function PaginationPanel (props) {
  let getPages = () => {
    const pagesList = [];
    for (let i = 0; i < props.totalPages; i++) {
      if ( i === props.currentPage ) {
        pagesList.push(<Pagination.Item active key={i}>{i+1}</Pagination.Item>);
      } else if ((i === 0 || i === props.totalPages - 1) ||
        (i < props.currentPage + 2 && i > props.currentPage - 2)) {
        pagesList.push(<Pagination.Item key={i} onClick={() => props.selectPage(i)}>{i+1}</Pagination.Item>);
      } else if (i === props.currentPage + 2 || i === props.currentPage - 2) {
        pagesList.push(<Pagination.Ellipsis />);
      }
    }
    return pagesList;
  };

  return (<>{props.totalPages > 1 && <Pagination className="m-0">{getPages()}</Pagination>}</>);
}
