import { useState } from 'react';
import axios from 'axios';

interface DynamicFormProps {
  type: 'givenMoney' | 'takenMoney' | 'extraMoney';
  username: string;
  initialData?: any; // Use a more specific type if possible
  onUpdate?: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ type, username, initialData, onUpdate }) => {
  const [no, setNo] = useState<number | ''>(initialData?.no || '');
  const [money, setMoney] = useState<number | ''>(initialData?.money || '');
  const [interest, setInterest] = useState<number | ''>(initialData?.interest || '');
  const [note, setNote] = useState<string>(initialData?.note || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (type) {
        case 'givenMoney':
          if (initialData) {
            // Update request
            await axios.put(`/api/updategivenmoney/${username}`, {
              no: initialData.no,
              newno: no,
              newmoney: money
            });
          } else {
            // Add request
            await axios.post(`/api/addvaluegm/${username}`, { no, money });
          }
          break;

        case 'takenMoney':
          if (initialData) {
            // Update request
            await axios.put(`/api/updatetakenmoney/${username}`, {
              no: initialData.no,
              newno: no,
              newmoney: money,
              newinterest: interest
            });
          } else {
            // Add request
            await axios.post(`/api/addvaluetm/${username}`, { no, money, interest });
          }
          break;

        case 'extraMoney':
          if (initialData) {
            // Update request
            await axios.put(`/api/updateextramoney/${username}`, {
              id: initialData.id,
              newmoney: money,
              newnote: note
            });
          } else {
            // Add request
            await axios.post(`/api/addvalueem/${username}`, { money, note });
          }
          break;

        default:
          throw new Error('Unknown type');
      }
      if (onUpdate) onUpdate(); // Refresh or update the list
    } catch (error) {
      console.error('Error handling the form submission:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {type === 'givenMoney' && (
          <>
            <input
              type="number"
              placeholder="No"
              value={no}
              onChange={(e) => setNo(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Money"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
            />
          </>
        )}
        {type === 'takenMoney' && (
          <>
            <input
              type="number"
              placeholder="No"
              value={no}
              onChange={(e) => setNo(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Money"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Interest"
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
            />
          </>
        )}
        {type === 'extraMoney' && (
          <>
            <input
              type="number"
              placeholder="Money"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
            />
            <input
              type="text"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </>
        )}
        <button type="submit">
          {initialData ? 'Update' : `Add ${type}`}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
