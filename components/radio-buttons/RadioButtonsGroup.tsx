import { RadioButtonOption } from '../../global/types';
import './radioButtonsGroup.scss';

interface Props {
  radioButtons: RadioButtonOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function RadioButtonsGroup({ radioButtons, selectedId, onSelect }: Props) {
  return (
    <div className="radio-group">
      {radioButtons.map((btn) => (
        <div
          key={btn.id}
          className={`radio-button ${selectedId === btn.id ? 'radio-btn-selected' : ''}`}
          onClick={() => onSelect(btn.id)}
        >
          <span className="dot" />
          <span className="label">{btn.label}</span>
        </div>
      ))}
    </div>
  );
}

export default RadioButtonsGroup;
