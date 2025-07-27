import { useEffect, useState } from 'react';
import './batchModeOrderControls.scss';
import { MdDelete, MdDoneAll, MdClose } from 'react-icons/md';
import { useUser } from '../../../store/user-context';

const BatchModeOrderControlls = ({
  active,
  onRemoveBatchPress,
  onSelectAllOrders,
  isAllSelected,
}) => {
  const [visible, setVisible] = useState(active);
  const { user } = useUser();

  useEffect(() => {
    if (active) setVisible(true);
    else {
      // allow fade out animation before hiding
      const timer = setTimeout(() => setVisible(false), 150);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div
      className={`batch-controls-wrapper ${active ? 'open' : 'closed'}`}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      {user && user.permissions.order.remove && (
        <button className="batch-btn danger" onClick={onRemoveBatchPress}>
          <MdDelete size={20} />
        </button>
      )}
      <button className="batch-btn" onClick={onSelectAllOrders}>
        {isAllSelected ? (
          <>
            <MdClose size={20} />
            <span>Deselect</span>
          </>
        ) : (
          <>
            <MdDoneAll size={20} />
            <span>Select all</span>
          </>
        )}
      </button>
    </div>
  );
};

export default BatchModeOrderControlls;
