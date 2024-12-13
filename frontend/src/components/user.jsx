import React, { useContext } from 'react';
import UserContext from '../userContext/userContext';

const UserInfoDisplay = () => {
  const { userInfo, isLoggedIn } = useContext(UserContext);

  return (
    <div style={{ padding: '10px', border: '1px solid black', backgroundColor: '#f9f9f9', margin: '10px' }}>
      <h2>User Info</h2>
      {isLoggedIn ? (
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      ) : (
        <p>No user is logged in.</p>
      )}
      <div>
        {userInfo.role}
      </div>
    </div>
  );
};

export default UserInfoDisplay;
