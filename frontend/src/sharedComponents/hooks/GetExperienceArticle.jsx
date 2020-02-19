import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

const useGetExperienceArticle = (id) => {
  // State
  const [article, setArticle] = useState(null);

  // Redux
  const dispatch = useDispatch();

  // Fetch url
  const url = `/api/ExperiencePost/${id}`;

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
          const Article = await response.json();
          // return tags
          return setArticle(Article);
        }

        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to get Article. Please try again later.'));
        return setArticle(null);
      } catch (_) {
        // Dispatch error if we failed to get tags
        dispatch(alertActions.error('Failed to get Article. Please try again later.'));
        return setArticle(null);
      }
    };
    init();
  }, []);

  return article;
};

export {
  useGetExperienceArticle,
};
