import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

export const useGetFormats = () => {
  const [formats, setFormats] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch('/api/DataFormat');
        const { ok } = res;
        if (!ok) {
          throw new Error();
        }
        const receivedFormats = await res.json();
        setFormats(receivedFormats);
      } catch (err) {
        dispatch(alertActions.error('Failed to retrieve formats. Please try again later.'));
      }
    };
    internal();
  }, []);

  return formats;
};
