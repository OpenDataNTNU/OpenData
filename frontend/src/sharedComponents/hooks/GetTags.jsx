import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

const useGetTags = () => {
  // State
  const [tags, setTags] = useState(null);

  // Redux
  const dispatch = useDispatch();

  // Fetch url
  const url = '/api/Tag';

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
          let Tags = await response.json();
          // Map over data and return the tag name
          Tags = Tags.length > 0 ? Tags.map((tag) => tag.name) : [];
          // return tags
          return setTags(Tags);
        }

        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve tags. Please try again later.'));
        return setTags(null);
      } catch (_) {
        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to retrieve tags. Please try again later.'));
        return setTags(null);
      }
    };
    init();
  }, []);

  return tags;
};

export {
  useGetTags,
};
