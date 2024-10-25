/*import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { fetchData, sendData } from 'http://168.172.188.133:5000/api/accept'; // adjust path as necessary

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then((fetchedData) => setData(fetchedData));
  }, []);

  return (
    <View>
      {data ? <Text>{JSON.stringify(data)}</Text> : <Text>Loading...</Text>}
    </View>
  );
};

export default MyComponent;*/
