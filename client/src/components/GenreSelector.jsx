
import React from 'react';
import Select from 'react-dropdown-select';

export default function GenreSelector({ genre, setGenre, className, dropdownPosition = "bottom"}) {
  const genreOptions = [
    { value: 'all', label: 'All' },
    { value: 'edm', label: 'EDM' },
    { value: 'latin', label: 'Latin' },
    { value: 'pop', label: 'Pop' },
    { value: 'r&b', label: 'R&B' },
    { value: 'rap', label: 'Rap' },
    { value: 'rock', label: 'Rock' },
  ];

  return (
    <div className={className}>
      <Select
        options={genreOptions}
        values={[{ value: genre, label: genre.charAt(0).toUpperCase() + genre.slice(1) }]}
        onChange={(values) => setGenre(values[0]?.value)}
        multi={false}
        placeholder="Choose a genre"
        style={{
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto',
          fontSize: '0.875rem',
          border: '1px solid black',
          height: '2.3em',
          boxSizing: 'border-box',
        }}
        dropdownPosition={dropdownPosition} 
        dropdownHeight="auto"
        itemRenderer={({ item, methods }) => {
          const isSelected = methods.isSelected(item);

          return (
            <div
              onClick={() => methods.addItem(item)}
              style={{
                padding: '12px 10%',
                textAlign: 'left',
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#d0d0d0' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </div>
          );
        }}
      ></Select>
    </div>
  );
}
