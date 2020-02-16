import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

const useGetValidMunicipalities = () => {
  // State
  const [municipalities, setMunicipalities] = useState(null);

  // Redux
  const dispatch = useDispatch();

  // Fetch url
  const url = '/api/Municipality';

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
          const Municipalities = await response.json();
          // return municipalities
          return setMunicipalities(Municipalities);
        }

        // Dispatch error if we failed to get municipalities
        dispatch(alertActions.error('Failed to retrieve municipalities. Please try again later.'));
        return setMunicipalities(null);
      } catch (_) {
        // Dispatch error if we failed to get municipalities
        dispatch(alertActions.error('Failed to retrieve municipalities. Please try again later.'));
        return setMunicipalities(null);
      }
    };
    init();
  }, []);

  return municipalities;
};

export {
  useGetValidMunicipalities,
};
