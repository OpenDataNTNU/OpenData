import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

const useGetMetadata = (id) => {
  // State
  const [metadata, setMetadata] = useState(null);

  // Redux
  const dispatch = useDispatch();

  // Fetch url
  const url = `/api/Metadata/${id}`;

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
          const Metadata = await response.json();
          // Map over data and return the tag name
          // return tags
          return setMetadata(Metadata);
        }

        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve dataset. Please try again later.'));
        return setMetadata(null);
      } catch (_) {
        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve dataset. Please try again later.'));
        return setMetadata(null);
      }
    };
    init();
  }, []);

  return metadata;
};

export {
  useGetMetadata,
};
