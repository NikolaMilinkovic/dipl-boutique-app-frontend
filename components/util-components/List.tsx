import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

function List({ data }) {
  return (
    <div style={{ height: '60vh' }}>
      <Virtuoso
        data={data}
        itemContent={(index, item) => (
          <div key={item._id} className="list-item">
            <br />
            {item.name}
          </div>
        )}
      />
    </div>
  );
}

export default List;
