import React, { useEffect } from 'react';

import './search_list.css';

export default function SearchList({
  items = [],
  query = '',
  onItemClick = () => {},
  onItemSelect = () => {},
  selected = -1
}) {
  const filteredItems = items.filter((item) => {
    if (!query) {
      return true;
    }

    return item.title.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    onItemSelect(filteredItems[selected], filteredItems.length);
  }, [selected, filteredItems.length]);

  const renderedItems = filteredItems.map((item, index) => {
    const isSelected = index === selected;
    const className = isSelected ?
    'search-list__item search-list__item--selected' :
    'search-list__item';

    return (
      <li
        key={item.id}
        className={className}
        onClick={onItemClick.bind(null, item.url)}
      >
        {item.title}
      </li>
    );
  });

  return (
    <ul className="search-list">
      {renderedItems}
    </ul>
  )
}
