import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

const useGetMetadatas = () => {
  // State
  const [metadatas, setMetadatas] = useState(null);

  // Redux
  const dispatch = useDispatch();

  // Fetch url
  const url = '/api/Metadata';

  useEffect(() => {
    const init = async () => {
      // Fetch request => returns response
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        });

        // Check that the response was ok with status code 200
        if (response.ok && response.status === 200) {
          // Get json data
          let Metadatas = await response.json();
          // Map over data and return the tag name
          Metadatas = Metadatas.length > 0 ? Metadatas : [];
          // return tags
          return setMetadatas(Metadatas);
        }

        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve datasets. Please try again later.'));
        return setMetadatas(null);
      } catch (_) {
        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve datasets. Please try again later.'));
        return setMetadatas(null);
      }
    };
    init();
  }, []);

  return metadatas;
};

export {
  useGetMetadatas,
};
