import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  children: React.ReactElement;
}

export const UserResolver: React.FC<Props> = ({ children }) => {
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const returnedComponent = useMemo(() => {
    if (isFetchingUser) {
      return <div>Loading...</div>;
    }

    return children;
  }, [isFetchingUser, children]);

  useEffect(() => {
    // TODO: implementar un validator de token
    setIsFetchingUser(false);
  }, []);

  return returnedComponent;
};